import { PassThrough, Transform } from 'node:stream'
import { pipeline } from 'node:stream/promises'
import { stringify } from 'csv-stringify'
import { ilike } from 'drizzle-orm'
import { z } from 'zod'
import { db, pg } from '@/infra/db'
import { schema } from '@/infra/db'
import { uploadFileToStorage } from '@/infra/storage/upload-file-to-storage'
import { type Either, makeRight } from '@/shared/either'

const exportLinksInput = z.object({
  searchQuery: z.string().optional(),
})

type ExportLinksInput = z.input<typeof exportLinksInput>

type ExportLinksOutput = {
  reportUrl: string
}

export async function exportLinks(
  input: ExportLinksInput = {}
): Promise<Either<never, ExportLinksOutput>> {
  const { searchQuery } = exportLinksInput.parse(input)

  const { sql, params } = db
    .select({
      id: schema.links.id,
      originalUrl: schema.links.originalUrl,
      shortUrl: schema.links.shortUrl,
      accessCount: schema.links.accessCount,
      createdAt: schema.links.createdAt,
    })
    .from(schema.links)
    .where(searchQuery ? ilike(schema.links.shortUrl, `%${searchQuery}%`) : undefined)
    .orderBy(schema.links.createdAt)
    .toSQL()

  // Cursor do Postgres: lê o banco em lotes sem carregar tudo em memória
  const cursor = pg.unsafe(sql, params as string[]).cursor(50)

  const csv = stringify({
    delimiter: ',',
    header: true,
    columns: [
      { key: 'id', header: 'ID' },
      { key: 'original_url', header: 'URL original' },
      { key: 'short_url', header: 'URL encurtada' },
      { key: 'access_count', header: 'Contagem de acessos' },
      { key: 'created_at', header: 'Data de criação' },
    ],
  })

  const uploadToStorageStream = new PassThrough()

  const convertToCSVPipeline = pipeline(
    cursor,
    new Transform({
      objectMode: true,
      transform(chunks: unknown[], _encoding, callback) {
        for (const chunk of chunks) {
          this.push(chunk)
        }
        callback()
      },
    }),
    csv,
    uploadToStorageStream
  )

  const uploadToStorage = uploadFileToStorage({
    contentType: 'text/csv',
    folder: 'downloads',
    fileName: `${new Date().toISOString()}-links.csv`,
    contentStream: uploadToStorageStream,
  })

  const [{ url }] = await Promise.all([uploadToStorage, convertToCSVPipeline])

  return makeRight({ reportUrl: url })
}

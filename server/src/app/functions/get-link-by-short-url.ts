import { eq } from 'drizzle-orm'
import { z } from 'zod'
import { db, schema } from '@/infra/db'
import { type Either, makeLeft, makeRight } from '@/shared/either'
import { LinkNotFound } from '../errors/link-not-found'

const getLinkByShortUrlInput = z.object({
  shortUrl: z.string().trim().toLowerCase(),
})

type GetLinkByShortUrlInput = z.input<typeof getLinkByShortUrlInput>

type GetLinkByShortUrlOutput = {
  id: string
  originalUrl: string
  shortUrl: string
  accessCount: number
  createdAt: Date
}

export async function getLinkByShortUrl(
  input: GetLinkByShortUrlInput
): Promise<Either<LinkNotFound, GetLinkByShortUrlOutput>> {
  const { shortUrl } = getLinkByShortUrlInput.parse(input)

  const link = await db.query.links.findFirst({
    where: eq(schema.links.shortUrl, shortUrl),
  })

  if (!link) {
    return makeLeft(new LinkNotFound())
  }

  return makeRight(link)
}

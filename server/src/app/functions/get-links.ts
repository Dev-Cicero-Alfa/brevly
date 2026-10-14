import { and, asc, desc, gt, ilike, lt } from 'drizzle-orm'
import { z } from 'zod'
import { db, schema } from '@/infra/db'
import { type Either, makeRight } from '@/shared/either'

const getLinksInput = z.object({
  searchQuery: z.string().optional(),
  sortBy: z.enum(['createdAt']).optional(),
  sortDirection: z.enum(['asc', 'desc']).optional(),
  // Paginação por cursor (data de criação do último item), performática para listas grandes
  cursor: z.coerce.date().optional(),
  pageSize: z.coerce.number().int().min(1).max(100).optional().default(20),
})

// O cursor pode chegar como string ISO (querystring) ou Date (uso interno); z.coerce.date() converte
type GetLinksInput = Omit<z.input<typeof getLinksInput>, 'cursor'> & { cursor?: string | Date }

type GetLinksOutput = {
  links: {
    id: string
    originalUrl: string
    shortUrl: string
    accessCount: number
    createdAt: Date
  }[]
  nextCursor: Date | null
}

export async function getLinks(input: GetLinksInput = {}): Promise<Either<never, GetLinksOutput>> {
  const { searchQuery, sortBy, sortDirection, cursor, pageSize } = getLinksInput.parse(input)

  const direction = sortDirection === 'asc' ? asc : desc
  const orderColumn = schema.links.createdAt // único critério suportado hoje (sortBy = 'createdAt')
  void sortBy

  const rows = await db
    .select()
    .from(schema.links)
    .where(
      and(
        searchQuery ? ilike(schema.links.shortUrl, `%${searchQuery}%`) : undefined,
        cursor
          ? sortDirection === 'asc'
            ? gt(schema.links.createdAt, cursor)
            : lt(schema.links.createdAt, cursor)
          : undefined
      )
    )
    .orderBy(direction(orderColumn))
    // Busca um a mais para saber se existe próxima página
    .limit(pageSize + 1)

  const hasMore = rows.length > pageSize
  const links = hasMore ? rows.slice(0, pageSize) : rows
  const nextCursor = hasMore ? links[links.length - 1].createdAt : null

  return makeRight({ links, nextCursor })
}

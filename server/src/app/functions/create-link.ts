import { eq } from 'drizzle-orm'
import { z } from 'zod'
import { db } from '@/infra/db'
import { schema } from '@/infra/db'
import { type Either, makeLeft, makeRight } from '@/shared/either'
import { ShortUrlAlreadyExists } from '../errors/short-url-already-exists'

/** Regra de formato da URL encurtada: 3 a 30 caracteres, letras, números, hífen ou underscore. */
export const shortUrlSchema = z
  .string()
  .trim()
  .min(3, 'A URL encurtada deve ter no mínimo 3 caracteres.')
  .max(30, 'A URL encurtada deve ter no máximo 30 caracteres.')
  .regex(/^[a-zA-Z0-9_-]+$/, 'Use apenas letras, números, hífen (-) e underscore (_).')
  .transform((value) => value.toLowerCase())

export const createLinkInput = z.object({
  originalUrl: z.string().trim().url('Informe uma URL válida.'),
  shortUrl: shortUrlSchema,
})

export type CreateLinkInput = z.input<typeof createLinkInput>

export type CreateLinkOutput = {
  id: string
  originalUrl: string
  shortUrl: string
  accessCount: number
  createdAt: Date
}

export async function createLink(
  input: CreateLinkInput
): Promise<Either<ShortUrlAlreadyExists, CreateLinkOutput>> {
  const { originalUrl, shortUrl } = createLinkInput.parse(input)

  const existing = await db.query.links.findFirst({
    columns: { id: true },
    where: eq(schema.links.shortUrl, shortUrl),
  })

  if (existing) {
    return makeLeft(new ShortUrlAlreadyExists())
  }

  const [link] = await db.insert(schema.links).values({ originalUrl, shortUrl }).returning()

  return makeRight(link)
}

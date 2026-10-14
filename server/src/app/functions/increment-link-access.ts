import { eq, sql } from 'drizzle-orm'
import { z } from 'zod'
import { db, schema } from '@/infra/db'
import { type Either, makeLeft, makeRight } from '@/shared/either'
import { LinkNotFound } from '../errors/link-not-found'

const incrementLinkAccessInput = z.object({
  id: z.string(),
})

type IncrementLinkAccessInput = z.input<typeof incrementLinkAccessInput>

export async function incrementLinkAccess(
  input: IncrementLinkAccessInput
): Promise<Either<LinkNotFound, { accessCount: number }>> {
  const { id } = incrementLinkAccessInput.parse(input)

  // Incremento atômico direto no banco, evitando condições de corrida
  const [updated] = await db
    .update(schema.links)
    .set({ accessCount: sql`${schema.links.accessCount} + 1` })
    .where(eq(schema.links.id, id))
    .returning({ accessCount: schema.links.accessCount })

  if (!updated) {
    return makeLeft(new LinkNotFound())
  }

  return makeRight(updated)
}

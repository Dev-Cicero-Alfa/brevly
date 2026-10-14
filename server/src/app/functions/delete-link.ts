import { eq } from 'drizzle-orm'
import { z } from 'zod'
import { db, schema } from '@/infra/db'
import { type Either, makeLeft, makeRight } from '@/shared/either'
import { LinkNotFound } from '../errors/link-not-found'

const deleteLinkInput = z.object({
  id: z.string(),
})

type DeleteLinkInput = z.input<typeof deleteLinkInput>

export async function deleteLink(input: DeleteLinkInput): Promise<Either<LinkNotFound, null>> {
  const { id } = deleteLinkInput.parse(input)

  const deleted = await db
    .delete(schema.links)
    .where(eq(schema.links.id, id))
    .returning({ id: schema.links.id })

  if (deleted.length === 0) {
    return makeLeft(new LinkNotFound())
  }

  return makeRight(null)
}

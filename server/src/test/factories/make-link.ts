import { randomUUID } from 'node:crypto'
import { db, schema } from '@/infra/db'
import type { InferInsertModel } from 'drizzle-orm'

export async function makeLink(overrides?: Partial<InferInsertModel<typeof schema.links>>) {
  const [link] = await db
    .insert(schema.links)
    .values({
      originalUrl: `https://example.com/${randomUUID()}`,
      shortUrl: randomUUID().slice(0, 8),
      ...overrides,
    })
    .returning()

  return link
}

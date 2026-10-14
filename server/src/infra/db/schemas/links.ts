import { createId } from '@paralleldrive/cuid2'
import { index, integer, pgTable, text, timestamp } from 'drizzle-orm/pg-core'

export const links = pgTable(
  'links',
  {
    id: text('id').primaryKey().$defaultFn(() => createId()),
    originalUrl: text('original_url').notNull(),
    shortUrl: text('short_url').notNull().unique(),
    accessCount: integer('access_count').notNull().default(0),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    // Índice para a listagem performática ordenada por data de criação
    index('links_created_at_idx').on(table.createdAt.desc()),
  ]
)

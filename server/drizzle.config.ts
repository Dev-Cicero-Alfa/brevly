import { defineConfig } from 'drizzle-kit'
import { env } from './src/env'

export default defineConfig({
  dialect: 'postgresql',
  dbCredentials: {
    url: env.DATABASE_URL,
  },
  out: 'src/infra/db/migrations',
  schema: 'src/infra/db/schemas/*',
})

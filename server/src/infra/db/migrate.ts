import { migrate } from 'drizzle-orm/postgres-js/migrator'
import { db, pg } from './index'

/**
 * Aplica as migrations em produção (usado pelo container Docker),
 * sem depender do drizzle-kit (dependência de desenvolvimento).
 */
async function run() {
  await migrate(db, { migrationsFolder: 'migrations' })
  console.log('✅ Migrations aplicadas com sucesso')
  await pg.end()
}

run().catch((error) => {
  console.error('❌ Erro ao aplicar migrations', error)
  process.exit(1)
})

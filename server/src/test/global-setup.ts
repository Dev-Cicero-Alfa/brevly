import { execSync } from 'node:child_process'
import { config } from 'dotenv'

export default function setup() {
  config({ path: '.env.test', override: true })
  process.env.NODE_ENV = 'test'

  // Aplica as migrations no banco de testes antes de rodar a suíte
  execSync('npx drizzle-kit migrate', { stdio: 'inherit', env: process.env })
}

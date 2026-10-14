import { defineConfig } from 'tsup'

export default defineConfig({
  entry: {
    server: 'src/infra/http/server.ts',
    migrate: 'src/infra/db/migrate.ts',
  },
  format: ['esm'],
  target: 'node22',
  outDir: 'dist',
  clean: true,
  sourcemap: true,
  // Dependências ficam em node_modules (não são empacotadas)
  external: [/node_modules/],
})

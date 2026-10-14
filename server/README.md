# Brev.ly — Server

API do encurtador de URLs. Node.js 22 · TypeScript · Fastify · Drizzle ORM · PostgreSQL · Cloudflare R2 · Zod · Vitest · Docker.

## Scripts

| Script                | Descrição                                              |
| --------------------- | ------------------------------------------------------ |
| `npm run dev`         | Sobe a API em modo watch (`tsx`)                       |
| `npm run build`       | Gera o `dist/` com `tsup`                              |
| `npm start`           | Executa o build                                        |
| `npm run db:migrate`  | Aplica as migrations (drizzle-kit)                     |
| `npm run db:generate` | Gera uma nova migration a partir dos schemas           |
| `npm test`            | Roda a suíte de testes (requer `.env.test`)            |
| `npm run lint`        | Biome                                                  |

## Estrutura

```
src/
├── env.ts                      # validação das variáveis de ambiente (Zod)
├── shared/either.ts            # Either (Left/Right) para tratamento funcional de erros
├── app/
│   ├── errors/                 # erros de domínio (LinkNotFound, ShortUrlAlreadyExists)
│   └── functions/              # casos de uso: create, delete, get, list, increment, export
└── infra/
    ├── db/                     # drizzle + schemas + migrations
    ├── storage/                # client S3 (R2) + upload por stream
    └── http/                   # Fastify: server, rotas e schemas (OpenAPI em /docs)
```

A exportação do CSV lê o banco com **cursor do Postgres** e faz o upload para o R2 por **stream**, sem carregar todos os registros em memória. O nome do arquivo é gerado com `randomUUID()`.

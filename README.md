# Brev.ly — Encurtador de URLs

Desafio prático da disciplina **Fundamentos Técnicos e Estratégicos** (Pós-graduação Full-Stack com IA — Rocketseat).

Aplicação Full-Stack que permite cadastrar, listar e remover links encurtados, gerar um relatório CSV dos acessos (armazenado em uma CDN) e redirecionar corretamente o link encurtado para o link original.

```
brevly/
├── server/   # API — Node.js, TypeScript, Fastify, Drizzle ORM, PostgreSQL, Cloudflare R2, Docker
└── web/      # SPA — React, Vite, TypeScript, TailwindCSS, React Query, React Hook Form, Zod
```

## Rodando o projeto

### 1. Back-end (`server`)

```bash
cd server
cp .env.example .env            # preencha as credenciais do Cloudflare R2
docker compose up -d db         # sobe o PostgreSQL (porta 5433 no host)
npm install
npm run db:migrate              # aplica as migrations
npm run dev                     # API em http://localhost:3333 (docs em /docs)
```

Testes (usam o banco `brevly_test`, criado automaticamente pelo container):

```bash
cp .env.test.example .env.test
npm test
```

Build da imagem Docker (multi-stage, usuário sem privilégios, migrations aplicadas na inicialização):

```bash
docker build -t brevly-server .
# ou, com banco + API juntos:
docker compose up --build
```

### 2. Front-end (`web`)

```bash
cd web
cp .env.example .env
npm install
npm run dev                     # http://localhost:5173
```

## Rotas da API

| Método | Rota                 | Descrição                                                   |
| ------ | -------------------- | ----------------------------------------------------------- |
| POST   | `/links`             | Cria um link (`originalUrl`, `shortUrl`) — 409 se já existir |
| GET    | `/links`             | Lista os links (paginação por cursor, `searchQuery`)        |
| GET    | `/links/:shortUrl`   | Obtém a URL original a partir da URL encurtada              |
| PATCH  | `/links/:id/access`  | Incrementa a contagem de acessos                            |
| DELETE | `/links/:id`         | Remove um link                                              |
| POST   | `/links/exports`     | Gera o CSV, envia para o R2 e retorna a URL pública         |
| GET    | `/docs`              | Documentação OpenAPI (Swagger UI)                           |

Decisão de projeto: as operações de **remoção** e **incremento de acessos** usam o `id` do link; a busca para redirecionamento usa a URL encurtada.

## Páginas do front-end

- `/` — formulário de cadastro e listagem dos links (empty state, loading, download do CSV, copiar/remover).
- `/:url-encurtada` — busca o link na API, registra o acesso e redireciona para a URL original.
- `*` — página de recurso não encontrado (404).

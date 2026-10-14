# ---------- Estágio 1: instala dependências e gera o build ----------
FROM node:22-alpine AS build

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install --no-audit --no-fund

COPY . .
RUN npm run build && npm prune --omit=dev

# ---------- Estágio 2: imagem final enxuta ----------
FROM node:22-alpine AS runner

ENV NODE_ENV=production
WORKDIR /usr/src/app

# Executa com usuário sem privilégios
RUN addgroup -S app && adduser -S app -G app

COPY --from=build --chown=app:app /usr/src/app/package*.json ./
COPY --from=build --chown=app:app /usr/src/app/node_modules ./node_modules
COPY --from=build --chown=app:app /usr/src/app/dist ./dist
# Migrations SQL usadas por `node dist/migrate.js` na inicialização
COPY --from=build --chown=app:app /usr/src/app/src/infra/db/migrations ./migrations

USER app

EXPOSE 3333

# Aplica as migrations e sobe a API
CMD ["sh", "-c", "node dist/migrate.js && node dist/server.js"]

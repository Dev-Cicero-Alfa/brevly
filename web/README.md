# Brev.ly — Web

SPA do encurtador de URLs. React 18 · Vite · TypeScript · TailwindCSS v4 · React Query · React Hook Form · Zod · React Router · Phosphor Icons · Sonner.

## Scripts

| Script          | Descrição                         |
| --------------- | --------------------------------- |
| `npm run dev`   | Servidor de desenvolvimento       |
| `npm run build` | Type-check + build de produção    |
| `npm run lint`  | Biome                             |

## Estrutura

```
src/
├── env.ts                 # VITE_FRONTEND_URL / VITE_BACKEND_URL validadas com Zod
├── index.css              # Style Guide (cores, tipografia) via @theme do Tailwind v4
├── routes.tsx             # /, /404, /:shortUrl, *
├── http/links.ts          # chamadas à API
├── lib/                   # axios, react-query, utils
├── components/            # Logo, CreateLinkForm, LinksList, LinkItem, ui/*
└── pages/                 # Home, Redirect, NotFound
```

Para o deploy em SPA (Vercel/Netlify/S3+CloudFront), configure o fallback de todas as rotas para `index.html`.

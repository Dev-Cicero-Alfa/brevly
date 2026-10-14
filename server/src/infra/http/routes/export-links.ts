import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { exportLinks } from '@/app/functions/export-links'
import { unwrapEither } from '@/shared/either'

export const exportLinksRoute: FastifyPluginAsyncZod = async (server) => {
  server.post(
    '/links/exports',
    {
      schema: {
        summary: 'Exporta os links em CSV e retorna a URL pública do arquivo (CDN)',
        tags: ['Links'],
        querystring: z.object({
          searchQuery: z.string().optional(),
        }),
        response: {
          201: z.object({ reportUrl: z.string() }),
        },
      },
    },
    async (request, reply) => {
      const result = await exportLinks(request.query)

      return reply.status(201).send(unwrapEither(result))
    }
  )
}

import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { getLinks } from '@/app/functions/get-links'
import { unwrapEither } from '@/shared/either'
import { linkSchema } from '../schemas/link'

export const getLinksRoute: FastifyPluginAsyncZod = async (server) => {
  server.get(
    '/links',
    {
      schema: {
        summary: 'Lista os links cadastrados (paginação por cursor)',
        tags: ['Links'],
        querystring: z.object({
          searchQuery: z.string().optional(),
          sortBy: z.enum(['createdAt']).optional(),
          sortDirection: z.enum(['asc', 'desc']).optional(),
          cursor: z.string().datetime().optional(),
          pageSize: z.coerce.number().int().min(1).max(100).optional(),
        }),
        response: {
          200: z.object({
            links: z.array(linkSchema),
            nextCursor: z.date().nullable(),
          }),
        },
      },
    },
    async (request, reply) => {
      const result = await getLinks(request.query)

      return reply.status(200).send(unwrapEither(result))
    }
  )
}

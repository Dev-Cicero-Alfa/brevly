import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { deleteLink } from '@/app/functions/delete-link'
import { isRight, unwrapEither } from '@/shared/either'
import { errorSchema } from '../schemas/link'

export const deleteLinkRoute: FastifyPluginAsyncZod = async (server) => {
  server.delete(
    '/links/:id',
    {
      schema: {
        summary: 'Remove um link',
        tags: ['Links'],
        params: z.object({ id: z.string() }),
        response: {
          204: z.null().describe('Link removido'),
          404: errorSchema,
        },
      },
    },
    async (request, reply) => {
      const result = await deleteLink(request.params)

      if (isRight(result)) {
        return reply.status(204).send(null)
      }

      return reply.status(404).send({ message: unwrapEither(result).message })
    }
  )
}

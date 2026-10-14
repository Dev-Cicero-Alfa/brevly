import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { incrementLinkAccess } from '@/app/functions/increment-link-access'
import { isRight, unwrapEither } from '@/shared/either'
import { errorSchema } from '../schemas/link'

export const incrementLinkAccessRoute: FastifyPluginAsyncZod = async (server) => {
  server.patch(
    '/links/:id/access',
    {
      schema: {
        summary: 'Incrementa a contagem de acessos de um link',
        tags: ['Links'],
        params: z.object({ id: z.string() }),
        response: {
          200: z.object({ accessCount: z.number() }),
          404: errorSchema,
        },
      },
    },
    async (request, reply) => {
      const result = await incrementLinkAccess(request.params)

      if (isRight(result)) {
        return reply.status(200).send(unwrapEither(result))
      }

      return reply.status(404).send({ message: unwrapEither(result).message })
    }
  )
}

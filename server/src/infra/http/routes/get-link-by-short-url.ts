import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { getLinkByShortUrl } from '@/app/functions/get-link-by-short-url'
import { isRight, unwrapEither } from '@/shared/either'
import { errorSchema, linkSchema } from '../schemas/link'

export const getLinkByShortUrlRoute: FastifyPluginAsyncZod = async (server) => {
  server.get(
    '/links/:shortUrl',
    {
      schema: {
        summary: 'Obtém a URL original a partir da URL encurtada',
        tags: ['Links'],
        params: z.object({ shortUrl: z.string() }),
        response: {
          200: linkSchema,
          404: errorSchema,
        },
      },
    },
    async (request, reply) => {
      const result = await getLinkByShortUrl(request.params)

      if (isRight(result)) {
        return reply.status(200).send(unwrapEither(result))
      }

      return reply.status(404).send({ message: unwrapEither(result).message })
    }
  )
}

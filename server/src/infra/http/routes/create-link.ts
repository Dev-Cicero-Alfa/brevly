import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { createLink, createLinkInput } from '@/app/functions/create-link'
import { isRight, unwrapEither } from '@/shared/either'
import { errorSchema, linkSchema, validationErrorSchema } from '../schemas/link'

export const createLinkRoute: FastifyPluginAsyncZod = async (server) => {
  server.post(
    '/links',
    {
      schema: {
        summary: 'Cria um link encurtado',
        tags: ['Links'],
        body: createLinkInput,
        response: {
          201: linkSchema,
          400: validationErrorSchema,
          409: errorSchema,
        },
      },
    },
    async (request, reply) => {
      const result = await createLink(request.body)

      if (isRight(result)) {
        return reply.status(201).send(unwrapEither(result))
      }

      const error = unwrapEither(result)

      switch (error.constructor.name) {
        case 'ShortUrlAlreadyExists':
          return reply.status(409).send({ message: error.message })
      }
    }
  )
}

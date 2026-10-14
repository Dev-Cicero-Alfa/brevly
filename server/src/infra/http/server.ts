import { fastifyCors } from '@fastify/cors'
import { fastifySwagger } from '@fastify/swagger'
import { fastifySwaggerUi } from '@fastify/swagger-ui'
import { fastify } from 'fastify'
import {
  hasZodFastifySchemaValidationErrors,
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
} from 'fastify-type-provider-zod'
import { env } from '@/env'
import { createLinkRoute } from './routes/create-link'
import { deleteLinkRoute } from './routes/delete-link'
import { exportLinksRoute } from './routes/export-links'
import { getLinkByShortUrlRoute } from './routes/get-link-by-short-url'
import { getLinksRoute } from './routes/get-links'
import { incrementLinkAccessRoute } from './routes/increment-link-access'

export function buildServer() {
  const server = fastify({ logger: env.NODE_ENV !== 'test' })

  server.setValidatorCompiler(validatorCompiler)
  server.setSerializerCompiler(serializerCompiler)

  server.setErrorHandler((error, _request, reply) => {
    if (hasZodFastifySchemaValidationErrors(error)) {
      return reply.status(400).send({
        message: 'Erro de validação.',
        issues: error.validation.map((issue) => ({
          path: issue.instancePath.replace(/^\//, ''),
          message: issue.message,
        })),
      })
    }

    server.log.error(error)

    return reply.status(500).send({ message: 'Erro interno do servidor.' })
  })

  server.register(fastifyCors, { origin: '*' })

  server.register(fastifySwagger, {
    openapi: {
      info: {
        title: 'Brev.ly API',
        description: 'API do encurtador de URLs Brev.ly',
        version: '1.0.0',
      },
    },
    transform: jsonSchemaTransform,
  })

  server.register(fastifySwaggerUi, { routePrefix: '/docs' })

  server.get('/health', { schema: { tags: ['Health'] } }, async () => ({ status: 'ok' }))

  server.register(createLinkRoute)
  server.register(getLinksRoute)
  server.register(getLinkByShortUrlRoute)
  server.register(deleteLinkRoute)
  server.register(incrementLinkAccessRoute)
  server.register(exportLinksRoute)

  return server
}

if (env.NODE_ENV !== 'test') {
  const server = buildServer()

  server.listen({ port: env.PORT, host: '0.0.0.0' }).then(() => {
    console.log(`🚀 HTTP server running on http://localhost:${env.PORT}`)
  })
}

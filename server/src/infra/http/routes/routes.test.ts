import { randomUUID } from 'node:crypto'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { buildServer } from '../server'

const server = buildServer()

beforeAll(async () => {
  await server.ready()
})

afterAll(async () => {
  await server.close()
})

describe('links routes (e2e)', () => {
  it('POST /links creates a link and rejects duplicates / malformed input', async () => {
    const shortUrl = randomUUID().slice(0, 8)

    const created = await server.inject({
      method: 'POST',
      url: '/links',
      payload: { originalUrl: 'https://rocketseat.com.br', shortUrl },
    })
    expect(created.statusCode).toBe(201)
    expect(created.json()).toEqual(expect.objectContaining({ shortUrl, accessCount: 0 }))

    const duplicated = await server.inject({
      method: 'POST',
      url: '/links',
      payload: { originalUrl: 'https://rocketseat.com.br', shortUrl },
    })
    expect(duplicated.statusCode).toBe(409)

    const malformed = await server.inject({
      method: 'POST',
      url: '/links',
      payload: { originalUrl: 'https://rocketseat.com.br', shortUrl: 'bad url!' },
    })
    expect(malformed.statusCode).toBe(400)
    expect(malformed.json()).toHaveProperty('issues')
  })

  it('GET /links/:shortUrl, PATCH /links/:id/access and DELETE /links/:id', async () => {
    const shortUrl = randomUUID().slice(0, 8)

    const created = await server.inject({
      method: 'POST',
      url: '/links',
      payload: { originalUrl: 'https://rocketseat.com.br', shortUrl },
    })
    const { id } = created.json()

    const found = await server.inject({ method: 'GET', url: `/links/${shortUrl}` })
    expect(found.statusCode).toBe(200)
    expect(found.json().originalUrl).toBe('https://rocketseat.com.br')

    const incremented = await server.inject({ method: 'PATCH', url: `/links/${id}/access` })
    expect(incremented.statusCode).toBe(200)
    expect(incremented.json()).toEqual({ accessCount: 1 })

    const list = await server.inject({ method: 'GET', url: `/links?searchQuery=${shortUrl}` })
    expect(list.statusCode).toBe(200)
    expect(list.json().links).toHaveLength(1)

    const deleted = await server.inject({ method: 'DELETE', url: `/links/${id}` })
    expect(deleted.statusCode).toBe(204)

    const notFound = await server.inject({ method: 'GET', url: `/links/${shortUrl}` })
    expect(notFound.statusCode).toBe(404)
  })
})

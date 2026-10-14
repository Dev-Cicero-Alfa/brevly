import { randomUUID } from 'node:crypto'
import { isLeft, isRight, unwrapEither } from '@/shared/either'
import { describe, expect, it } from 'vitest'
import { makeLink } from '@/test/factories/make-link'
import { ShortUrlAlreadyExists } from '../errors/short-url-already-exists'
import { createLink } from './create-link'

describe('create link', () => {
  it('should be able to create a link', async () => {
    const shortUrl = randomUUID().slice(0, 8)

    const sut = await createLink({
      originalUrl: 'https://rocketseat.com.br',
      shortUrl,
    })

    expect(isRight(sut)).toBe(true)
    expect(unwrapEither(sut)).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        originalUrl: 'https://rocketseat.com.br',
        shortUrl,
        accessCount: 0,
      })
    )
  })

  it('should not be able to create a link with an existing short url', async () => {
    const { shortUrl } = await makeLink()

    const sut = await createLink({ originalUrl: 'https://rocketseat.com.br', shortUrl })

    expect(isLeft(sut)).toBe(true)
    expect(unwrapEither(sut)).toBeInstanceOf(ShortUrlAlreadyExists)
  })

  it('should not be able to create a link with a malformed short url', async () => {
    await expect(
      createLink({ originalUrl: 'https://rocketseat.com.br', shortUrl: 'inv alid/url' })
    ).rejects.toThrow()
  })

  it('should not be able to create a link with an invalid original url', async () => {
    await expect(createLink({ originalUrl: 'not-a-url', shortUrl: 'valid-url' })).rejects.toThrow()
  })
})

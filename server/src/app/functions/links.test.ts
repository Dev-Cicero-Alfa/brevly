import { randomUUID } from 'node:crypto'
import { isLeft, isRight, unwrapEither } from '@/shared/either'
import { describe, expect, it } from 'vitest'
import { makeLink } from '@/test/factories/make-link'
import { LinkNotFound } from '../errors/link-not-found'
import { deleteLink } from './delete-link'
import { getLinkByShortUrl } from './get-link-by-short-url'
import { getLinks } from './get-links'
import { incrementLinkAccess } from './increment-link-access'

describe('get link by short url', () => {
  it('should be able to get a link by its short url', async () => {
    const link = await makeLink()

    const sut = await getLinkByShortUrl({ shortUrl: link.shortUrl })

    expect(isRight(sut)).toBe(true)
    expect(unwrapEither(sut)).toEqual(expect.objectContaining({ id: link.id }))
  })

  it('should return LinkNotFound for an unknown short url', async () => {
    const sut = await getLinkByShortUrl({ shortUrl: randomUUID() })

    expect(isLeft(sut)).toBe(true)
    expect(unwrapEither(sut)).toBeInstanceOf(LinkNotFound)
  })
})

describe('increment link access', () => {
  it('should increment the access count', async () => {
    const link = await makeLink()

    await incrementLinkAccess({ id: link.id })
    const sut = await incrementLinkAccess({ id: link.id })

    expect(isRight(sut)).toBe(true)
    expect(unwrapEither(sut)).toEqual({ accessCount: 2 })
  })

  it('should return LinkNotFound for an unknown id', async () => {
    const sut = await incrementLinkAccess({ id: randomUUID() })

    expect(isLeft(sut)).toBe(true)
  })
})

describe('delete link', () => {
  it('should be able to delete a link', async () => {
    const link = await makeLink()

    const sut = await deleteLink({ id: link.id })
    expect(isRight(sut)).toBe(true)

    const after = await getLinkByShortUrl({ shortUrl: link.shortUrl })
    expect(isLeft(after)).toBe(true)
  })

  it('should return LinkNotFound when deleting an unknown id', async () => {
    const sut = await deleteLink({ id: randomUUID() })

    expect(isLeft(sut)).toBe(true)
  })
})

describe('get links', () => {
  it('should list links filtered by search query', async () => {
    const tag = randomUUID().slice(0, 6)

    await makeLink({ shortUrl: `${tag}-a` })
    await makeLink({ shortUrl: `${tag}-b` })
    await makeLink()

    const sut = await getLinks({ searchQuery: tag })

    expect(isRight(sut)).toBe(true)
    const { links } = unwrapEither(sut)
    expect(links).toHaveLength(2)
    expect(links.every((l) => l.shortUrl.startsWith(tag))).toBe(true)
  })

  it('should paginate with a cursor', async () => {
    const tag = randomUUID().slice(0, 6)
    await makeLink({ shortUrl: `${tag}-1` })
    await makeLink({ shortUrl: `${tag}-2` })
    await makeLink({ shortUrl: `${tag}-3` })

    const page1 = unwrapEither(await getLinks({ searchQuery: tag, pageSize: 2 }))
    expect(page1.links).toHaveLength(2)
    expect(page1.nextCursor).not.toBeNull()

    const page2 = unwrapEither(
      await getLinks({ searchQuery: tag, pageSize: 2, cursor: page1.nextCursor ?? undefined })
    )
    expect(page2.links).toHaveLength(1)
    expect(page2.nextCursor).toBeNull()
  })
})

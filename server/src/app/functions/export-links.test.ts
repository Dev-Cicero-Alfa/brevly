import { randomUUID } from 'node:crypto'
import * as upload from '@/infra/storage/upload-file-to-storage'
import { isRight, unwrapEither } from '@/shared/either'
import { describe, expect, it, vi } from 'vitest'
import { makeLink } from '@/test/factories/make-link'
import { exportLinks } from './export-links'

describe('export links', () => {
  it('should export links to a CSV and return its public url', async () => {
    const uploadStub = vi.spyOn(upload, 'uploadFileToStorage').mockImplementationOnce(async () => {
      return { key: `${randomUUID()}.csv`, url: 'https://cdn.example.com/file.csv' }
    })

    const tag = randomUUID().slice(0, 6)
    const link1 = await makeLink({ shortUrl: `${tag}-1` })
    const link2 = await makeLink({ shortUrl: `${tag}-2` })

    const sut = await exportLinks({ searchQuery: tag })

    const generatedCSVStream = uploadStub.mock.calls[0][0].contentStream

    const csvAsString = await new Promise<string>((resolve, reject) => {
      const chunks: Buffer[] = []
      generatedCSVStream.on('data', (chunk: Buffer) => chunks.push(chunk))
      generatedCSVStream.on('end', () => resolve(Buffer.concat(chunks).toString('utf-8')))
      generatedCSVStream.on('error', reject)
    })

    const csvAsArray = csvAsString
      .trim()
      .split('\n')
      .map((row) => row.split(','))

    expect(isRight(sut)).toBe(true)
    expect(unwrapEither(sut)).toEqual({ reportUrl: 'https://cdn.example.com/file.csv' })
    expect(csvAsArray).toEqual([
      ['ID', 'URL original', 'URL encurtada', 'Contagem de acessos', 'Data de criação'],
      [link1.id, link1.originalUrl, link1.shortUrl, '0', expect.any(String)],
      [link2.id, link2.originalUrl, link2.shortUrl, '0', expect.any(String)],
    ])
  })
})

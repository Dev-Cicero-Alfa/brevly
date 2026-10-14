import { randomUUID } from 'node:crypto'
import { basename, extname } from 'node:path'
import type { Readable } from 'node:stream'
import { Upload } from '@aws-sdk/lib-storage'
import { z } from 'zod'
import { env } from '@/env'
import { r2 } from './client'

const uploadFileToStorageInput = z.object({
  folder: z.enum(['downloads']),
  fileName: z.string(),
  contentType: z.string(),
  contentStream: z.custom<Readable>(),
})

type UploadFileToStorageInput = z.input<typeof uploadFileToStorageInput>

export async function uploadFileToStorage(input: UploadFileToStorageInput) {
  const { folder, fileName, contentType, contentStream } = uploadFileToStorageInput.parse(input)

  // Nome aleatório e único para o arquivo, preservando a extensão
  const fileExtension = extname(fileName)
  const fileNameWithoutExtension = basename(fileName, fileExtension)
  const sanitizedFileName = fileNameWithoutExtension.replace(/[^a-zA-Z0-9]/g, '')
  const uniqueFileName = `${folder}/${randomUUID()}-${sanitizedFileName}${fileExtension}`

  const upload = new Upload({
    client: r2,
    params: {
      Key: uniqueFileName,
      Bucket: env.CLOUDFLARE_BUCKET,
      Body: contentStream,
      ContentType: contentType,
    },
  })

  await upload.done()

  return {
    key: uniqueFileName,
    url: new URL(uniqueFileName, env.CLOUDFLARE_PUBLIC_URL).toString(),
  }
}

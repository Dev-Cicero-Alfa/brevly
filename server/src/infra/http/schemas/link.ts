import { z } from 'zod'

export const linkSchema = z.object({
  id: z.string(),
  originalUrl: z.string(),
  shortUrl: z.string(),
  accessCount: z.number(),
  createdAt: z.date(),
})

export const errorSchema = z.object({
  message: z.string(),
})

export const validationErrorSchema = z.object({
  message: z.string(),
  issues: z.array(z.object({ path: z.string(), message: z.string() })),
})

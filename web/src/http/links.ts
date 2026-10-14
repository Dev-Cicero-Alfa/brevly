import { api } from '@/lib/axios'

export interface Link {
  id: string
  originalUrl: string
  shortUrl: string
  accessCount: number
  createdAt: string
}

export interface GetLinksResponse {
  links: Link[]
  nextCursor: string | null
}

export async function getLinks(params?: { cursor?: string; pageSize?: number }) {
  const response = await api.get<GetLinksResponse>('/links', { params })
  return response.data
}

export async function getLinkByShortUrl(shortUrl: string) {
  const response = await api.get<Link>(`/links/${encodeURIComponent(shortUrl)}`)
  return response.data
}

export async function createLink(data: { originalUrl: string; shortUrl: string }) {
  const response = await api.post<Link>('/links', data)
  return response.data
}

export async function deleteLink(id: string) {
  await api.delete(`/links/${id}`)
}

export async function incrementLinkAccess(id: string) {
  const response = await api.patch<{ accessCount: number }>(`/links/${id}/access`)
  return response.data
}

export async function exportLinks() {
  const response = await api.post<{ reportUrl: string }>('/links/exports')
  return response.data
}

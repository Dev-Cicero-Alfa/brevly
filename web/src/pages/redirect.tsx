import { useQuery } from '@tanstack/react-query'
import { isAxiosError } from 'axios'
import { useEffect, useRef } from 'react'
import { Navigate, useParams } from 'react-router-dom'
import { Logo } from '@/components/logo'
import { getLinkByShortUrl, incrementLinkAccess } from '@/http/links'

export function Redirect() {
  const { shortUrl = '' } = useParams<{ shortUrl: string }>()
  const hasRedirected = useRef(false)

  const { data: link, error, isError } = useQuery({
    queryKey: ['link', shortUrl],
    queryFn: () => getLinkByShortUrl(shortUrl),
    retry: false,
    staleTime: Number.POSITIVE_INFINITY,
  })

  useEffect(() => {
    if (!link || hasRedirected.current) return
    hasRedirected.current = true

    // Registra o acesso e redireciona (mesmo que o incremento falhe)
    incrementLinkAccess(link.id)
      .catch(() => null)
      .finally(() => {
        window.location.replace(link.originalUrl)
      })
  }, [link])

  if (isError) {
    const isNotFound = isAxiosError(error) && error.response?.status === 404
    // Link inexistente (404) ou falha de comunicação: exibe a página de não encontrado
    return <Navigate to="/404" replace state={{ shortUrl, isNotFound }} />
  }

  return (
    <main className="flex min-h-dvh items-center justify-center px-3">
      <div className="flex w-full max-w-[580px] flex-col items-center gap-6 rounded-lg bg-gray-100 px-5 py-12 text-center lg:px-12 lg:py-16">
        <Logo iconOnly />

        <h1 className="text-xl font-bold text-gray-600">Redirecionando...</h1>

        <div className="flex flex-col gap-1 text-md text-gray-500">
          <p>O link será aberto automaticamente em alguns instantes.</p>
          <p>
            Não foi redirecionado?{' '}
            {link ? (
              <a
                href={link.originalUrl}
                className="font-semibold text-blue-base underline"
                rel="noreferrer"
              >
                Acesse aqui
              </a>
            ) : (
              <span className="font-semibold text-blue-base underline">Acesse aqui</span>
            )}
          </p>
        </div>
      </div>
    </main>
  )
}

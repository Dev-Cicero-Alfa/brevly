import { DownloadSimple, Link as LinkIcon, Spinner } from '@phosphor-icons/react'
import { useInfiniteQuery, useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { exportLinks, getLinks } from '@/http/links'
import { LinkItem } from './link-item'
import { Button } from './ui/button'

export function LinksList() {
  const {
    data,
    isLoading,
    isFetching,
    isError,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    refetch,
  } = useInfiniteQuery({
    queryKey: ['links'],
    queryFn: ({ pageParam }) => getLinks({ cursor: pageParam, pageSize: 20 }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
  })

  const links = data?.pages.flatMap((page) => page.links) ?? []
  const isEmpty = !isLoading && !isError && links.length === 0

  const { mutate: downloadCsv, isPending: isExporting } = useMutation({
    mutationFn: exportLinks,
    onSuccess: ({ reportUrl }) => {
      window.open(reportUrl, '_blank', 'noopener,noreferrer')
      toast.success('Relatório gerado com sucesso!')
    },
    onError: () => {
      toast.error('Erro ao exportar', { description: 'Não foi possível gerar o CSV.' })
    },
  })

  return (
    <section className="relative flex w-full flex-col gap-5 overflow-hidden rounded-lg bg-gray-100 p-6 lg:w-[580px] lg:p-8">
      {/* Barra de progresso exibida durante o carregamento/atualização */}
      {isFetching ? (
        <div className="absolute inset-x-0 top-0 h-1 overflow-hidden bg-gray-200">
          <div className="h-full w-1/3 animate-[loading_1.2s_ease-in-out_infinite] bg-blue-base" />
        </div>
      ) : null}

      <header className="flex items-center justify-between gap-4">
        <h2 className="text-lg font-bold text-gray-600">Meus links</h2>

        <Button
          variant="secondary"
          onClick={() => downloadCsv()}
          disabled={isEmpty || isLoading || isExporting}
          isLoading={isExporting}
        >
          {isExporting ? null : <DownloadSimple className="size-4 text-gray-600" />}
          Baixar CSV
        </Button>
      </header>

      {isLoading ? (
        <div className="flex flex-col items-center gap-3 border-t border-gray-200 py-6 text-gray-400">
          <Spinner className="size-8 animate-spin" />
          <span className="text-xs uppercase text-gray-500">Carregando links...</span>
        </div>
      ) : null}

      {isError ? (
        <div className="flex flex-col items-center gap-3 border-t border-gray-200 py-6">
          <span className="text-xs uppercase text-gray-500">Não foi possível carregar os links</span>
          <Button variant="secondary" onClick={() => refetch()}>
            Tentar novamente
          </Button>
        </div>
      ) : null}

      {isEmpty ? (
        <div className="flex flex-col items-center gap-3 border-t border-gray-200 py-6 text-gray-400">
          <LinkIcon className="size-8" />
          <span className="text-xs uppercase text-gray-500">
            Ainda não existem links cadastrados
          </span>
        </div>
      ) : null}

      {links.length > 0 ? (
        <>
          <ul className="flex max-h-[60dvh] flex-col overflow-y-auto border-t border-gray-200 pt-3 lg:max-h-[calc(100dvh-16rem)]">
            {links.map((link) => (
              <LinkItem key={link.id} link={link} />
            ))}
          </ul>

          {hasNextPage ? (
            <Button
              variant="secondary"
              className="self-center"
              onClick={() => fetchNextPage()}
              isLoading={isFetchingNextPage}
            >
              Carregar mais
            </Button>
          ) : null}
        </>
      ) : null}
    </section>
  )
}

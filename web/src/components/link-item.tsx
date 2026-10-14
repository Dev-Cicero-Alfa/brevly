import { Copy, Trash } from '@phosphor-icons/react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Link as RouterLink } from 'react-router-dom'
import { toast } from 'sonner'
import { type Link, deleteLink } from '@/http/links'
import { buildShortLink, formatAccessCount, shortDomain } from '@/lib/utils'
import { IconButton } from './ui/icon-button'

interface LinkItemProps {
  link: Link
}

export function LinkItem({ link }: LinkItemProps) {
  const queryClient = useQueryClient()

  const { mutate: removeLink, isPending: isDeleting } = useMutation({
    mutationFn: deleteLink,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['links'] })
      toast.success('Link removido com sucesso!')
    },
    onError: () => {
      toast.error('Erro ao remover', { description: 'Não foi possível remover o link.' })
    },
  })

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(buildShortLink(link.shortUrl))
      toast.info('Link copiado com sucesso', {
        description: `O link ${shortDomain}/${link.shortUrl} foi copiado para a área de transferência.`,
      })
    } catch {
      toast.error('Não foi possível copiar o link.')
    }
  }

  function handleDelete() {
    const confirmed = window.confirm(
      `Você realmente quer apagar o link ${shortDomain}/${link.shortUrl}?`
    )

    if (confirmed) {
      removeLink(link.id)
    }
  }

  return (
    <li className="flex items-center gap-4 border-t border-gray-200 py-3 first:border-t-0 first:pt-0">
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <RouterLink
          to={`/${link.shortUrl}`}
          target="_blank"
          rel="noreferrer"
          className="truncate text-md font-semibold text-blue-base hover:underline"
          title={buildShortLink(link.shortUrl)}
        >
          {shortDomain}/{link.shortUrl}
        </RouterLink>
        <span className="truncate text-sm text-gray-500" title={link.originalUrl}>
          {link.originalUrl}
        </span>
      </div>

      <span className="shrink-0 text-sm text-gray-500">{formatAccessCount(link.accessCount)}</span>

      <div className="flex shrink-0 items-center gap-1">
        <IconButton onClick={handleCopy} aria-label="Copiar link" title="Copiar link">
          <Copy className="size-4" />
        </IconButton>
        <IconButton
          onClick={handleDelete}
          disabled={isDeleting}
          aria-label="Remover link"
          title="Remover link"
        >
          <Trash className="size-4" />
        </IconButton>
      </div>
    </li>
  )
}

import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { isAxiosError } from 'axios'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import { createLink } from '@/http/links'
import { shortDomain } from '@/lib/utils'
import { Button } from './ui/button'
import { Input } from './ui/input'

/** Garante o protocolo (www.exemplo.com.br -> https://www.exemplo.com.br) */
function normalizeUrl(value: string) {
  const trimmed = value.trim()
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`
}

function isValidUrl(value: string) {
  try {
    const url = new URL(normalizeUrl(value))
    return ['http:', 'https:'].includes(url.protocol) && url.hostname.includes('.')
  } catch {
    return false
  }
}

const createLinkSchema = z.object({
  originalUrl: z
    .string()
    .trim()
    .min(1, 'Informe o link original.')
    .refine(isValidUrl, 'Informe uma URL válida.'),
  shortUrl: z
    .string()
    .trim()
    .min(3, 'Informe no mínimo 3 caracteres.')
    .max(30, 'Informe no máximo 30 caracteres.')
    .regex(/^[a-z0-9_-]+$/, 'Informe uma URL minúscula e sem espaço/caracter especial.'),
})

type CreateLinkFormData = z.infer<typeof createLinkSchema>

export function CreateLinkForm() {
  const queryClient = useQueryClient()

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isValid, isDirty },
  } = useForm<CreateLinkFormData>({
    resolver: zodResolver(createLinkSchema),
    mode: 'onBlur',
    defaultValues: { originalUrl: '', shortUrl: '' },
  })

  const { mutateAsync, isPending } = useMutation({
    mutationFn: createLink,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['links'] })
      reset()
      toast.success('Link criado com sucesso!')
    },
    onError: (error) => {
      if (isAxiosError(error) && error.response?.status === 409) {
        setError('shortUrl', { message: 'Essa URL encurtada já existe.' })
        toast.error('Erro no cadastro', {
          description: 'Essa URL encurtada já existe.',
        })
        return
      }

      toast.error('Erro no cadastro', {
        description: 'Não foi possível salvar o link. Tente novamente.',
      })
    },
  })

  async function onSubmit(data: CreateLinkFormData) {
    await mutateAsync({
      originalUrl: normalizeUrl(data.originalUrl),
      shortUrl: data.shortUrl.trim().toLowerCase(),
    })
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex w-full flex-col gap-5 rounded-lg bg-gray-100 p-6 lg:w-[380px] lg:p-8"
      noValidate
    >
      <h2 className="text-lg font-bold text-gray-600">Novo link</h2>

      <div className="flex flex-col gap-4">
        <Input
          label="Link original"
          placeholder="www.exemplo.com.br"
          type="text"
          inputMode="url"
          autoComplete="off"
          error={errors.originalUrl?.message}
          disabled={isPending}
          {...register('originalUrl')}
        />

        <Input
          label="Link encurtado"
          prefix={`${shortDomain}/`}
          autoComplete="off"
          autoCapitalize="none"
          error={errors.shortUrl?.message}
          disabled={isPending}
          {...register('shortUrl')}
        />
      </div>

      <Button type="submit" isLoading={isPending} disabled={!isDirty || !isValid}>
        Salvar link
      </Button>
    </form>
  )
}

import { Link } from 'react-router-dom'

export function NotFound() {
  return (
    <main className="flex min-h-dvh items-center justify-center px-3">
      <div className="flex w-full max-w-[580px] flex-col items-center gap-6 rounded-lg bg-gray-100 px-5 py-12 text-center lg:px-12 lg:py-16">
        <span className="text-[72px] font-bold leading-none text-blue-base" aria-hidden>
          404
        </span>

        <h1 className="text-xl font-bold text-gray-600">Link não encontrado</h1>

        <p className="text-md text-gray-500">
          O link que você está tentando acessar não existe, foi removido ou é uma URL inválida.
          Saiba mais em{' '}
          <Link to="/" className="font-semibold text-blue-base underline">
            brev.ly
          </Link>
          .
        </p>
      </div>
    </main>
  )
}

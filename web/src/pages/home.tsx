import { CreateLinkForm } from '@/components/create-link-form'
import { LinksList } from '@/components/links-list'
import { Logo } from '@/components/logo'

export function Home() {
  return (
    <main className="mx-auto flex w-full max-w-[980px] flex-col gap-6 px-3 py-8 lg:gap-8 lg:px-0 lg:py-[88px]">
      <Logo className="justify-center lg:justify-start" />

      <div className="flex flex-col items-start gap-3 lg:flex-row lg:gap-5">
        <CreateLinkForm />
        <LinksList />
      </div>
    </main>
  )
}

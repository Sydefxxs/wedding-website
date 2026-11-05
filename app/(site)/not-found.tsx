import { ButtonLink } from '@/components/ui/Button'

export default function NotFound() {
  return (
    <section className="container-x flex min-h-[80vh] flex-col items-start justify-center pt-32">
      <p className="eyebrow text-accent">404</p>
      <h1 className="mt-4 text-h1">This page wandered off <em className="font-light">to the dance floor.</em></h1>
      <ButtonLink href="/" className="mt-10">Back home</ButtonLink>
    </section>
  )
}

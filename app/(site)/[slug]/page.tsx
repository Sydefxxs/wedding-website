import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getContent } from '@/lib/content'
import { PageHeader } from '@/components/ui/PageHeader'
import { Photo } from '@/components/ui/Photo'
import { ImageReveal } from '@/components/motion/ImageReveal'
import { Reveal } from '@/components/motion/Reveal'
import { ButtonLink } from '@/components/ui/Button'
import type { CustomSection } from '@/lib/types'
import { cn } from '@/lib/utils'

export async function generateStaticParams() {
  const { pages } = await getContent()
  return pages.length ? pages.map((p) => ({ slug: p.slug })) : [{ slug: 'things-to-do' }]
}

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const { pages } = await getContent()
  const page = pages.find((p) => p.slug === slug)
  return page ? { title: page.title } : {}
}

function Section({ s }: { s: CustomSection }) {
  switch (s._type) {
    case 'richText':
      return (
        <Reveal className="container-x grid gap-8 py-16 md:grid-cols-12 md:py-24">
          {s.heading && <h2 className="text-h2 md:col-span-4">{s.heading}</h2>}
          <p className={cn('text-lead whitespace-pre-line text-ink-2 md:col-span-7', s.heading ? 'md:col-start-6' : 'md:col-start-3')}>{s.body}</p>
        </Reveal>
      )
    case 'imageText':
      return (
        <div className="container-x grid items-center gap-10 py-16 md:grid-cols-12 md:py-24">
          <ImageReveal className={cn('md:col-span-6', s.reverse && 'md:order-last md:col-start-7')}>
            <Photo image={s.image} sizes="(min-width: 768px) 50vw, 100vw" className="aspect-[4/3] w-full" />
          </ImageReveal>
          <Reveal className={cn('md:col-span-5', !s.reverse && 'md:col-start-8')}>
            <h2 className="text-h2">{s.heading}</h2>
            <p className="mt-5 whitespace-pre-line text-ink-2">{s.body}</p>
          </Reveal>
        </div>
      )
    case 'cta':
      return (
        <Reveal className="container-x py-20 text-center md:py-32">
          <h2 className="mx-auto max-w-3xl text-h1">{s.heading}</h2>
          <ButtonLink href={s.href} className="mt-10">{s.buttonLabel}</ButtonLink>
        </Reveal>
      )
  }
}

export default async function CustomPage({ params }: Props) {
  const { slug } = await params
  const { pages } = await getContent()
  const page = pages.find((p) => p.slug === slug)
  if (!page) notFound()
  return (
    <>
      <PageHeader eyebrow={page.eyebrow} title={page.title} />
      {page.sections.map((s) => <Section key={s._key} s={s} />)}
    </>
  )
}

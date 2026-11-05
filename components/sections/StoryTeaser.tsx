import type { StoryMoment } from '@/lib/types'
import { Photo } from '@/components/ui/Photo'
import { Parallax } from '@/components/motion/Parallax'
import { Reveal } from '@/components/motion/Reveal'
import { ButtonLink } from '@/components/ui/Button'

/** Overlapping collage of three story photos moving at different speeds. */
export function StoryTeaser({ story }: { story: StoryMoment[] }) {
  if (story.length < 3) return null
  const [a, b, c] = [story[0], story[2], story[4] ?? story[1]]
  return (
    <section className="section-y container-x overflow-hidden">
      <div className="grid items-center gap-16 md:grid-cols-12">
        <div className="relative order-2 h-[34rem] md:order-1 md:col-span-7 md:h-[44rem]">
          <Parallax amount={6} className="absolute top-0 left-0 h-[70%] w-[58%]">
            <Photo image={a.image} sizes="40vw" className="h-full w-full" />
          </Parallax>
          <Parallax amount={14} className="absolute right-0 bottom-[6%] h-[55%] w-[48%] shadow-[0_20px_60px_-20px_rgba(30,27,24,.35)]">
            <Photo image={b.image} sizes="35vw" className="h-full w-full" />
          </Parallax>
          <Parallax amount={22} className="absolute bottom-0 left-[22%] hidden h-[30%] w-[30%] md:block">
            <Photo image={c.image} sizes="20vw" className="h-full w-full" />
          </Parallax>
        </div>
        <div className="order-1 md:order-2 md:col-span-4 md:col-start-9">
          <Reveal>
            <p className="eyebrow mb-6 text-accent">Our story</p>
            <h2 className="text-h1">How we got <em className="font-light text-rose">here.</em></h2>
            <p className="text-lead mt-8 text-ink-2">From {a.title.toLowerCase()} to {story[story.length - 1].title.toLowerCase()} — the short version, with photos.</p>
            <ButtonLink href="/story" variant="secondary" className="mt-10">Read our story</ButtonLink>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

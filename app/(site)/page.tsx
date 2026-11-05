import { getContent } from '@/lib/content'
import { Hero } from '@/components/sections/Hero'
import { Intro } from '@/components/sections/Intro'
import { WeekendList } from '@/components/sections/WeekendList'
import { StoryTeaser } from '@/components/sections/StoryTeaser'
import { GalleryStrip } from '@/components/sections/GalleryStrip'
import { VenueTeaser } from '@/components/sections/VenueTeaser'

export default async function Home() {
  const c = await getContent()
  return (
    <>
      <Hero s={c.settings} />
      <Intro s={c.settings} />
      <WeekendList events={c.events} />
      <StoryTeaser story={c.story} />
      <GalleryStrip images={c.gallery} />
      <VenueTeaser events={c.events} />
    </>
  )
}

import { cacheLife, cacheTag } from 'next/cache'
import { defineQuery } from 'next-sanity'
import { client } from '@/sanity/lib/client'
import { isSanityConfigured } from '@/sanity/env'
import { placeholderContent as P } from '@/content/placeholder'
import type { CustomSection, Img, SiteContent } from './types'

const IMG = `{ alt, placeholder, hotspot, "asset": asset->{ url, metadata { lqip, dimensions { width, height } } } }`

const CONTENT_QUERY = defineQuery(`{
  "settings": *[_id == "siteSettings"][0]{
    ..., heroImage${IMG}, shareImage${IMG}, introImage${IMG}, registryImage${IMG}
  },
  "events": *[_type == "event"] | order(start asc){ "id": _id, name, start, end, dayLabel, timeLabel, venue, address, mapUrl, attire, description, image${IMG} },
  "story": *[_type == "storyMoment"] | order(order asc){ "id": _id, dateLabel, title, body, image${IMG} },
  "people": *[_type == "person"] | order(order asc){ "id": _id, name, role, note, "group": coalesce(group, "padrinos"), image${IMG} },
  "faqs": *[_type == "faq"] | order(order asc){ "id": _id, question, answer },
  "registry": *[_type == "registryLink"] | order(order asc){ "id": _id, name, url, note },
  "gallery": *[_type == "galleryImage"] | order(order asc){ "id": _id, caption, image${IMG} },
  "pages": *[_type == "page" && defined(slug.current)]{ "slug": slug.current, title, eyebrow, sections[]{ ..., image${IMG} } }
}`)

type SanityImg = {
  alt?: string
  placeholder?: boolean
  hotspot?: { x: number; y: number }
  asset?: { url: string; metadata?: { lqip?: string; dimensions?: { width: number; height: number } } }
} | null | undefined

function toImg(i: SanityImg, fallback: Img): Img {
  if (!i?.asset?.url) return fallback
  return {
    src: i.asset.url,
    alt: i.alt || '',
    width: i.asset.metadata?.dimensions?.width ?? 1600,
    height: i.asset.metadata?.dimensions?.height ?? 1067,
    blurDataURL: i.asset.metadata?.lqip,
    placeholder: i.placeholder ?? false,
    hotspot: i.hotspot ? { x: i.hotspot.x, y: i.hotspot.y } : undefined,
  }
}

const pick = <T,>(v: T | null | undefined, fb: T): T => (v === null || v === undefined || v === '' ? fb : v)
const rotate = <T,>(arr: T[], i: number) => arr[i % arr.length]

/** All site content. Cached; invalidated by the Sanity webhook (tag "content"). */
export async function getContent(): Promise<SiteContent> {
  'use cache'
  cacheTag('content')
  cacheLife('max')

  if (!isSanityConfigured) return P

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const d: any = await client.fetch(CONTENT_QUERY).catch((e) => {
    console.error('[content] Sanity fetch failed, using placeholders', e)
    return null
  })
  if (!d?.settings) return P
  const s = d.settings

  return {
    settings: {
      partnerOne: pick(s.partnerOne, P.settings.partnerOne),
      partnerTwo: pick(s.partnerTwo, P.settings.partnerTwo),
      lastName: pick(s.lastName, P.settings.lastName),
      date: pick(s.date, P.settings.date),
      dateLabel: pick(s.dateLabel, P.settings.dateLabel),
      location: pick(s.location, P.settings.location),
      tagline: pick(s.tagline, P.settings.tagline),
      heroImage: toImg(s.heroImage, P.settings.heroImage),
      shareImage: toImg(s.shareImage, P.settings.shareImage ?? P.settings.heroImage),
      photoCredit: s.photoCredit ?? undefined,
      intro: {
        eyebrow: pick(s.introEyebrow, P.settings.intro.eyebrow),
        heading: pick(s.introHeading, P.settings.intro.heading),
        body: pick(s.introBody, P.settings.intro.body),
        image: toImg(s.introImage, P.settings.intro.image),
      },
      rsvpDeadline: pick(s.rsvpDeadline, P.settings.rsvpDeadline),
      rsvpDeadlineLabel: pick(s.rsvpDeadlineLabel, P.settings.rsvpDeadlineLabel),
      rsvp: {
        heading: pick(s.rsvpHeading, P.settings.rsvp.heading),
        intro: pick(s.rsvpIntro, P.settings.rsvp.intro),
        yesHeading: pick(s.rsvpYesHeading, P.settings.rsvp.yesHeading),
        yesMessage: pick(s.rsvpYesMessage, P.settings.rsvp.yesMessage),
        noHeading: pick(s.rsvpNoHeading, P.settings.rsvp.noHeading),
        noMessage: pick(s.rsvpNoMessage, P.settings.rsvp.noMessage),
        maxParty: pick(s.rsvpMaxParty, P.settings.rsvp.maxParty),
        plusOnes: pick(s.rsvpPlusOnes, P.settings.rsvp.plusOnes),
      },
      hashtag: s.hashtag ?? undefined,
      contactEmail: s.contactEmail ?? undefined,
      nav: s.nav?.length ? s.nav : P.settings.nav,
      footerNote: pick(s.footerNote, P.settings.footerNote),
      colors: s.colors ?? undefined,
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    events: (d.events ?? []).map((e: any, i: number) => ({
      ...e,
      image: e.image?.asset ? toImg(e.image, rotate(P.events, i).image!) : undefined,
    })),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    story: (d.story ?? []).map((m: any, i: number) => ({ ...m, image: toImg(m.image, rotate(P.story, i).image) })),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    people: (d.people ?? []).map((p: any, i: number) => ({ ...p, image: toImg(p.image, rotate(P.people, i).image) })),
    faqs: d.faqs ?? [],
    registry: {
      heading: pick(s.registryHeading, P.registry.heading),
      body: pick(s.registryBody, P.registry.body),
      image: toImg(s.registryImage, P.registry.image),
      links: d.registry ?? [],
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    gallery: (d.gallery ?? []).map((g: any, i: number) => ({ id: g.id, caption: g.caption, ...toImg(g.image, rotate(P.gallery, i)) })),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    pages: (d.pages ?? []).map((pg: any) => ({
      ...pg,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      sections: (pg.sections ?? []).map((sec: any) =>
        sec._type === 'imageText' ? { ...sec, image: toImg(sec.image, P.story[0].image) } : sec,
      ) as CustomSection[],
    })),
  }
}

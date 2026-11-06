export type Img = {
  src: string
  alt: string
  width: number
  height: number
  blurDataURL?: string
  /** true while it's still a temporary photo */
  placeholder?: boolean
  /** focal point 0–1, used as object-position */
  hotspot?: { x: number; y: number }
}

export type NavLink = { label: string; href: string }

/** Wording on the RSVP page. Messages can use {family} {name} {count} {date}. */
export type RsvpCopy = {
  heading: string
  intro: string
  yesHeading: string
  yesMessage: string
  noHeading: string
  noMessage: string
  /** most people one reply can include (adults + children + plus ones) */
  maxParty: number
  /** show the "bringing a plus one?" question */
  plusOnes: boolean
}

import type { SiteColors } from './colors'

export type SiteSettings = {
  partnerOne: string
  partnerTwo: string
  /** shared last name, e.g. "Garza" → "Arath & Ruby Garza" */
  lastName?: string
  date: string // ISO with offset
  dateLabel: string
  location: string
  tagline: string
  heroImage: Img
  /** photo used for link previews in texts / social */
  shareImage?: Img
  /** e.g. "Engagement photos by Roy Esparza Photography" */
  photoCredit?: string
  intro: { eyebrow: string; heading: string; body: string; image: Img }
  rsvpDeadline: string
  rsvpDeadlineLabel: string
  rsvp: RsvpCopy
  hashtag?: string
  contactEmail?: string
  nav: NavLink[]
  footerNote: string
  /** the couple's color overrides (empty = original colors) */
  colors?: SiteColors
}

export type WeddingEvent = {
  id: string
  name: string
  start: string
  end?: string
  timeLabel: string
  dayLabel: string
  venue: string
  address: string
  mapUrl?: string
  attire?: string
  description: string
  image?: Img
}

export type StoryMoment = { id: string; dateLabel: string; title: string; body: string; image: Img }

export type PersonGroup = 'parents' | 'padrinos'
export type Person = { id: string; name: string; role: string; note?: string; group: PersonGroup; image: Img }

export type Faq = { id: string; question: string; answer: string }

export type Registry = { id: string; name: string; url: string; note?: string }

export type GalleryImage = Img & { id: string; caption?: string }

export type CustomSection =
  | { _type: 'richText'; _key: string; heading?: string; body: string }
  | { _type: 'imageText'; _key: string; heading: string; body: string; image: Img; reverse?: boolean }
  | { _type: 'cta'; _key: string; heading: string; buttonLabel: string; href: string }

export type CustomPage = { slug: string; title: string; eyebrow?: string; sections: CustomSection[] }

export type SiteContent = {
  settings: SiteSettings
  events: WeddingEvent[]
  story: StoryMoment[]
  people: Person[]
  faqs: Faq[]
  registry: { heading: string; body: string; image: Img; links: Registry[] }
  gallery: GalleryImage[]
  pages: CustomPage[]
}

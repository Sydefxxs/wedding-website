import { defineArrayMember, defineField, defineType } from 'sanity'
import { pageSections } from './objects'

const order = defineField({
  name: 'order',
  title: 'Order',
  type: 'number',
  description: 'Lower numbers show first.',
  initialValue: 10,
})

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  groups: [
    { name: 'couple', title: 'Couple & date', default: true },
    { name: 'home', title: 'Home page' },
    { name: 'registry', title: 'Registry page' },
    { name: 'site', title: 'Menu & footer' },
  ],
  fields: [
    defineField({ name: 'partnerOne', title: 'First name (left)', type: 'string', group: 'couple', validation: (r) => r.required() }),
    defineField({ name: 'partnerTwo', title: 'First name (right)', type: 'string', group: 'couple', validation: (r) => r.required() }),
    defineField({ name: 'lastName', title: 'Last name', type: 'string', group: 'couple', description: 'Shown as "Arath & Ruby Garza" in the footer, browser tab and link previews.' }),
    defineField({ name: 'date', title: 'Wedding date & ceremony time', type: 'datetime', group: 'couple', description: 'Drives the countdown.', validation: (r) => r.required() }),
    defineField({ name: 'dateLabel', title: 'Date as shown', type: 'string', group: 'couple', description: 'e.g. "April 24, 2027"' }),
    defineField({ name: 'location', title: 'City / location', type: 'string', group: 'couple' }),
    defineField({ name: 'tagline', type: 'string', group: 'couple', description: 'One line under our names on the homepage.' }),
    defineField({ name: 'rsvpDeadline', title: 'RSVP deadline', type: 'datetime', group: 'couple' }),
    defineField({ name: 'rsvpDeadlineLabel', title: 'RSVP deadline as shown', type: 'string', group: 'couple' }),
    defineField({ name: 'hashtag', type: 'string', group: 'couple' }),
    defineField({ name: 'contactEmail', type: 'string', group: 'couple' }),

    defineField({ name: 'heroImage', title: 'Hero photo (big homepage photo)', type: 'photo', group: 'home' }),
    defineField({ name: 'introEyebrow', title: 'Intro label', type: 'string', group: 'home' }),
    defineField({ name: 'introHeading', title: 'Intro heading', type: 'string', group: 'home' }),
    defineField({ name: 'introBody', title: 'Intro text', type: 'text', rows: 4, group: 'home' }),
    defineField({ name: 'introImage', title: 'Intro photo', type: 'photo', group: 'home' }),

    defineField({ name: 'registryHeading', type: 'string', group: 'registry' }),
    defineField({ name: 'registryBody', type: 'text', rows: 3, group: 'registry' }),
    defineField({ name: 'registryImage', type: 'photo', group: 'registry' }),

    defineField({ name: 'shareImage', title: 'Link preview photo', type: 'photo', group: 'site', description: 'Shown when the link is texted or posted. Our names and date are added on top automatically.' }),
    defineField({ name: 'photoCredit', title: 'Photo credit', type: 'string', group: 'site', description: 'e.g. "Engagement photos by Roy Esparza Photography" — shown on the Gallery page and footer.' }),
    defineField({ name: 'nav', title: 'Menu links', type: 'array', group: 'site', of: [defineArrayMember({ type: 'navLink' })] }),
    defineField({ name: 'footerNote', type: 'string', group: 'site' }),
  ],
  preview: { prepare: () => ({ title: 'Site Settings' }) },
})

export const event = defineType({
  name: 'event',
  title: 'Event',
  type: 'document',
  fields: [
    defineField({ name: 'name', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'start', type: 'datetime', description: 'Venue local time.', validation: (r) => r.required() }),
    defineField({ name: 'end', type: 'datetime' }),
    defineField({ name: 'dayLabel', title: 'Day as shown', type: 'string', description: 'e.g. "Saturday, April 24"' }),
    defineField({ name: 'timeLabel', title: 'Time as shown', type: 'string', description: 'e.g. "4:30 PM"' }),
    defineField({ name: 'venue', type: 'string' }),
    defineField({ name: 'address', type: 'string' }),
    defineField({ name: 'mapUrl', title: 'Google/Apple Maps link', type: 'url' }),
    defineField({ name: 'attire', type: 'string' }),
    defineField({ name: 'description', type: 'text', rows: 3 }),
    defineField({ name: 'image', type: 'photo' }),
  ],
  orderings: [{ title: 'Start time', name: 'start', by: [{ field: 'start', direction: 'asc' }] }],
  preview: { select: { title: 'name', subtitle: 'dayLabel', media: 'image' } },
})

export const storyMoment = defineType({
  name: 'storyMoment',
  title: 'Story moment',
  type: 'document',
  fields: [
    defineField({ name: 'dateLabel', title: 'When', type: 'string', description: 'e.g. "Summer 2019"' }),
    defineField({ name: 'title', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'body', type: 'text', rows: 4 }),
    defineField({ name: 'image', type: 'photo' }),
    order,
  ],
  orderings: [{ title: 'Order', name: 'order', by: [{ field: 'order', direction: 'asc' }] }],
  preview: { select: { title: 'title', subtitle: 'dateLabel', media: 'image' } },
})

export const person = defineType({
  name: 'person',
  title: 'Wedding party member',
  type: 'document',
  fields: [
    defineField({
      name: 'group', title: 'Section', type: 'string', initialValue: 'padrinos',
      options: { list: [{ title: 'Our parents', value: 'parents' }, { title: 'Padrinos', value: 'padrinos' }], layout: 'radio' },
      validation: (r) => r.required(),
    }),
    defineField({ name: 'name', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'role', type: 'string' }),
    defineField({ name: 'note', title: 'One line about them', type: 'string' }),
    defineField({ name: 'image', type: 'photo' }),
    order,
  ],
  preview: { select: { title: 'name', subtitle: 'role', media: 'image' } },
})

export const faq = defineType({
  name: 'faq',
  title: 'FAQ',
  type: 'document',
  fields: [
    defineField({ name: 'question', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'answer', type: 'text', rows: 4, validation: (r) => r.required() }),
    order,
  ],
  preview: { select: { title: 'question', subtitle: 'answer' } },
})

export const registryLink = defineType({
  name: 'registryLink',
  title: 'Registry link',
  type: 'document',
  fields: [
    defineField({ name: 'name', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'url', type: 'url', validation: (r) => r.required() }),
    defineField({ name: 'note', type: 'string' }),
    order,
  ],
})

export const galleryImage = defineType({
  name: 'galleryImage',
  title: 'Gallery photo',
  type: 'document',
  fields: [
    defineField({ name: 'image', type: 'photo', validation: (r) => r.required() }),
    defineField({ name: 'caption', type: 'string' }),
    order,
  ],
  preview: { select: { title: 'caption', media: 'image' }, prepare: (s) => ({ title: s.title || 'Photo', media: s.media }) },
})

export const page = defineType({
  name: 'page',
  title: 'Custom page',
  type: 'document',
  description: 'Extra pages like "Things to Do". Add the link to the menu in Site Settings.',
  fields: [
    defineField({ name: 'title', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'slug', title: 'Web address', type: 'slug', options: { source: 'title' }, validation: (r) => r.required() }),
    defineField({ name: 'eyebrow', title: 'Small label above the title', type: 'string' }),
    defineField({ name: 'sections', type: 'array', of: pageSections }),
  ],
  preview: { select: { title: 'title', subtitle: 'slug.current' } },
})

/* ── Private ── */
export const guest = defineType({
  name: 'guest',
  title: 'Invitation (household)',
  type: 'document',
  fields: [
    defineField({ name: 'household', title: 'Invitation name', type: 'string', description: 'e.g. "The Lopez Family"', validation: (r) => r.required() }),
    defineField({ name: 'members', title: 'People on this invitation', type: 'array', of: [defineArrayMember({ type: 'string' })], validation: (r) => r.min(1) }),
    defineField({ name: 'events', title: 'Invited to', type: 'array', of: [defineArrayMember({ type: 'reference', to: [{ type: 'event' }] })] }),
    defineField({ name: 'searchNames', type: 'array', of: [defineArrayMember({ type: 'string' })], hidden: true, readOnly: true, description: 'Accent-free, lower-cased names for lookup (filled by the guest import).' }),
  ],
  preview: { select: { title: 'household', members: 'members' }, prepare: (s) => ({ title: s.title, subtitle: (s.members || []).join(', ') }) },
})

export const rsvp = defineType({
  name: 'rsvp',
  title: 'RSVP',
  type: 'document',
  readOnly: true,
  fields: [
    defineField({ name: 'guest', type: 'reference', to: [{ type: 'guest' }] }),
    defineField({ name: 'household', type: 'string' }),
    defineField({
      name: 'responses', type: 'array',
      of: [defineArrayMember({ type: 'object', fields: [
        defineField({ name: 'member', type: 'string' }),
        defineField({ name: 'eventId', type: 'string' }),
        defineField({ name: 'eventName', type: 'string' }),
        defineField({ name: 'attending', type: 'boolean' }),
      ] })],
    }),
    defineField({ name: 'email', type: 'string' }),
    defineField({ name: 'dietary', type: 'text' }),
    defineField({ name: 'song', title: 'Song request', type: 'string' }),
    defineField({ name: 'message', type: 'text' }),
    defineField({ name: 'submittedAt', type: 'datetime' }),
  ],
  orderings: [{ title: 'Newest', name: 'newest', by: [{ field: 'submittedAt', direction: 'desc' }] }],
  preview: { select: { title: 'household', subtitle: 'submittedAt' } },
})

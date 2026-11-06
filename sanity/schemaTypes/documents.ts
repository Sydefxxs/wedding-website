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
    { name: 'rsvp', title: 'RSVP page' },
    { name: 'registry', title: 'Registry page' },
    { name: 'photos', title: 'Guest photos' },
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

    defineField({ name: 'rsvpHeading', title: 'Page heading', type: 'string', group: 'rsvp' }),
    defineField({ name: 'rsvpIntro', title: 'Intro text', type: 'text', rows: 3, group: 'rsvp' }),
    defineField({ name: 'rsvpYesHeading', title: 'Thank-you heading (coming)', type: 'string', group: 'rsvp', description: 'Shown after a family says yes. {family} becomes their family name, e.g. "The Lopez Family".' }),
    defineField({ name: 'rsvpYesMessage', title: 'Thank-you message (coming)', type: 'text', rows: 3, group: 'rsvp', description: 'You can use {family}, {name} (their first name), {count} ("4 seats") and {date}.' }),
    defineField({ name: 'rsvpNoHeading', title: 'Thank-you heading (can’t make it)', type: 'string', group: 'rsvp' }),
    defineField({ name: 'rsvpNoMessage', title: 'Thank-you message (can’t make it)', type: 'text', rows: 3, group: 'rsvp' }),
    defineField({ name: 'rsvpMaxParty', title: 'Most people per reply', type: 'number', group: 'rsvp', initialValue: 12, description: 'Adults + children + plus ones. Bigger groups are asked to contact you.', validation: (r) => r.min(1).max(30) }),
    defineField({ name: 'rsvpPlusOnes', title: 'Ask about plus ones', type: 'boolean', group: 'rsvp', initialValue: true }),

    defineField({ name: 'registryHeading', type: 'string', group: 'registry' }),
    defineField({ name: 'registryBody', type: 'text', rows: 3, group: 'registry' }),
    defineField({ name: 'registryImage', type: 'photo', group: 'registry' }),

    defineField({ name: 'guestUploadsOpen', title: 'Guests can upload photos', type: 'boolean', group: 'photos', initialValue: true }),
    defineField({ name: 'moderateGuestPhotos', title: 'Approve photos before they appear', type: 'boolean', group: 'photos', initialValue: false, description: 'When on, new uploads stay hidden until you untick "Hidden" on them.' }),
    defineField({ name: 'guestUploadCode', title: 'Upload code (optional)', type: 'string', group: 'photos', description: 'If set, guests must type this code to upload — print it on table cards. Leave empty for no code.' }),
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

export const guestPhoto = defineType({
  name: 'guestPhoto',
  title: 'Guest photo',
  type: 'document',
  fields: [
    defineField({ name: 'image', type: 'image', validation: (r) => r.required() }),
    defineField({ name: 'name', title: 'Shared by', type: 'string' }),
    defineField({ name: 'caption', type: 'string' }),
    defineField({ name: 'hidden', title: 'Hidden', type: 'boolean', initialValue: false, description: 'Tick to remove it from the website (it stays here).' }),
    defineField({ name: 'uploadedAt', type: 'datetime', readOnly: true }),
  ],
  orderings: [{ title: 'Newest', name: 'newest', by: [{ field: 'uploadedAt', direction: 'desc' }] }],
  preview: {
    select: { title: 'name', subtitle: 'caption', media: 'image', hidden: 'hidden' },
    prepare: (s) => ({ title: `${s.hidden ? '🚫 ' : ''}${s.title || 'Guest'}`, subtitle: s.subtitle, media: s.media }),
  },
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
  title: 'Guest list entry',
  description: 'Optional. Anyone can RSVP — this list only helps you see who hasn’t replied yet.',
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
    defineField({ name: 'household', title: 'Family', type: 'string' }),
    defineField({ name: 'name', title: 'Replied by', type: 'string' }),
    defineField({ name: 'attending', title: 'Coming', type: 'boolean' }),
    defineField({ name: 'adults', type: 'number' }),
    defineField({ name: 'children', type: 'number' }),
    defineField({ name: 'plusOnes', title: 'Plus ones', type: 'number' }),
    defineField({ name: 'plusOneNames', title: 'Plus one names', type: 'string' }),
    defineField({ name: 'guestNames', title: 'Everyone coming', type: 'text', rows: 2 }),
    defineField({ name: 'email', type: 'string' }),
    defineField({ name: 'phone', type: 'string' }),
    defineField({ name: 'dietary', type: 'text' }),
    defineField({ name: 'song', title: 'Song request', type: 'string' }),
    defineField({ name: 'message', type: 'text' }),
    defineField({ name: 'submittedAt', type: 'datetime' }),
    defineField({ name: 'guest', title: 'Matched guest list entry', type: 'reference', to: [{ type: 'guest' }] }),
    defineField({
      name: 'responses', title: 'Older per-event answers', type: 'array', hidden: ({ value }) => !value,
      of: [defineArrayMember({ type: 'object', fields: [
        defineField({ name: 'member', type: 'string' }),
        defineField({ name: 'eventId', type: 'string' }),
        defineField({ name: 'eventName', type: 'string' }),
        defineField({ name: 'attending', type: 'boolean' }),
      ] })],
    }),
  ],
  orderings: [{ title: 'Newest', name: 'newest', by: [{ field: 'submittedAt', direction: 'desc' }] }],
  preview: {
    select: { family: 'household', attending: 'attending', a: 'adults', c: 'children', p: 'plusOnes' },
    prepare: ({ family, attending, a, c, p }) => ({
      title: family,
      subtitle: attending ? `Coming · ${(a ?? 0) + (c ?? 0) + (p ?? 0)} people` : 'Can’t make it',
    }),
  },
})

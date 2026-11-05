import { defineArrayMember, defineField, defineType } from 'sanity'

/** Reusable photo field: hotspot, required alt text, and a "still placeholder" flag. */
export const photo = defineType({
  name: 'photo',
  title: 'Photo',
  type: 'image',
  options: { hotspot: true },
  fields: [
    defineField({
      name: 'alt',
      title: 'Description (for screen readers)',
      type: 'string',
      description: 'Describe the photo, e.g. "Arath and Ruby laughing on the beach at sunset".',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'placeholder',
      title: 'Still a placeholder?',
      type: 'boolean',
      description: 'Untick once this is our real photo. Ticked photos show up in "Still placeholder".',
      initialValue: false,
    }),
  ],
})

export const navLink = defineType({
  name: 'navLink',
  title: 'Menu link',
  type: 'object',
  fields: [
    defineField({ name: 'label', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'href', title: 'Link (e.g. /schedule)', type: 'string', validation: (r) => r.required() }),
  ],
})

/* ── Sections for custom pages ── */
export const richTextSection = defineType({
  name: 'richText',
  title: 'Text block',
  type: 'object',
  fields: [
    defineField({ name: 'heading', type: 'string' }),
    defineField({ name: 'body', type: 'text', rows: 6, validation: (r) => r.required() }),
  ],
  preview: { select: { title: 'heading', subtitle: 'body' }, prepare: (s) => ({ title: s.title || 'Text block', subtitle: s.subtitle }) },
})

export const imageTextSection = defineType({
  name: 'imageText',
  title: 'Photo + text',
  type: 'object',
  fields: [
    defineField({ name: 'heading', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'body', type: 'text', rows: 5 }),
    defineField({ name: 'image', type: 'photo', validation: (r) => r.required() }),
    defineField({ name: 'reverse', title: 'Photo on the right', type: 'boolean', initialValue: false }),
  ],
  preview: { select: { title: 'heading', media: 'image' } },
})

export const ctaSection = defineType({
  name: 'cta',
  title: 'Call to action',
  type: 'object',
  fields: [
    defineField({ name: 'heading', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'buttonLabel', type: 'string', initialValue: 'RSVP' }),
    defineField({ name: 'href', title: 'Button link', type: 'string', initialValue: '/rsvp' }),
  ],
  preview: { select: { title: 'heading' }, prepare: (s) => ({ title: s.title, subtitle: 'Call to action' }) },
})

export const pageSections = [
  defineArrayMember({ type: 'richText' }),
  defineArrayMember({ type: 'imageText' }),
  defineArrayMember({ type: 'cta' }),
]

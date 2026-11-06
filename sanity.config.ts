'use client'

import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { apiVersion, dataset, projectId } from './sanity/env'
import { schemaTypes } from './sanity/schemaTypes'
import { structure } from './sanity/structure'
import { RsvpTool } from './sanity/tools/RsvpTool'

export default defineConfig({
  basePath: '/studio',
  title: 'Our Wedding',
  projectId: projectId || 'placeholder',
  dataset,
  schema: {
    types: schemaTypes,
    // Site Settings is a single document — hide it from "create new"
    templates: (templates) => templates.filter((t) => t.schemaType !== 'siteSettings'),
  },
  document: {
    actions: (actions, ctx) =>
      ctx.schemaType === 'siteSettings' ? actions.filter((a) => a.action !== 'duplicate' && a.action !== 'delete') : actions,
  },
  plugins: [structureTool({ structure }), visionTool({ defaultApiVersion: apiVersion })],
  tools: (prev) => [...prev, { name: 'rsvps', title: 'RSVPs', component: RsvpTool }],
})

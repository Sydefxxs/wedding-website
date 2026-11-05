import { isSanityConfigured } from '@/sanity/env'
import { Studio } from './Studio'

export { metadata, viewport } from 'next-sanity/studio'

export function generateStaticParams() {
  return [{ tool: [] }]
}

export default function StudioPage() {
  if (!isSanityConfigured) {
    return (
      <main style={{ fontFamily: 'system-ui, sans-serif', maxWidth: 560, margin: '15vh auto', padding: 24, lineHeight: 1.6 }}>
        <h1 style={{ fontSize: 28, marginBottom: 12 }}>The editor isn’t connected yet</h1>
        <p>
          The site is running on placeholder content. To edit everything from here, create a free Sanity project and add
          <code style={{ background: '#eee', padding: '2px 6px', margin: '0 4px', borderRadius: 4 }}>NEXT_PUBLIC_SANITY_PROJECT_ID</code>
          to your environment. Step-by-step instructions are in <strong>docs/SETUP.md</strong>.
        </p>
      </main>
    )
  }
  return <Studio />
}

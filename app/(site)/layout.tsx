import type { Metadata, Viewport } from 'next'
import { cormorant, jost } from '../fonts'
import '../globals.css'
import { getContent } from '@/lib/content'
import { Nav } from '@/components/layout/Nav'
import { Footer } from '@/components/layout/Footer'
import { SmoothScroll } from '@/components/motion/SmoothScroll'

export async function generateMetadata(): Promise<Metadata> {
  const { settings: s } = await getContent()
  const couple = `${s.partnerOne} & ${s.partnerTwo}`
  const title = s.lastName ? `${couple} ${s.lastName}` : couple
  const description = `${s.dateLabel} · ${s.location}. ${s.tagline}`
  const site = process.env.NEXT_PUBLIC_SITE_URL || (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : 'http://localhost:3000')
  return {
    metadataBase: new URL(site),
    title: { default: title, template: `%s · ${couple}` },
    description,
    openGraph: { title, description, type: 'website' },
    twitter: { card: 'summary_large_image', title, description },
    // Private by default — flip once we decide to let search engines in
    robots: { index: false, follow: false },
  }
}

export const viewport: Viewport = { themeColor: '#fffdfa' }

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const { settings } = await getContent()
  return (
    <html lang="en" className={`${cormorant.variable} ${jost.variable}`} suppressHydrationWarning>
      <head>
        {/* Only hide-then-reveal content once we know JS is running */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body>
        <SmoothScroll />
        <Nav links={settings.nav} a={settings.partnerOne} b={settings.partnerTwo} dateLabel={settings.dateLabel} />
        <main id="main">{children}</main>
        <Footer s={settings} />
      </body>
    </html>
  )
}

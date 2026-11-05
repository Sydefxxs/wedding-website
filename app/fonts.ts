import localFont from 'next/font/local'

export const cormorant = localFont({
  variable: '--font-cormorant',
  display: 'swap',
  src: [
    { path: './fonts/cormorant-garamond-latin-300-normal.woff2', weight: '300', style: 'normal' },
    { path: './fonts/cormorant-garamond-latin-300-italic.woff2', weight: '300', style: 'italic' },
    { path: './fonts/cormorant-garamond-latin-400-normal.woff2', weight: '400', style: 'normal' },
    { path: './fonts/cormorant-garamond-latin-400-italic.woff2', weight: '400', style: 'italic' },
    { path: './fonts/cormorant-garamond-latin-500-normal.woff2', weight: '500', style: 'normal' },
    { path: './fonts/cormorant-garamond-latin-500-italic.woff2', weight: '500', style: 'italic' },
  ],
})

export const jost = localFont({
  variable: '--font-jost',
  display: 'swap',
  src: [
    { path: './fonts/jost-latin-300-normal.woff2', weight: '300', style: 'normal' },
    { path: './fonts/jost-latin-400-normal.woff2', weight: '400', style: 'normal' },
    { path: './fonts/jost-latin-500-normal.woff2', weight: '500', style: 'normal' },
  ],
})

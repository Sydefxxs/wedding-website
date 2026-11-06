/**
 * The site's editable colors. Defaults mirror the tokens in app/globals.css (keep them in sync).
 * The couple can override any of them in the Studio → Site Settings → Colors.
 */
export const COLOR_FIELDS = [
  { key: 'background', title: 'Page background', vars: ['--paper'], default: '#0e0c0d', hint: 'Behind most of the site.' },
  { key: 'sections', title: 'Alternate sections', vars: ['--paper-2'], default: '#161214', hint: 'Every other band of the page, slightly lighter.' },
  { key: 'darkest', title: 'Darkest areas', vars: ['--night'], default: '#080707', hint: 'Hero panel, photo strip and footer.' },
  { key: 'text', title: 'Main text', vars: ['--ink'], default: '#f4ede4', hint: 'Headings and paragraphs.', contrast: true },
  { key: 'softText', title: 'Soft text', vars: ['--ink-2'], default: '#b5aaa3', hint: 'Smaller details, dates, captions.', contrast: true },
  { key: 'lines', title: 'Thin lines', vars: ['--line'], default: '#2e2729', hint: 'Dividers and form underlines.' },
  { key: 'gold', title: 'Gold (main color)', vars: ['--primary', '--accent', '--gold'], default: '#c9a961', hint: 'Buttons, links, labels, the monogram ring.', contrast: true },
  { key: 'goldLight', title: 'Light gold', vars: ['--gold-light', '--primary-hover'], default: '#e2cb92', hint: 'Gold on the darkest areas, and buttons on hover.' },
  { key: 'rose', title: 'Rose accent', vars: ['--rose'], default: '#d14b5f', hint: 'The “&” between our names and a few small touches.' },
  { key: 'buttonText', title: 'Text on gold buttons', vars: ['--primary-ink'], default: '#0e0c0d', hint: 'Usually the same as the background.' },
] as const

export type ColorKey = (typeof COLOR_FIELDS)[number]['key']
export type SiteColors = Partial<Record<ColorKey, string>>

export const isHex = (v: unknown): v is string => typeof v === 'string' && /^#[0-9a-f]{6}$/i.test(v)

/** CSS that overrides the default tokens with the couple's picks (empty string if none). */
export function colorCss(colors?: SiteColors) {
  if (!colors) return ''
  const decls = COLOR_FIELDS.flatMap((f) => (isHex(colors[f.key]) ? f.vars.map((v) => `${v}:${colors[f.key]}`) : []))
  return decls.length ? `:root{${decls.join(';')}}` : ''
}

/** WCAG contrast ratio between two hex colors (1–21). 4.5+ is readable for normal text. */
export function contrast(a: string, b: string) {
  const lum = (hex: string) => {
    const [r, g, bl] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4))
    return 0.2126 * r + 0.7152 * g + 0.0722 * bl
  }
  const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m)
  return (x + 0.05) / (y + 0.05)
}

'use client'

import { useCallback, useState } from 'react'
import { set, unset, useFormValue, type StringInputProps } from 'sanity'
import { COLOR_FIELDS, contrast, isHex } from '@/lib/colors'

/** Color picker + hex box + "back to original", with a readability check against the background. */
export function ColorInput(props: StringInputProps) {
  const { value, onChange, path, elementProps } = props
  const key = String(path[path.length - 1])
  const def = COLOR_FIELDS.find((f) => f.key === key)
  const fallback = def?.default ?? '#000000'
  const current = isHex(value) ? value : fallback
  // What's typed in the hex box while it isn't a full color yet; otherwise show the saved value
  const [draft, setDraft] = useState<string | null>(null)
  const text = draft ?? value ?? ''

  const background = useFormValue(['colors', 'background'])
  const bg = isHex(background) ? background : COLOR_FIELDS[0].default
  const ratio = def && 'contrast' in def && def.contrast ? contrast(current, bg) : null

  const commit = useCallback((v: string) => onChange(isHex(v) ? set(v.toLowerCase()) : unset()), [onChange])

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 12 }}>
      <input
        type="color"
        aria-label="Pick a color"
        value={current}
        onChange={(e) => {
          setDraft(null)
          commit(e.target.value)
        }}
        style={{ width: 56, height: 40, padding: 0, border: '1px solid #8886', borderRadius: 6, background: 'none', cursor: 'pointer' }}
      />
      <input
        {...elementProps}
        value={text}
        placeholder={fallback}
        onChange={(e) => {
          const v = e.target.value.trim()
          if (isHex(v)) {
            setDraft(null)
            commit(v)
          } else if (v === '') {
            setDraft(null)
            onChange(unset())
          } else setDraft(v)
        }}
        style={{ width: 110, height: 40, padding: '0 10px', fontFamily: 'monospace', fontSize: 14, borderRadius: 6, border: '1px solid #8886', background: 'transparent', color: 'inherit' }}
      />
      {isHex(value) && (
        <button type="button" onClick={() => { setDraft(null); onChange(unset()) }} style={{ height: 40, padding: '0 14px', borderRadius: 6, border: '1px solid #8886', background: 'transparent', color: 'inherit', cursor: 'pointer' }}>
          Back to original
        </button>
      )}
      {!isHex(value) && <span style={{ fontSize: 13, opacity: 0.7 }}>Original color</span>}
      {ratio !== null && (
        <span style={{ fontSize: 13, color: ratio >= 4.5 ? '#3f9a5a' : '#d9534f' }}>
          {ratio >= 4.5 ? `✓ Easy to read on the background (${ratio.toFixed(1)}:1)` : `Hard to read on the background (${ratio.toFixed(1)}:1) — pick a ${luminanceHint(bg)} color`}
        </span>
      )}
    </div>
  )
}

const luminanceHint = (bg: string) => (parseInt(bg.slice(1, 3), 16) + parseInt(bg.slice(3, 5), 16) + parseInt(bg.slice(5, 7), 16) < 384 ? 'lighter' : 'darker')

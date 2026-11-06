'use client'

import { useEffect, useMemo, useState } from 'react'
import { useClient } from 'sanity'

type Rsvp = {
  _id: string
  name?: string
  household?: string
  attending?: boolean
  adults?: number
  children?: number
  plusOnes?: number
  plusOneNames?: string
  guestNames?: string
  email?: string
  phone?: string
  dietary?: string
  song?: string
  message?: string
  submittedAt?: string
  guest?: { _ref: string }
  // replies sent with the older per-event form
  responses?: { member: string; attending: boolean }[]
}
type Invite = { _id: string; household: string; members: string[] }

const cell: React.CSSProperties = { padding: '8px 12px', borderBottom: '1px solid #e3e3e3', textAlign: 'left', verticalAlign: 'top', fontSize: 14 }
const lower = (s?: string) => (s ?? '').trim().toLowerCase()

/** Older replies stored one yes/no per person — turn them into the same shape. */
function normalize(r: Rsvp): Rsvp {
  if (r.attending !== undefined || !r.responses?.length) return r
  const yes = new Set(r.responses.filter((x) => x.attending).map((x) => x.member))
  return { ...r, attending: yes.size > 0, adults: yes.size, children: 0, plusOnes: 0, guestNames: [...yes].join(', ') }
}

const people = (r: Rsvp) => (r.attending ? (r.adults ?? 0) + (r.children ?? 0) + (r.plusOnes ?? 0) : 0)

/** Studio tab: who's coming, head counts, and a spreadsheet download for the caterer / seating chart. */
export function RsvpTool() {
  const client = useClient({ apiVersion: '2026-10-01' })
  const [rsvps, setRsvps] = useState<Rsvp[] | null>(null)
  const [invites, setInvites] = useState<Invite[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    Promise.all([
      client.fetch<Rsvp[]>(`*[_type == "rsvp"] | order(submittedAt desc)`),
      client.fetch<Invite[]>(`*[_type == "guest"]{ _id, household, members }`),
    ])
      .then(([r, g]) => {
        setRsvps(r.map(normalize))
        setInvites(g)
      })
      .catch((e) => setError(String(e?.message ?? e)))
  }, [client])

  // Latest reply per person/family wins (guests can send it again to change their answer)
  const latest = useMemo(() => {
    const seen = new Set<string>()
    return (rsvps ?? []).filter((r) => {
      const k = lower(r.name) || lower(r.household) || r._id
      if (seen.has(k)) return false
      seen.add(k)
      return true
    })
  }, [rsvps])

  const coming = latest.filter((r) => r.attending)
  const sum = (k: 'adults' | 'children' | 'plusOnes') => coming.reduce((n, r) => n + (r[k] ?? 0), 0)
  const total = coming.reduce((n, r) => n + people(r), 0)

  const repliedRefs = new Set(latest.map((r) => r.guest?._ref).filter(Boolean))
  const repliedNames = new Set(latest.flatMap((r) => [lower(r.household), lower(r.name)]))
  const waiting = invites.filter((g) => !repliedRefs.has(g._id) && !repliedNames.has(lower(g.household)) && !g.members?.some((m) => repliedNames.has(lower(m))))

  const downloadCsv = () => {
    const q = (v: unknown) => `"${String(v ?? '').replace(/"/g, '""')}"`
    const rows: unknown[][] = [['Family', 'Replied by', 'Coming', 'Adults', 'Children', 'Plus ones', 'Plus one names', 'Total', 'Everyone coming', 'Phone', 'Email', 'Dietary', 'Song', 'Note', 'Submitted']]
    for (const r of latest)
      rows.push([r.household, r.name, r.attending ? 'Yes' : 'No', r.adults ?? 0, r.children ?? 0, r.plusOnes ?? 0, r.plusOneNames, people(r), r.guestNames, r.phone, r.email, r.dietary, r.song, r.message, r.submittedAt ? new Date(r.submittedAt).toLocaleString() : ''])
    for (const g of waiting) rows.push([g.household, g.members?.join(', '), 'No reply yet'])
    const blob = new Blob(['﻿' + rows.map((r) => r.map(q).join(',')).join('\r\n')], { type: 'text/csv;charset=utf-8' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `rsvps-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
  }

  return (
    <div style={{ padding: 32, maxWidth: 1200, margin: '0 auto', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
        <h1 style={{ fontSize: 28, margin: 0 }}>RSVPs</h1>
        <button type="button" onClick={downloadCsv} disabled={!rsvps} style={{ padding: '10px 18px', borderRadius: 999, border: 0, background: '#c9a961', color: '#0e0c0d', fontWeight: 600, cursor: 'pointer' }}>
          Download spreadsheet (CSV)
        </button>
      </div>
      {error && <p style={{ color: '#b3261e' }}>Couldn’t load RSVPs: {error}</p>}
      {!rsvps && !error && <p>Loading…</p>}
      {rsvps && (
        <>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', margin: '24px 0' }}>
            <Stat label="People coming" value={String(total)} sub={`${sum('adults')} adults · ${sum('children')} kids · ${sum('plusOnes')} plus ones`} />
            <Stat label="Families coming" value={String(coming.length)} />
            <Stat label="Can’t make it" value={String(latest.length - coming.length)} />
            {invites.length > 0 && <Stat label="Guest list — no reply yet" value={String(waiting.length)} />}
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>{['Family', 'Coming', 'Who', 'Dietary', 'Song', 'Note', 'When'].map((h) => <th key={h} style={{ ...cell, fontWeight: 600 }}>{h}</th>)}</tr>
              </thead>
              <tbody>
                {latest.map((r) => (
                  <tr key={r._id}>
                    <td style={cell}>
                      {r.household}
                      <div style={{ color: '#777', fontSize: 12 }}>{[r.name, r.phone, r.email].filter(Boolean).join(' · ')}</div>
                    </td>
                    <td style={cell}>
                      {r.attending ? <strong>Yes · {people(r)}</strong> : 'No'}
                      {r.attending && <div style={{ color: '#777', fontSize: 12 }}>{r.adults ?? 0} adults · {r.children ?? 0} kids{r.plusOnes ? ` · +${r.plusOnes}` : ''}</div>}
                    </td>
                    <td style={cell}>
                      {r.guestNames}
                      {r.plusOneNames && <div style={{ color: '#777', fontSize: 12 }}>Plus one: {r.plusOneNames}</div>}
                    </td>
                    <td style={cell}>{r.dietary}</td>
                    <td style={cell}>{r.song}</td>
                    <td style={cell}>{r.message}</td>
                    <td style={cell}>{r.submittedAt ? new Date(r.submittedAt).toLocaleDateString() : ''}</td>
                  </tr>
                ))}
                {latest.length === 0 && <tr><td style={cell} colSpan={7}>No RSVPs yet.</td></tr>}
              </tbody>
            </table>
          </div>
          {waiting.length > 0 && (
            <>
              <h2 style={{ fontSize: 18, marginTop: 32 }}>On your guest list, no reply yet ({waiting.length})</h2>
              <p style={{ color: '#555' }}>{waiting.map((g) => g.household).join(' · ')}</p>
            </>
          )}
        </>
      )}
    </div>
  )
}

function Stat({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div style={{ border: '1px solid #e3e3e3', borderRadius: 8, padding: '14px 18px', minWidth: 170 }}>
      <div style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: 1, color: '#777' }}>{label}</div>
      <div style={{ fontSize: 24, fontWeight: 600, marginTop: 4 }}>{value}</div>
      {sub && <div style={{ fontSize: 12, color: '#777' }}>{sub}</div>}
    </div>
  )
}

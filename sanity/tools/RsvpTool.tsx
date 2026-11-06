'use client'

import { useEffect, useMemo, useState } from 'react'
import { useClient } from 'sanity'

type Response = { member: string; eventId: string; eventName: string; attending: boolean }
type Rsvp = { _id: string; household?: string; email?: string; dietary?: string; song?: string; message?: string; submittedAt?: string; responses?: Response[] }
type Invite = { _id: string; household: string; members: string[] }

const cell: React.CSSProperties = { padding: '8px 12px', borderBottom: '1px solid #e3e3e3', textAlign: 'left', verticalAlign: 'top', fontSize: 14 }

/** Studio tab: who's coming, counts per event, and a CSV download for the caterer / seating chart. */
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
        setRsvps(r)
        setInvites(g)
      })
      .catch((e) => setError(String(e?.message ?? e)))
  }, [client])

  // Latest RSVP per household wins (guests can re-submit to change their answer)
  const latest = useMemo(() => {
    const seen = new Set<string>()
    return (rsvps ?? []).filter((r) => {
      const k = (r.household ?? r._id).toLowerCase()
      if (seen.has(k)) return false
      seen.add(k)
      return true
    })
  }, [rsvps])

  const events = useMemo(() => {
    const map = new Map<string, { name: string; yes: number; no: number }>()
    for (const r of latest)
      for (const x of r.responses ?? []) {
        const e = map.get(x.eventId) ?? { name: x.eventName, yes: 0, no: 0 }
        if (x.attending) e.yes++
        else e.no++
        map.set(x.eventId, e)
      }
    return [...map.values()]
  }, [latest])

  const replied = new Set(latest.map((r) => (r.household ?? '').toLowerCase()))
  const waiting = invites.filter((g) => !replied.has(g.household.toLowerCase()))

  const downloadCsv = () => {
    const q = (v: unknown) => `"${String(v ?? '').replace(/"/g, '""')}"`
    const rows = [['Household', 'Guest', 'Event', 'Attending', 'Email', 'Dietary', 'Song', 'Message', 'Submitted']]
    for (const r of latest)
      for (const x of r.responses ?? [])
        rows.push([r.household ?? '', x.member, x.eventName, x.attending ? 'Yes' : 'No', r.email ?? '', r.dietary ?? '', r.song ?? '', r.message ?? '', r.submittedAt ? new Date(r.submittedAt).toLocaleString() : ''])
    for (const g of waiting) for (const m of g.members) rows.push([g.household, m, '', 'No reply yet', '', '', '', '', ''])
    const blob = new Blob(['﻿' + rows.map((r) => r.map(q).join(',')).join('\r\n')], { type: 'text/csv;charset=utf-8' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `rsvps-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
  }

  return (
    <div style={{ padding: 32, maxWidth: 1100, margin: '0 auto', fontFamily: 'system-ui, sans-serif' }}>
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
            <Stat label="Invitations replied" value={`${latest.length} / ${invites.length || '—'}`} />
            {events.map((e) => (
              <Stat key={e.name} label={e.name} value={`${e.yes} coming`} sub={`${e.no} can’t make it`} />
            ))}
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>{['Household', 'Answers', 'Dietary', 'Song', 'Note', 'When'].map((h) => <th key={h} style={{ ...cell, fontWeight: 600 }}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {latest.map((r) => (
                <tr key={r._id}>
                  <td style={cell}>{r.household}<div style={{ color: '#777', fontSize: 12 }}>{r.email}</div></td>
                  <td style={cell}>{(r.responses ?? []).map((x, i) => <div key={i}>{x.attending ? '✅' : '—'} {x.member} · {x.eventName}</div>)}</td>
                  <td style={cell}>{r.dietary}</td>
                  <td style={cell}>{r.song}</td>
                  <td style={cell}>{r.message}</td>
                  <td style={cell}>{r.submittedAt ? new Date(r.submittedAt).toLocaleDateString() : ''}</td>
                </tr>
              ))}
              {latest.length === 0 && <tr><td style={cell} colSpan={6}>No RSVPs yet.</td></tr>}
            </tbody>
          </table>
          {waiting.length > 0 && (
            <>
              <h2 style={{ fontSize: 18, marginTop: 32 }}>Still waiting on ({waiting.length})</h2>
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
    <div style={{ border: '1px solid #e3e3e3', borderRadius: 8, padding: '14px 18px', minWidth: 160 }}>
      <div style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: 1, color: '#777' }}>{label}</div>
      <div style={{ fontSize: 24, fontWeight: 600, marginTop: 4 }}>{value}</div>
      {sub && <div style={{ fontSize: 12, color: '#777' }}>{sub}</div>}
    </div>
  )
}

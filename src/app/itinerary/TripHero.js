'use client'
import { useRef, useEffect } from 'react'
import Link from 'next/link'

function StatPill({ label }) {
  return (
    <span className="inline-flex items-center bg-white/10 border border-white/25 rounded-full px-3.5 py-1.5 text-[12px] text-white/90">
      {label}
    </span>
  )
}

export default function TripHero({ title, editingTitle, setTitle, setEditingTitle, days, grandTotal, saving, onSave, onDownload, totalAttractions, uniqueCities }) {
  // Last committed title, used to cancel edits with Escape
  const committedTitleRef = useRef(title)
  useEffect(() => {
    if (!editingTitle) committedTitleRef.current = title
  }, [editingTitle, title])

  return (
    <section className="bg-red">
      <div className="max-w-[1200px] mx-auto px-4 md:px-12 py-5 md:py-7">
        {/* Row 1: Back link + actions */}
        <div className="flex items-center justify-between mb-3">
          <Link href="/" className="text-[12px] text-white/85 hover:text-white transition-colors duration-200">
            ← Back to Home
          </Link>
          <div className="flex gap-2">
            <button onClick={onDownload} className="inline-flex items-center gap-1.5 bg-white/10 border border-white/25 text-white rounded-full px-3.5 py-1.5 text-[11px] font-medium hover:bg-white/20 transition-colors duration-200 cursor-pointer">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5" aria-hidden="true">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              Download
            </button>
            <button
              onClick={onSave}
              disabled={saving}
              className="bg-white text-red rounded-full px-5 py-1.5 text-[12px] font-semibold hover:bg-gold hover:text-white hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
            >
              {saving ? 'Saving…' : 'Save'}
            </button>
          </div>
        </div>

        {/* Row 2: Editable title */}
        {editingTitle ? (
          <input
            autoFocus
            value={title}
            aria-label="Itinerary title"
            maxLength={100}
            onChange={e => setTitle(e.target.value)}
            onBlur={() => setEditingTitle(false)}
            onKeyDown={e => {
              if (e.key === 'Enter') setEditingTitle(false)
              if (e.key === 'Escape') {
                setTitle(committedTitleRef.current) // Escape cancels the edit
                setEditingTitle(false)
              }
            }}
            className="font-display text-[22px] md:text-[28px] font-bold text-white bg-white/10 border border-white/30 rounded-md px-3 py-1 outline-none mb-3 max-w-[500px] focus-visible:ring-2 focus-visible:ring-white/60"
          />
        ) : (
          <h1 className="mb-3 w-fit">
            <button
              onClick={() => setEditingTitle(true)}
              aria-label="Rename itinerary"
              title="Click to rename"
              className="font-display text-[22px] md:text-[28px] font-bold text-white cursor-pointer flex items-center gap-2 group bg-transparent border-0 p-0"
            >
              {title}
              <span className="text-white/60 group-hover:text-white/80 transition-colors" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                  <path d="M17 3a2.83 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
                </svg>
              </span>
            </button>
          </h1>
        )}

        {/* Row 3: Trip stats */}
        <div className="flex gap-3 flex-wrap">
          <StatPill label={`${days.length} day${days.length !== 1 ? 's' : ''}`} />
          <StatPill label={`${totalAttractions} attraction${totalAttractions !== 1 ? 's' : ''}`} />
          <StatPill label={uniqueCities} />
          <StatPill label={`≈ ¥${grandTotal}`} />
        </div>
      </div>
    </section>
  )
}

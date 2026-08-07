'use client'
import { useEffect, useRef } from 'react'
import Image from 'next/image'
import { FALLBACK_IMG } from './constants'

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

export default function AttractionPicker({ dayNumber, attractions, search, error, onRetry, onSearch, onSelect, onClose, openerRef }) {
  const dialogRef = useRef(null)
  // Keep the latest onClose in a ref so the mount-once effect below never
  // re-runs (and steals focus) when the parent re-renders.
  const onCloseRef = useRef(onClose)
  useEffect(() => {
    onCloseRef.current = onClose
  })

  // Remember what was focused before opening, trap Tab inside the dialog,
  // and close on Escape. Runs once on mount; cleanup restores focus on unmount.
  useEffect(() => {
    // The opener is recorded by the parent before the modal mounts and never
    // changes while it is open, so capturing it here is safe.
    const openerAtMount = openerRef?.current || null
    const dialog = dialogRef.current

    function handleKeyDown(e) {
      if (e.key === 'Escape') {
        e.stopPropagation()
        onCloseRef.current()
        return
      }
      if (e.key !== 'Tab' || !dialog) return
      const focusables = dialog.querySelectorAll(FOCUSABLE)
      if (focusables.length === 0) return
      const first = focusables[0]
      const last = focusables[focusables.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown, true)
    return () => {
      document.removeEventListener('keydown', handleKeyDown, true)
      openerAtMount?.focus?.()
    }
  }, [openerRef])

  const q = search.toLowerCase()
  const filtered = attractions.filter(a =>
    (a.name_en || '').toLowerCase().includes(q) ||
    (a.city?.name_en || '').toLowerCase().includes(q)
  )

  return (
    <div
      className="fixed inset-0 bg-ink/50 z-[200] flex items-center justify-center p-4"
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="picker-title"
        className="bg-white rounded-card w-full max-w-[620px] max-h-[85vh] sm:max-h-[75vh] flex flex-col overflow-hidden shadow-modal"
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-paper-dk flex items-center justify-between">
          <span id="picker-title" className="font-display text-h3 font-bold">Add to Day {dayNumber}</span>
          <button
            onClick={onClose}
            aria-label="Close"
            className="bg-transparent border-0 text-xl text-ink-lt hover:text-red cursor-pointer transition-colors w-8 h-8 flex items-center justify-center rounded-full hover:bg-paper"
          >×</button>
        </div>

        {/* Search */}
        <div className="px-5 py-3 border-b border-paper-dk">
          <input
            autoFocus
            value={search}
            onChange={e => onSearch(e.target.value)}
            placeholder="Search by name or city..."
            aria-label="Search attractions"
            className="w-full px-4 py-2.5 border border-paper-dkr rounded-full text-[13px] outline-none focus:border-red focus-visible:ring-2 focus-visible:ring-red/40 transition-colors"
          />
        </div>

        {/* Grid body */}
        <div className="overflow-y-auto flex-1 px-5 py-4">
          {error ? (
            <div className="py-10 text-center">
              <p className="text-[13px] text-ink-md mb-4">{error}</p>
              <button
                onClick={onRetry}
                className="bg-red text-white rounded-full px-5 py-2 text-[12px] font-semibold cursor-pointer border-0 hover:bg-red-dk transition-colors"
              >
                Try again
              </button>
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-10 text-center text-ink-lt text-[13px]">No attractions match your search</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {filtered.map(a => (
                <button
                  key={a.attraction_id}
                  onClick={() => onSelect(a)}
                  className="flex items-center gap-3 bg-white border border-paper-dkr rounded-card p-3 text-left cursor-pointer transition-all duration-200 hover:border-red hover:-translate-y-[2px] hover:shadow-card-sm group focus-visible:ring-2 focus-visible:ring-red/40"
                >
                  <div className="w-[60px] h-[60px] rounded-thumb overflow-hidden shrink-0">
                    <Image src={a.image_url || FALLBACK_IMG} alt="" width={120} height={120} unoptimized onError={e => e.target.src = FALLBACK_IMG} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[13px] font-semibold text-ink group-hover:text-red transition-colors truncate">{a.name_en}</div>
                    <div className="text-[11px] text-ink-lt mt-0.5">{a.name_zh}</div>
                    <div className="flex items-center gap-1.5 mt-1">
                      <span className="text-[11px] text-ink-lt">{a.city?.name_en}</span>
                      <span className="text-[11px] font-medium text-ink-md">· ¥{a.entrance_fee || 0}</span>
                    </div>
                  </div>
                  <span className="text-red font-bold text-lg group-hover:scale-110 transition-transform shrink-0" aria-hidden="true">+</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

'use client'
import { useState, useEffect, useRef, Suspense } from 'react'
import { createClient } from '@/utils/supabase/client'
import Link from 'next/link'
import Image from 'next/image'
import { useSearchParams } from 'next/navigation'
import Reveal from '@/components/Reveal'
import TripHero from './TripHero'
import DayCard from './DayCard'
import AttractionPicker from './AttractionPicker'
import SavedCard from './SavedCard'
import { FALLBACK_IMG } from './constants'

// ── Starter templates ────────────────────────────────────────────────────────
const TEMPLATES = {
  '1-day': {
    title: 'Beijing in a Day',
    days: [{
      day: 1, city: 'Beijing',
      items: [
        { id: 't1', name: 'The Great Wall', name_zh: '长城', time: '7:00 AM', fee: 40, image: 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=120&q=70', lat: 40.4319, lng: 116.5704 },
        { id: 't2', name: 'The Forbidden City', name_zh: '故宫', time: '1:30 PM', fee: 60, image: 'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?w=120&q=70', lat: 39.9163, lng: 116.3972 },
        { id: 't3', name: 'Temple of Heaven', name_zh: '天坛', time: '4:00 PM', fee: 35, image: 'https://images.unsplash.com/photo-1537819191377-d3305ffddce4?w=120&q=70', lat: 39.8822, lng: 116.4066 },
      ]
    }]
  },
  '2-day': {
    title: 'Beijing & Xi&rsquo;an Classic',
    days: [
      {
        day: 1, city: 'Beijing',
        items: [
          { id: 't4', name: 'The Great Wall', name_zh: '长城', time: '7:00 AM', fee: 40, image: 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=120&q=70', lat: 40.4319, lng: 116.5704 },
          { id: 't5', name: 'The Forbidden City', name_zh: '故宫', time: '2:00 PM', fee: 60, image: 'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?w=120&q=70', lat: 39.9163, lng: 116.3972 },
        ]
      },
      {
        day: 2, city: "Xi'an",
        items: [
          { id: 't6', name: 'Terracotta Warriors', name_zh: '兵马俑', time: '9:00 AM', fee: 120, image: 'https://images.unsplash.com/photo-1590392751596-8bfc4bcd9df8?w=120&q=70', lat: 34.3847, lng: 109.2786 },
          { id: 't7', name: 'Muslim Quarter', name_zh: '回民街', time: '2:00 PM', fee: 0, image: 'https://images.unsplash.com/photo-1547981609-4b6bfe67ca0b?w=120&q=70', lat: 34.2658, lng: 108.9425 },
        ]
      }
    ]
  }
}

const TRANSPORT_PER_DAY = 150
const FOOD_PER_DAY = 120

function escapeHtml(str = '') {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}


// ── Main page ────────────────────────────────────────────────────────────────
function ItineraryContent() {
  const supabase = createClient()
  const searchParams = useSearchParams()

  const [title, setTitle] = useState('My Itinerary')
  const [editingTitle, setEditingTitle] = useState(false)
  const [days, setDays] = useState([{ day: 1, city: 'Beijing', items: [] }])
  const [attractions, setAttractions] = useState([])
  const [attrError, setAttrError] = useState('')
  const [showAttrPicker, setShowAttrPicker] = useState(null) // day index
  const [attrSearch, setAttrSearch] = useState('')
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState(null) // { msg, undo }
  const [dragInfo, setDragInfo] = useState(null) // { dayIdx, itemIdx }
  const [dragOverInfo, setDragOverInfo] = useState(null) // { dayIdx, itemIdx }
  const [pendingReplace, setPendingReplace] = useState(null) // { label, apply }
  const [savedItineraries, setSavedItineraries] = useState([])
  const [savedLoading, setSavedLoading] = useState(false)
  const [savedError, setSavedError] = useState('')
  const [activeTab, setActiveTab] = useState('builder') // builder | saved
  const [user, setUser] = useState(null)
  const toastTimer = useRef(null)
  const backupRef = useRef(null) // { title, days } for Undo after replace
  const urlLoadedRef = useRef(false)
  const pickerOpenerRef = useRef(null) // element to restore focus to when the picker closes


  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)

      await loadAttractions()
      fetchSaved()
    }
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function loadAttractions() {
    setAttrError('')
    try {
      const res = await fetch('/api/attractions')
      const json = await res.json().catch(() => ({ data: [] }))
      if (res.ok) setAttractions(json.data || [])
      else setAttrError('Couldn\u2019t load attractions. Please try again.')
    } catch {
      setAttrError('Couldn\u2019t load attractions. Please try again.')
    }
  }

  async function fetchSaved() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    setSavedLoading(true)
    setSavedError('')
    try {
      const res = await fetch('/api/itineraries')
      const json = await res.json().catch(() => ({ data: [] }))
      if (res.ok) setSavedItineraries(json.data || [])
      else setSavedError('Couldn\u2019t load your saved itineraries. Please try again.')
    } catch {
      setSavedError('Couldn\u2019t load your saved itineraries. Please try again.')
    }
    setSavedLoading(false)
  }

  // Load an itinerary shared via ?id= (e.g. from the profile page)
  useEffect(() => {
    const urlId = searchParams.get('id')
    if (!urlId || urlLoadedRef.current) return
    urlLoadedRef.current = true
    async function loadFromUrl() {
      try {
        const res = await fetch(`/api/itineraries/${urlId}`)
        const json = await res.json().catch(() => ({}))
        if (!res.ok || !json.data) {
          showToast('Couldn\u2019t load that itinerary')
          return
        }
        const it = json.data
        if (!it.metadata?.days) {
          showToast('This itinerary has no saved attraction data')
          return
        }
        confirmAndReplace(it.title, () => {
          replaceWith(it.title, it.metadata.days, `Loaded: ${it.title}`)
          setActiveTab('builder')
        })
      } catch {
        showToast('Couldn\u2019t load that itinerary')
      }
    }
    loadFromUrl()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams])

  // ── Cost calculations ──────────────────────────────────────────────────────
  const totalItems = days.flatMap(d => d.items).length
  const uniqueCities = [...new Set(days.map(d => d.city).filter(Boolean))].join(', ') || '—'
  const ticketTotal = days.flatMap(d => d.items).reduce((s, i) => s + (i.fee || 0), 0)
  const transportTotal = days.length * TRANSPORT_PER_DAY
  const foodTotal = days.length * FOOD_PER_DAY
  const grandTotal = ticketTotal + transportTotal + foodTotal

  // ── Day management ─────────────────────────────────────────────────────────
  function addDay() {
    setDays(prev => [...prev, { day: prev.length + 1, city: '', items: [] }])
  }

  function removeDay(idx) {
    if (days.length === 1) return
    setDays(prev => prev.filter((_, i) => i !== idx).map((d, i) => ({ ...d, day: i + 1 })))
  }

  function updateCity(idx, city) {
    setDays(prev => prev.map((d, i) => i === idx ? { ...d, city } : d))
  }

  // ── Attraction picker ──────────────────────────────────────────────────────
  function openAttrPicker(dayIdx) {
    // Record the focused element BEFORE the modal mounts (its autoFocus runs
    // before any effect could capture it), so focus can be restored on close.
    pickerOpenerRef.current = document.activeElement
    setShowAttrPicker(dayIdx)
  }

  function addAttractionToDay(dayIdx, attraction) {
    const item = {
      id: attraction.attraction_id,
      name: attraction.name_en,
      name_zh: attraction.name_zh,
      time: '9:00 AM',
      fee: attraction.entrance_fee || 0,
      image: attraction.image_url || FALLBACK_IMG,
      lat: null, lng: null,
    }
    setDays(prev => prev.map((d, i) => i === dayIdx ? { ...d, items: [...d.items, item] } : d))
    setShowAttrPicker(null)
    setAttrSearch('')
  }

  function removeItem(dayIdx, itemIdx) {
    setDays(prev => prev.map((d, i) => i === dayIdx
      ? { ...d, items: d.items.filter((_, j) => j !== itemIdx) }
      : d
    ))
  }

  function updateTime(dayIdx, itemIdx, time) {
    setDays(prev => prev.map((d, i) => i === dayIdx
      ? { ...d, items: d.items.map((it, j) => j === itemIdx ? { ...it, time } : it) }
      : d
    ))
  }

  function moveItem(dayIdx, itemIdx, dir) {
    setDays(prev => prev.map((d, i) => {
      if (i !== dayIdx) return d
      const target = itemIdx + dir
      if (target < 0 || target >= d.items.length) return d
      const items = [...d.items]
      const [it] = items.splice(itemIdx, 1)
      items.splice(target, 0, it)
      return { ...d, items }
    }))
  }

  // ── Drag and drop (reorder commits on drop, not on dragover) ──────────────
  function onDragStart(dayIdx, itemIdx) {
    setDragInfo({ dayIdx, itemIdx })
    setDragOverInfo(null)
  }

  function onDragEnter(dayIdx, itemIdx) {
    if (!dragInfo) return
    setDragOverInfo({ dayIdx, itemIdx })
  }

  function onDrop(dayIdx, itemIdx) {
    const from = dragInfo
    setDragInfo(null)
    setDragOverInfo(null)
    if (!from) return
    if (from.dayIdx === dayIdx && from.itemIdx === itemIdx) return
    setDays(prev => {
      const next = prev.map(d => ({ ...d, items: [...d.items] }))
      const [item] = next[from.dayIdx].items.splice(from.itemIdx, 1)
      let target = itemIdx
      if (from.dayIdx === dayIdx && from.itemIdx < itemIdx) target -= 1
      next[dayIdx].items.splice(target, 0, item)
      return next
    })
  }

  function onDragEnd() {
    setDragInfo(null)
    setDragOverInfo(null)
  }

  // ── Templates & replacing the builder ──────────────────────────────────────
  function hasBuilderContent() {
    return title !== 'My Itinerary' || days.length > 1 || days.some(d => d.items.length > 0)
  }

  function replaceWith(nextTitle, nextDays, toastMsg) {
    backupRef.current = { title, days }
    setTitle(nextTitle)
    setDays(nextDays)
    showToast(toastMsg, true)
  }

  function undoReplacement() {
    const backup = backupRef.current
    if (!backup) return
    backupRef.current = null
    setTitle(backup.title)
    setDays(backup.days)
    showToast('Restored previous itinerary')
  }

  /** Ask before overwriting a non-empty builder; otherwise apply immediately. */
  function confirmAndReplace(label, apply) {
    if (hasBuilderContent()) {
      setPendingReplace({ label, apply })
    } else {
      apply()
    }
  }

  function loadTemplate(key) {
    const t = TEMPLATES[key]
    confirmAndReplace(t.title, () => replaceWith(t.title, t.days, `Loaded: ${t.title}`))
  }

  // ── Save to Supabase ───────────────────────────────────────────────────────
  async function saveItinerary() {
    if (!user) { showToast('Please log in to save'); return }
    if (!title.trim()) { showToast('Please give your itinerary a title'); return }
    if (title.trim().length > 100) { showToast('Title must be under 100 characters'); return }
    setSaving(true)
    const res = await fetch('/api/itineraries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: title.trim(),
        duration_days: days.length,
        metadata: { days },
      }),
    })
    const json = await res.json().catch(() => ({}))
    if (!res.ok) { showToast('Error saving — ' + (json.error || 'Please try again')); setSaving(false); return }
    showToast('Itinerary saved!')
    fetchSaved()
    setSaving(false)
  }

  // ── Load saved itinerary back into builder ────────────────────────────────
  function loadIntoBuilder(itinerary) {
    if (!itinerary.metadata?.days) {
      showToast('This itinerary has no saved attraction data')
      return
    }
    confirmAndReplace(itinerary.title, () => {
      replaceWith(itinerary.title, itinerary.metadata.days, `Loaded: ${itinerary.title}`)
      setActiveTab('builder')
    })
  }

  // ── Delete saved itinerary ─────────────────────────────────────────────────
  async function handleDelete(id) {
    if (!window.confirm('Delete this saved itinerary? This cannot be undone.')) return
    const res = await fetch(`/api/itineraries/${id}`, { method: 'DELETE' })
    if (!res.ok) showToast('Error deleting — please try again')
    else showToast('Deleted')
    fetchSaved()
  }

  // ── Offline download (printable HTML page) ─────────────────────────────────
  function downloadOffline() {
    const rows = days.flatMap(d =>
      d.items.map(it => ({
        day: d.day,
        city: d.city,
        name: it.name,
        name_zh: it.name_zh,
        time: it.time,
        fee: it.fee || 0,
      }))
    )
    const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapeHtml(title)} — ChinaScape itinerary</title>
<style>
  body { font-family: Georgia, 'Times New Roman', serif; color: #1C1209; background: #fff; max-width: 720px; margin: 40px auto; padding: 0 20px; line-height: 1.6; }
  h1 { font-size: 28px; margin-bottom: 4px; }
  .meta { color: #7A6A58; font-size: 14px; margin-bottom: 28px; }
  h2 { font-size: 19px; border-bottom: 2px solid #B5271A; padding-bottom: 6px; margin-top: 28px; }
  table { width: 100%; border-collapse: collapse; font-size: 15px; }
  th, td { text-align: left; padding: 8px 6px; border-bottom: 1px solid #E8E0D4; }
  th { color: #7A6A58; font-weight: 600; font-size: 12px; text-transform: uppercase; letter-spacing: .05em; }
  .cost { margin-top: 28px; background: #FDF2F1; border: 1px solid #FADBD8; border-radius: 12px; padding: 16px 20px; font-size: 15px; }
  .cost .total { font-weight: 700; color: #B5271A; font-size: 17px; }
  footer { margin-top: 36px; font-size: 12px; color: #7A6A58; }
  @media print { body { margin: 0; } }
</style>
</head>
<body>
  <h1>${escapeHtml(title)}</h1>
  <div class="meta">Exported from ChinaScape · ${new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
  ${days.map(d => `
  <h2>Day ${d.day}${d.city ? ' — ' + escapeHtml(d.city) : ''}</h2>
  ${d.items.length === 0
    ? '<p style="color:#7A6A58">No attractions planned for this day.</p>'
    : `<table>
        <thead><tr><th>Time</th><th>Attraction</th><th>Fee</th></tr></thead>
        <tbody>
          ${d.items.map(it => `<tr><td>${escapeHtml(it.time)}</td><td>${escapeHtml(it.name)}${it.name_zh ? ' <span style="color:#7A6A58">' + escapeHtml(it.name_zh) + '</span>' : ''}</td><td>${it.fee === 0 ? 'Free' : '¥' + it.fee}</td></tr>`).join('')}
        </tbody>
      </table>`}`).join('')}
  <div class="cost">
    <div>Estimated cost: <strong>¥${grandTotal}</strong></div>
    <div style="font-size:13px;color:#7A6A58;margin-top:4px">Tickets ¥${ticketTotal} · Transport ¥${transportTotal} · Food (estimated) ¥${foodTotal}</div>
  </div>
  <footer>Generated by ChinaScape — chinascape.app. Open this file in any browser, or print it for a paper copy.</footer>
</body>
</html>`
    const blob = new Blob([html], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${title.replace(/\s+/g, '_')}_offline.html`
    a.click()
    URL.revokeObjectURL(url)
    showToast('Downloaded — open the file in any browser for offline access')
  }

  function showToast(msg, withUndo = false) {
    setToast({ msg, undo: withUndo })
    clearTimeout(toastTimer.current)
    toastTimer.current = setTimeout(() => setToast(null), 3200)
  }

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-paper">

      {/* Hero */}
      <TripHero
        title={title}
        editingTitle={editingTitle}
        setTitle={setTitle}
        setEditingTitle={setEditingTitle}
        days={days}
        grandTotal={grandTotal}
        saving={saving}
        onSave={saveItinerary}
        onDownload={downloadOffline}
        totalAttractions={totalItems}
        uniqueCities={uniqueCities}
      />

      {/* Tab bar */}
      <div className="border-b border-paper-dkr bg-white">
        <div className="max-w-[1200px] mx-auto px-4 md:px-12 flex">
          {['builder', 'saved'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-3 text-[13px] font-medium border-b-2 border-transparent bg-transparent cursor-pointer transition-all duration-200 ${activeTab === tab ? 'text-red border-red' : 'text-ink-lt hover:text-ink-md'}`}
            >
              {tab === 'builder' ? 'Builder' : `Saved (${savedItineraries.length})`}
            </button>
          ))}
        </div>
      </div>

      {/* Replace-confirmation banner */}
      {pendingReplace && (
        <div className="max-w-[1200px] mx-auto px-4 md:px-12">
          <div className="mt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-gold-lt border border-gold rounded-card px-4 py-3">
            <p className="text-[13px] text-ink-md">
              Replace your current itinerary with <strong className="text-ink">{pendingReplace.label}</strong>? Your current trip will be lost.
            </p>
            <div className="flex gap-2 shrink-0">
              <button
                onClick={() => { pendingReplace.apply(); setPendingReplace(null) }}
                className="bg-red text-white rounded-full px-4 py-2 text-xs font-semibold cursor-pointer hover:bg-red-dk transition-colors"
              >
                Replace
              </button>
              <button
                onClick={() => setPendingReplace(null)}
                className="bg-white border border-paper-dkr rounded-full px-4 py-2 text-xs font-semibold text-ink-md cursor-pointer hover:border-red hover:text-red transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── SAVED TAB ── */}
      {activeTab === 'saved' && (
        <div className="max-w-[1200px] mx-auto px-4 md:px-12 py-5 md:py-8">
          {!user ? (
            <div className="text-center py-20">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10 text-ink-xlt mb-4" aria-hidden="true">
                <rect x="3" y="11" width="18" height="11" rx="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <h3 className="font-display text-lg font-bold text-ink mb-2">Sign in to save itineraries</h3>
              <p className="text-[13px] text-ink-lt mb-5">Your itineraries are saved to your account for access anywhere.</p>
              <Link href="/login" className="bg-red text-white rounded-full px-6 py-2 text-[13px] font-semibold inline-block hover:bg-red-dk transition-colors">Sign In</Link>
            </div>
          ) : savedLoading ? (
            <div role="status" aria-live="polite" className="text-center py-20 text-ink-lt text-sm">Loading saved itineraries...</div>
          ) : savedError ? (
            <div className="text-center py-20">
              <h3 className="font-display text-lg font-bold text-ink mb-2">Couldn&rsquo;t load your itineraries</h3>
              <p className="text-[13px] text-ink-lt mb-5">{savedError}</p>
              <button
                onClick={fetchSaved}
                className="bg-red text-white rounded-full px-6 py-2 text-[13px] font-semibold cursor-pointer border-0 hover:bg-red-dk transition-colors"
              >
                Try again
              </button>
            </div>
          ) : savedItineraries.length === 0 ? (
            <div className="text-center py-20">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10 text-ink-xlt mb-4" aria-hidden="true">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <h3 className="font-display text-lg font-bold text-ink mb-2">No saved itineraries yet</h3>
              <p className="text-[13px] text-ink-lt mb-5">Build your first itinerary and click Save to see it here.</p>
              <button
                onClick={() => setActiveTab('builder')}
                className="bg-red text-white rounded-full px-6 py-2 text-[13px] font-semibold cursor-pointer border-0 hover:bg-red-dk transition-colors"
              >
                Start building
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-4">
              {savedItineraries.map((it, i) => (
                <Reveal key={it.itinerary_id} delay={i * 60}>
                  <SavedCard itinerary={it} onLoad={loadIntoBuilder} onDelete={handleDelete} />
                </Reveal>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── BUILDER TAB ── */}
      {activeTab === 'builder' && (
        <>
          {/* Templates row */}
          <div className="max-w-[1200px] mx-auto px-4 md:px-12 pt-5 pb-1">
            <Reveal>
              <div className="flex items-baseline gap-3 mb-3">
                <h2 className="font-display text-h3 font-bold text-ink">Quick-start templates</h2>
                <span className="text-[11px] text-ink-xlt hidden sm:inline">Load a ready-made itinerary</span>
              </div>
            </Reveal>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {Object.entries(TEMPLATES).map(([key, tpl], i) => {
                const firstImage = tpl.days[0]?.items?.[0]?.image || FALLBACK_IMG
                return (
                  <Reveal key={key} delay={i * 70}>
                    <button
                      onClick={() => loadTemplate(key)}
                      className="flex items-center gap-4 bg-white border border-paper-dkr rounded-card p-4 text-left cursor-pointer transition-all duration-300 hover:border-red hover:-translate-y-1 hover:shadow-card w-full group"
                    >
                      <div className="w-[56px] h-[56px] rounded-thumb overflow-hidden shrink-0">
                        <Image src={firstImage} alt="" width={120} height={90} unoptimized className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-semibold text-ink flex items-center gap-2">
                          {tpl.title}
                          <span className="text-red transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true">→</span>
                        </div>
                        <div className="text-[11px] text-ink-lt mt-1">
                          {tpl.days.length} day{tpl.days.length !== 1 ? 's' : ''} · {tpl.days.map(d => d.city).join(' & ')}
                        </div>
                      </div>
                    </button>
                  </Reveal>
                )
              })}
            </div>
          </div>

          {/* Builder grid */}
          <div className="max-w-[1200px] mx-auto px-4 md:px-12 py-5 md:py-8 grid grid-cols-1 md:grid-cols-[1fr_320px] gap-6 items-start">

            {/* Left — days */}
            <div>
              {days.map((day, dayIdx) => (
                <Reveal key={dayIdx} delay={dayIdx * 80} className="mb-4">
                  <DayCard
                    day={day}
                    dayIndex={dayIdx}
                    canRemove={days.length > 1}
                    onRemoveDay={removeDay}
                    onAddAttraction={openAttrPicker}
                    onRemoveItem={removeItem}
                    onUpdateTime={updateTime}
                    onUpdateCity={updateCity}
                    onMoveItem={moveItem}
                    onDragStart={onDragStart}
                    onDragEnter={onDragEnter}
                    onDrop={onDrop}
                    onDragEnd={onDragEnd}
                    dragInfo={dragInfo}
                    dragOverInfo={dragOverInfo}
                  />
                </Reveal>
              ))}

              <Reveal delay={days.length * 80}>
                <button
                  onClick={addDay}
                  className="w-full py-3.5 border-2 border-dashed border-paper-dkst rounded-card bg-transparent text-ink-lt text-[13px] font-semibold cursor-pointer transition-all duration-200 hover:border-red hover:text-red hover:bg-red-xlt/30"
                >
                  + Add Day {days.length + 1}
                </button>
              </Reveal>
            </div>

            {/* Right — sidebar */}
            <div className="flex flex-col gap-4">

              {/* Cost estimator */}
              <div className="bg-white border border-paper-dkr rounded-card overflow-hidden">
                <div className="px-4 py-3 font-display text-h3 font-bold text-ink border-b border-paper-dk bg-paper">
                  Cost Estimator
                </div>
                <div className="px-4 py-3">
                  <div className="flex justify-between py-3 border-b border-paper-dk text-[13px]">
                    <span className="text-ink-lt">Tickets ({totalItems} item{totalItems !== 1 ? 's' : ''})</span>
                    <span className="font-medium">¥{ticketTotal}</span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-paper-dk text-[13px]">
                    <span className="text-ink-lt">Transport ({days.length} day{days.length !== 1 ? 's' : ''})</span>
                    <span className="font-medium">¥{transportTotal}</span>
                  </div>
                  <div className="flex justify-between py-3 text-[13px]">
                    <span className="text-ink-lt">Food (estimated)</span>
                    <span className="font-medium">¥{foodTotal}</span>
                  </div>
                </div>
                <div className="flex justify-between items-center px-4 py-3 bg-red-xlt border-t border-red-lt">
                  <span className="text-sm font-bold text-red">Estimated Total</span>
                  <span className="text-[18px] font-bold text-red">¥{grandTotal}</span>
                </div>
                <div className="px-4 py-2.5 bg-paper-dk text-caption text-ink-xlt text-center border-t border-paper-dkr">
                  Transport ¥{TRANSPORT_PER_DAY}/day · Food ¥{FOOD_PER_DAY}/day
                </div>
              </div>

              {/* Trip summary */}
              <div className="bg-red-xlt border border-red-lt rounded-card px-4 py-4">
                <div className="text-xs font-bold text-red mb-2">Trip Summary</div>
                <div className="text-xs text-ink-md leading-[2.2]">
                  <div className="flex justify-between">
                    <span>Duration</span>
                    <span className="font-medium">{days.length} day{days.length !== 1 ? 's' : ''}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Attractions</span>
                    <span className="font-medium">{totalItems}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Cities</span>
                    <span className="font-medium">{uniqueCities}</span>
                  </div>
                </div>
              </div>

              {/* Offline tip */}
              <div className="bg-paper-dk rounded-card p-4 text-[11px] text-ink-lt leading-[1.6]">
                <strong className="text-ink-md">Offline mode:</strong> Download a printable HTML page of your itinerary to view offline or print.
              </div>
            </div>
          </div>
        </>
      )}

      {/* ── ATTRACTION PICKER MODAL ── */}
      {showAttrPicker !== null && (
        <AttractionPicker
          dayNumber={showAttrPicker + 1}
          attractions={attractions}
          search={attrSearch}
          error={attrError}
          openerRef={pickerOpenerRef}
          onRetry={loadAttractions}
          onSearch={setAttrSearch}
          onSelect={a => addAttractionToDay(showAttrPicker, a)}
          onClose={() => { setShowAttrPicker(null); setAttrSearch('') }}
        />
      )}

      {/* Toast */}
      <div role="status" aria-live="polite" className={`fixed bottom-8 left-1/2 -translate-x-1/2 bg-ink text-white px-6 py-3 rounded-full text-[13px] font-medium transition-transform duration-300 z-[999] max-w-[calc(100vw-32px)] text-center ${toast ? 'translate-y-0' : 'translate-y-[80px]'}`}>
        {toast?.msg}
        {toast?.undo && (
          <button
            onClick={undoReplacement}
            className="ml-3 bg-transparent border-0 text-white font-semibold underline underline-offset-2 cursor-pointer hover:text-gold-lt transition-colors"
          >
            Undo
          </button>
        )}
      </div>
    </div>
  )
}

export default function ItineraryPage() {
  return (
    <Suspense fallback={<div role="status" className="text-center py-16 text-ink-lt">Loading...</div>}>
      <ItineraryContent />
    </Suspense>
  )
}

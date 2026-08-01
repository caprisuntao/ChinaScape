'use client'
import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/utils/supabase/client'
import Link from 'next/link'
import Image from 'next/image'
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


// ── Main page ────────────────────────────────────────────────────────────────
export default function ItineraryPage() {
  const supabase = createClient()

  const [title, setTitle] = useState('My Itinerary')
  const [editingTitle, setEditingTitle] = useState(false)
  const [days, setDays] = useState([{ day: 1, city: 'Beijing', items: [] }])
  const [attractions, setAttractions] = useState([])
  const [showAttrPicker, setShowAttrPicker] = useState(null) // day index
  const [attrSearch, setAttrSearch] = useState('')
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState('')
  const [dragInfo, setDragInfo] = useState(null) // { dayIdx, itemIdx }
  const [savedItineraries, setSavedItineraries] = useState([])
  const [activeTab, setActiveTab] = useState('builder') // builder | saved
  const [user, setUser] = useState(null)
  const toastTimer = useRef(null)


  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)

      const { data } = await supabase
        .from('attraction')
        .select('*, city(*), category(*)')
      setAttractions(data || [])

      fetchSaved()
    }
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function fetchSaved() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { data } = await supabase
      .from('itinerary')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
    setSavedItineraries(data || [])
  }

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

  // ── Drag and drop ──────────────────────────────────────────────────────────
  function onDragStart(dayIdx, itemIdx) {
    setDragInfo({ dayIdx, itemIdx })
  }

  function onDragOver(e, dayIdx, itemIdx) {
    e.preventDefault()
    if (!dragInfo) return
    if (dragInfo.dayIdx === dayIdx && dragInfo.itemIdx === itemIdx) return
    setDays(prev => {
      const next = prev.map(d => ({ ...d, items: [...d.items] }))
      const [item] = next[dragInfo.dayIdx].items.splice(dragInfo.itemIdx, 1)
      next[dayIdx].items.splice(itemIdx, 0, item)
      return next
    })
    setDragInfo({ dayIdx, itemIdx })
  }

  function onDragEnd() { setDragInfo(null) }

  // ── Templates ──────────────────────────────────────────────────────────────
  function loadTemplate(key) {
    const t = TEMPLATES[key]
    setTitle(t.title)
    setDays(t.days)
    showToast(`Loaded: ${t.title}`)
  }

  // ── Save to Supabase ───────────────────────────────────────────────────────
  async function saveItinerary() {
    if (!user) { showToast('Please log in to save'); return }
    if (!title.trim()) { showToast('Please give your itinerary a title'); return }
    if (title.trim().length > 100) { showToast('Title must be under 100 characters'); return }
    setSaving(true)
    const { error } = await supabase.from('itinerary').insert({
      user_id: user.id,
      title: title.trim(),
      duration_days: days.length,
      is_template: false,
      metadata: { days },
    })
    if (error) { showToast('Error saving — ' + error.message); setSaving(false); return }
    showToast('Itinerary saved!')
    fetchSaved()
    setSaving(false)
  }

  // ── Load saved itinerary back into builder ───────────────────────────────────────────
  function loadIntoBuilder(itinerary) {
    if (!itinerary.metadata?.days) {
      showToast('This itinerary has no saved attraction data')
      return
    }
    setTitle(itinerary.title)
    setDays(itinerary.metadata.days)
    setActiveTab('builder')
    showToast('Loaded: ' + itinerary.title)
  }

  // ── Delete saved itinerary ─────────────────────────────────────────────────
  async function handleDelete(id) {
    if (!window.confirm('Delete this saved itinerary? This cannot be undone.')) return
    await supabase.from('itinerary').delete().eq('itinerary_id', id)
    fetchSaved()
    showToast('Deleted')
  }

  // ── Offline download ───────────────────────────────────────────────────────
  function downloadOffline() {
    const content = {
      title,
      exported_at: new Date().toISOString(),
      days: days.map(d => ({
        day: d.day,
        city: d.city,
        attractions: d.items.map(it => ({
          name: it.name,
          name_zh: it.name_zh,
          time: it.time,
          entrance_fee: `¥${it.fee}`,
        }))
      })),
      cost_estimate: {
        tickets: `¥${ticketTotal}`,
        transport: `¥${transportTotal}`,
        food: `¥${foodTotal}`,
        total: `¥${grandTotal}`,
      }
    }
    const blob = new Blob([JSON.stringify(content, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${title.replace(/\s+/g, '_')}_offline.json`
    a.click()
    URL.revokeObjectURL(url)
    showToast('Downloaded for offline use!')
  }

  function showToast(msg) {
    setToast(msg)
    clearTimeout(toastTimer.current)
    toastTimer.current = setTimeout(() => setToast(''), 2800)
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
        <div className="max-w-[1200px] mx-auto px-4 md:px-[60px] flex">
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

      {/* ── SAVED TAB ── */}
      {activeTab === 'saved' && (
        <div className="max-w-[1200px] mx-auto px-4 md:px-[60px] py-5 md:py-[32px]">
          {!user ? (
            <div className="text-center py-[80px]">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10 text-ink-xlt mb-4" aria-hidden="true">
                <rect x="3" y="11" width="18" height="11" rx="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <h3 className="font-display text-lg font-bold text-ink mb-2">Sign in to save itineraries</h3>
              <p className="text-[13px] text-ink-lt mb-5">Your itineraries are saved to your account for access anywhere.</p>
              <Link href="/login" className="bg-red text-white rounded-full px-6 py-[10px] text-[13px] font-semibold inline-block hover:bg-red-dk transition-colors">Sign In</Link>
            </div>
          ) : savedItineraries.length === 0 ? (
            <div className="text-center py-[80px]">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10 text-ink-xlt mb-4" aria-hidden="true">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <h3 className="font-display text-lg font-bold text-ink mb-2">No saved itineraries yet</h3>
              <p className="text-[13px] text-ink-lt mb-5">Build your first itinerary and click Save to see it here.</p>
              <button
                onClick={() => setActiveTab('builder')}
                className="bg-red text-white rounded-full px-6 py-[10px] text-[13px] font-semibold cursor-pointer border-0 hover:bg-red-dk transition-colors"
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
          <div className="max-w-[1200px] mx-auto px-4 md:px-[60px] pt-5 pb-1">
            <Reveal>
              <div className="flex items-baseline gap-3 mb-3">
                <h2 className="font-display text-[15px] font-bold text-ink">Quick-start templates</h2>
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
                        <Image src={firstImage} alt={tpl.title} width={120} height={90} unoptimized className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-semibold text-ink flex items-center gap-2">
                          {tpl.title}
                          <span className="text-red transition-transform duration-300 group-hover:translate-x-1">→</span>
                        </div>
                        <div className="text-[11px] text-ink-lt mt-[3px]">
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
          <div className="max-w-[1200px] mx-auto px-4 md:px-[60px] py-5 md:py-[28px] grid grid-cols-1 md:grid-cols-[1fr_320px] gap-[24px] items-start">

            {/* Left — days */}
            <div>
              {days.map((day, dayIdx) => (
                <Reveal key={dayIdx} delay={dayIdx * 80} className="mb-4">
                  <DayCard
                    day={day}
                    dayIndex={dayIdx}
                    canRemove={days.length > 1}
                    onRemoveDay={removeDay}
                    onAddAttraction={setShowAttrPicker}
                    onRemoveItem={removeItem}
                    onUpdateTime={updateTime}
                    onUpdateCity={updateCity}
                    onDragStart={onDragStart}
                    onDragOver={onDragOver}
                    onDragEnd={onDragEnd}
                    dragInfo={dragInfo}
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
            <div className="flex flex-col gap-[14px]">

              {/* Cost estimator */}
              <div className="bg-white border border-paper-dkr rounded-card overflow-hidden">
                <div className="px-[18px] py-[14px] font-display text-[15px] font-bold text-ink border-b border-paper-dk bg-paper">
                  Cost Estimator
                </div>
                <div className="px-[18px] py-3">
                  <div className="flex justify-between py-2.5 border-b border-paper-dk text-[13px]">
                    <span className="text-ink-lt">Tickets ({totalItems} item{totalItems !== 1 ? 's' : ''})</span>
                    <span className="font-medium">¥{ticketTotal}</span>
                  </div>
                  <div className="flex justify-between py-2.5 border-b border-paper-dk text-[13px]">
                    <span className="text-ink-lt">Transport ({days.length} day{days.length !== 1 ? 's' : ''})</span>
                    <span className="font-medium">¥{transportTotal}</span>
                  </div>
                  <div className="flex justify-between py-2.5 text-[13px]">
                    <span className="text-ink-lt">Food (estimated)</span>
                    <span className="font-medium">¥{foodTotal}</span>
                  </div>
                </div>
                <div className="flex justify-between items-center px-[18px] py-3 bg-red-xlt border-t border-red-lt">
                  <span className="text-[14px] font-bold text-red">Estimated Total</span>
                  <span className="text-[18px] font-bold text-red">¥{grandTotal}</span>
                </div>
                <div className="px-[18px] py-2.5 bg-paper-dk text-[10px] text-ink-xlt text-center border-t border-paper-dkr">
                  Transport ¥{TRANSPORT_PER_DAY}/day · Food ¥{FOOD_PER_DAY}/day
                </div>
              </div>

              {/* Trip summary */}
              <div className="bg-red-xlt border border-red-lt rounded-card px-4 py-[14px]">
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
                <strong className="text-ink-md">Offline mode:</strong> Download your itinerary as a JSON file for offline access anywhere.
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
          onSearch={setAttrSearch}
          onSelect={a => addAttractionToDay(showAttrPicker, a)}
          onClose={() => { setShowAttrPicker(null); setAttrSearch('') }}
        />
      )}

      {/* Toast */}
      <div className={`fixed bottom-[28px] left-1/2 -translate-x-1/2 bg-ink text-white px-[22px] py-[11px] rounded-full text-[13px] font-medium transition-transform duration-300 z-[999] whitespace-nowrap ${toast ? 'translate-y-0' : 'translate-y-[80px]'}`}>{toast}</div>
    </div>
  )
}

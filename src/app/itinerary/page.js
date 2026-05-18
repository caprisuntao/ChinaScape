'use client'
import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/utils/supabase/client'
import Link from 'next/link'

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
    title: 'Beijing & Xi\'an Classic',
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


// ── Helper: convert any time format to HH:MM for <input type="time"> ──────────
function toTimeInputValue(time) {
  if (!time) return '09:00'
  // Already in HH:MM 24-hour format
  if (/^\d{1,2}:\d{2}$/.test(time)) {
    return time.padStart(5, '0')
  }
  // Parse 12-hour format like "7:00 AM" or "1:30 PM"
  const match = time.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i)
  if (match) {
    let h = parseInt(match[1])
    const m = match[2]
    if (match[3].toUpperCase() === 'PM' && h !== 12) h += 12
    if (match[3].toUpperCase() === 'AM' && h === 12) h = 0
    return `${h.toString().padStart(2, '0')}:${m}`
  }
  return '09:00'
}

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

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => setUser(user))
    fetchAttractions()
    fetchSaved()
  }, [])

  async function fetchAttractions() {
    const { data } = await supabase
      .from('attraction')
      .select('*, city(*), category(*)')
    setAttractions(data || [])
  }

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
      image: attraction.image_url || 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=120&q=70',
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
    setSaving(true)
    const { error } = await supabase.from('itinerary').insert({
      user_id: user.id,
      title,
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
    setTimeout(() => setToast(''), 2800)
  }

  const filteredAttractions = attractions.filter(a =>
    a.name_en.toLowerCase().includes(attrSearch.toLowerCase()) ||
    a.city?.name_en?.toLowerCase().includes(attrSearch.toLowerCase())
  )

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div style={{ minHeight: '100vh', background: 'var(--paper)' }}>

      {/* Top bar */}
      <div className="detail-bar" style={{ padding: '0 32px' }}>
        <Link href="/" className="detail-action">← Back</Link>

        {/* Editable title */}
        {editingTitle ? (
          <input
            autoFocus
            value={title}
            onChange={e => setTitle(e.target.value)}
            onBlur={() => setEditingTitle(false)}
            onKeyDown={e => e.key === 'Enter' && setEditingTitle(false)}
            style={{ fontFamily: "'Noto Serif SC', serif", fontSize: 16, fontWeight: 700, border: 'none', borderBottom: '2px solid #B5271A', outline: 'none', background: 'transparent', padding: '2px 6px', color: 'var(--ink)', minWidth: 200 }}
          />
        ) : (
          <div
            onClick={() => setEditingTitle(true)}
            style={{ fontFamily: "'Noto Serif SC', serif", fontSize: 17, fontWeight: 700, cursor: 'pointer', padding: '14px 0', display: 'flex', alignItems: 'center', gap: 6 }}
            title="Click to rename"
          >
            {title} <span style={{ fontSize: 11, color: '#7A6A58', fontFamily: 'inherit' }}>✎</span>
          </div>
        )}

        <div style={{ display: 'flex', gap: 8, marginLeft: 'auto' }}>
          <button
            onClick={downloadOffline}
            style={{ background: 'var(--paper)', color: 'var(--ink-md)', border: '1px solid #E8E0D4', borderRadius: 20, padding: '6px 14px', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}
          >
             Offline
          </button>
          <button
            onClick={saveItinerary}
            disabled={saving}
            className="detail-save"
            style={{ opacity: saving ? 0.7 : 1 }}
          >
            {saving ? 'Saving…' : 'Save'}
          </button>
        </div>
      </div>

      {/* Tab bar */}
      <div style={{ display: 'flex', borderBottom: '1px solid #E8E0D4', background: '#fff', padding: '0 32px' }}>
        {['builder', 'saved'].map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} style={{
            padding: '12px 20px', fontSize: 13, fontWeight: 500, border: 'none', background: 'none', cursor: 'pointer', fontFamily: 'inherit',
            color: activeTab === tab ? '#B5271A' : '#7A6A58',
            borderBottom: activeTab === tab ? '2px solid #B5271A' : '2px solid transparent',
          }}>
            {tab === 'builder' ? ' Builder' : ` Saved (${savedItineraries.length})`}
          </button>
        ))}
      </div>

      {/* ── SAVED TAB ── */}
      {activeTab === 'saved' && (
        <div style={{ padding: '32px 48px' }}>
          {!user ? (
            <div style={{ textAlign: 'center', padding: '60px 0', color: '#7A6A58' }}>
              <p style={{ fontSize: 15, marginBottom: 16 }}>Log in to see your saved itineraries</p>
              <Link href="/login" style={{ background: '#B5271A', color: '#fff', borderRadius: 24, padding: '10px 24px', textDecoration: 'none', fontSize: 14, fontWeight: 600 }}>Sign In</Link>
            </div>
          ) : savedItineraries.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 0', color: '#7A6A58' }}>
              No saved itineraries yet. Build one and click Save!
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px,1fr))', gap: 16 }}>
              {savedItineraries.map(it => (
                <div key={it.itinerary_id} style={{ background: '#fff', border: '1px solid #E8E0D4', borderRadius: 12, padding: '18px 20px' }}>
                  <div style={{ fontFamily: "'Noto Serif SC', serif", fontSize: 15, fontWeight: 700, marginBottom: 4 }}>{it.title}</div>
                  <div style={{ fontSize: 12, color: '#7A6A58', marginBottom: 14 }}>{it.duration_days} day{it.duration_days !== 1 ? 's' : ''} · Saved {new Date(it.created_at).toLocaleDateString()}</div>
                  <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
                    <button
                      onClick={() => loadIntoBuilder(it)}
                      style={{ flex: 1, background: '#B5271A', color: '#fff', border: 'none', borderRadius: 20, padding: '8px 0', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}
                    >
                      Load into Builder
                    </button>
                    <button
                      onClick={async () => {
                        await supabase.from('itinerary').delete().eq('itinerary_id', it.itinerary_id)
                        fetchSaved()
                        showToast('Deleted')
                      }}
                      style={{ background: 'none', border: '1px solid #E8E0D4', borderRadius: 20, padding: '8px 14px', fontSize: 12, color: '#7A6A58', cursor: 'pointer', fontFamily: 'inherit' }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── BUILDER TAB ── */}
      {activeTab === 'builder' && (
        <div className="itin-page" style={{ alignItems: 'start' }}>

          {/* Left — days */}
          <div className="itin-main" style={{ flex: 1 }}>


            {/* Day cards */}
            {days.map((day, dayIdx) => (
              <div key={dayIdx} className="day-card" style={{ marginBottom: 16 }}>
                <div className="day-head">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1 }}>
                    <h3 style={{ fontFamily: "'Noto Serif SC', serif", fontSize: 14, color: '#fff' }}>Day {day.day}</h3>
                    <input
                      value={day.city}
                      onChange={e => updateCity(dayIdx, e.target.value)}
                      placeholder="City name"
                      style={{ background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.4)', borderRadius: 6, padding: '3px 10px', color: '#fff', fontSize: 12, fontFamily: 'inherit', outline: 'none', width: 120 }}
                    />
                  </div>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button
                      onClick={() => setShowAttrPicker(dayIdx)}
                      className="day-add"
                      title="Add attraction"
                    >+</button>
                    {days.length > 1 && (
                      <button
                        onClick={() => removeDay(dayIdx)}
                        style={{ width: 28, height: 28, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.4)', background: 'none', color: '#fff', cursor: 'pointer', fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        title="Remove day"
                      >×</button>
                    )}
                  </div>
                </div>

                {day.items.length === 0 ? (
                  <div style={{ padding: '24px 18px', textAlign: 'center', color: '#BFB5A8', fontSize: 13 }}>
                    Click <strong>+</strong> to add attractions to this day
                  </div>
                ) : (
                  day.items.map((item, itemIdx) => (
                    <div
                      key={item.id + itemIdx}
                      className="act-row"
                      draggable
                      onDragStart={() => onDragStart(dayIdx, itemIdx)}
                      onDragOver={e => onDragOver(e, dayIdx, itemIdx)}
                      onDragEnd={onDragEnd}
                      style={{ opacity: dragInfo?.dayIdx === dayIdx && dragInfo?.itemIdx === itemIdx ? 0.4 : 1, cursor: 'grab' }}
                    >
                      <span className="act-drag" title="Drag to reorder">☰</span>
                      <div className="act-img">
                        <img src={item.image} alt={item.name} onError={e => e.target.src = 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=120&q=70'} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <div className="act-name">{item.name}</div>
                        <div style={{ fontSize: 11, color: '#7A6A58' }}>{item.name_zh} · ¥{item.fee}</div>
                      </div>
                      <input
                        type="time"
                        value={toTimeInputValue(item.time)}
                        onChange={e => updateTime(dayIdx, itemIdx, e.target.value)}
                        style={{ border: '1px solid #E8E0D4', borderRadius: 6, padding: '3px 8px', fontSize: 12, fontFamily: 'inherit', color: '#3D2E1E', outline: 'none', background: 'var(--paper)' }}
                      />
                      <button
                        onClick={() => removeItem(dayIdx, itemIdx)}
                        style={{ background: 'none', border: 'none', color: '#BFB5A8', cursor: 'pointer', fontSize: 16, padding: '0 4px', lineHeight: 1 }}
                        title="Remove"
                      >×</button>
                    </div>
                  ))
                )}
              </div>
            ))}

            {/* Add day button */}
            <button
              onClick={addDay}
              style={{ width: '100%', padding: '12px 0', border: '2px dashed #D9CFC0', borderRadius: 12, background: 'none', color: '#7A6A58', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', transition: 'all .2s' }}
              onMouseEnter={e => { e.target.style.borderColor = '#B5271A'; e.target.style.color = '#B5271A' }}
              onMouseLeave={e => { e.target.style.borderColor = '#D9CFC0'; e.target.style.color = '#7A6A58' }}
            >
              + Add Day {days.length + 1}
            </button>
          </div>

          {/* Right — sidebar */}
          <div className="itin-side">

            {/* Cost estimator */}
            <div className="cost-card">
              <div className="cost-title"> Cost Estimator</div>
              <div className="cost-row">
                <span className="cost-label"> Tickets</span>
                <span style={{ fontWeight: 500 }}>¥{ticketTotal}</span>
              </div>
              <div className="cost-row">
                <span className="cost-label"> Transport</span>
                <span style={{ fontWeight: 500 }}>¥{transportTotal}</span>
              </div>
              <div className="cost-row">
                <span className="cost-label"> Food (est.)</span>
                <span style={{ fontWeight: 500 }}>¥{foodTotal}</span>
              </div>
              <div className="cost-row" style={{ borderTop: '2px solid #E8E0D4', marginTop: 4, paddingTop: 12, fontWeight: 700, color: '#B5271A' }}>
                <span>Total</span>
                <span>¥{grandTotal}</span>
              </div>
              <div style={{ fontSize: 10, color: '#BFB5A8', marginTop: 8, lineHeight: 1.5 }}>
                Transport estimated at ¥{TRANSPORT_PER_DAY}/day · Food estimated at ¥{FOOD_PER_DAY}/day
              </div>
            </div>

            {/* Templates */}
            <div style={{ background: '#fff', border: '1px solid #E8E0D4', borderRadius: 12, overflow: 'hidden', marginBottom: 14 }}>
              <div style={{ padding: '12px 16px', fontFamily: "'Noto Serif SC', serif", fontSize: 14, fontWeight: 700, borderBottom: '1px solid #F2EDE4', background: 'var(--paper)' }}>
                 Starter Templates
              </div>
              <button onClick={() => loadTemplate('1-day')} className="itin-btn" style={{ borderRadius: 0, borderBottom: '1px solid #F2EDE4' }}>
                <span> Beijing in a Day</span><span style={{ color: '#B5271A' }}>›</span>
              </button>
              <button onClick={() => loadTemplate('2-day')} className="itin-btn" style={{ borderRadius: 0 }}>
                <span> Beijing & Xi'an Classic</span><span style={{ color: '#B5271A' }}>›</span>
              </button>
            </div>

            {/* Trip summary */}
            <div style={{ background: 'var(--red-xlt)', border: '1px solid var(--red-lt)', borderRadius: 12, padding: '14px 16px', marginBottom: 14 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#B5271A', marginBottom: 8 }}> Trip Summary</div>
              <div style={{ fontSize: 12, color: '#3D2E1E', lineHeight: 2 }}>
                <div> {days.length} day{days.length !== 1 ? 's' : ''}</div>
                <div> {days.flatMap(d => d.items).length} attraction{days.flatMap(d => d.items).length !== 1 ? 's' : ''}</div>
                <div> {[...new Set(days.map(d => d.city).filter(Boolean))].join(', ') || '—'}</div>
              </div>
            </div>

            {/* Offline note */}
            <div style={{ background: '#F2EDE4', borderRadius: 12, padding: '12px 16px', fontSize: 11, color: '#7A6A58', lineHeight: 1.6 }}>
               <strong>Offline Mode:</strong> Click ⬇ Offline above to download your itinerary as a JSON file. Open it on your phone anytime — no internet needed.
            </div>
          </div>
        </div>
      )}

      {/* ── ATTRACTION PICKER MODAL ── */}
      {showAttrPicker !== null && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(28,18,9,0.5)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}
          onClick={e => { if (e.target === e.currentTarget) { setShowAttrPicker(null); setAttrSearch('') } }}
        >
          <div style={{ background: '#fff', borderRadius: 16, width: '100%', maxWidth: 520, maxHeight: '70vh', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 24px 60px rgba(28,18,9,0.2)' }}>
            <div style={{ padding: '18px 20px', borderBottom: '1px solid #F2EDE4', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontFamily: "'Noto Serif SC', serif", fontSize: 15, fontWeight: 700 }}>Add to Day {showAttrPicker + 1}</span>
              <button onClick={() => { setShowAttrPicker(null); setAttrSearch('') }} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: '#7A6A58' }}>×</button>
            </div>
            <div style={{ padding: '12px 20px', borderBottom: '1px solid #F2EDE4' }}>
              <input
                autoFocus
                value={attrSearch}
                onChange={e => setAttrSearch(e.target.value)}
                placeholder="Search attractions..."
                style={{ width: '100%', padding: '9px 14px', border: '1px solid #E8E0D4', borderRadius: 24, fontSize: 13, outline: 'none', fontFamily: 'inherit' }}
              />
            </div>
            <div style={{ overflowY: 'auto', flex: 1 }}>
              {filteredAttractions.length === 0 ? (
                <div style={{ padding: '32px 20px', textAlign: 'center', color: '#7A6A58', fontSize: 13 }}>No attractions found</div>
              ) : filteredAttractions.map(a => (
                <div
                  key={a.attraction_id}
                  onClick={() => addAttractionToDay(showAttrPicker, a)}
                  style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 20px', borderBottom: '1px solid #F2EDE4', cursor: 'pointer', transition: 'background .15s' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#FAF7F2'}
                  onMouseLeave={e => e.currentTarget.style.background = '#fff'}
                >
                  <div style={{ width: 44, height: 44, borderRadius: 8, overflow: 'hidden', flexShrink: 0 }}>
                    <img src={a.image_url || 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=120&q=70'} alt={a.name_en} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => e.target.src = 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=120&q=70'} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#1C1209' }}>{a.name_en}</div>
                    <div style={{ fontSize: 11, color: '#7A6A58' }}>{a.name_zh} · {a.city?.name_en} · ¥{a.entrance_fee || 0}</div>
                  </div>
                  <span style={{ fontSize: 18, color: '#B5271A', fontWeight: 700 }}>+</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      <div className={`toast ${toast ? 'show' : ''}`}>{toast}</div>
    </div>
  )
}
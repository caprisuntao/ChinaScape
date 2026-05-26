'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'

// --- Caching Configuration ---
const CACHE_PREFIX = 'chinascape_detail_'
const CACHE_DURATION = 5 * 60 * 1000 // 10 minutes

function getCachedAttraction(id) {
  try {
    const key = CACHE_PREFIX + id
    const cached = sessionStorage.getItem(key)
    if (!cached) return null

    const { data, timestamp } = JSON.parse(cached)
    const isExpired = Date.now() - timestamp > CACHE_DURATION

    if (isExpired) {
      sessionStorage.removeItem(key)
      return null
    }
    return data
  } catch {
    return null
  }
}

function setCachedAttraction(id, data) {
  try {
    const key = CACHE_PREFIX + id
    sessionStorage.setItem(key, JSON.stringify({
      data,
      timestamp: Date.now()
    }))
  } catch {
    // Fail silently
  }
}

export default function AttractionDetailPage() {
  const supabase = createClient()
  const { id } = useParams()
  const router = useRouter()
  
  const [attraction, setAttraction] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saved, setSaved] = useState(false)
  const [user, setUser] = useState(null)
  const [toast, setToast] = useState('')
  
  // FIXED: Added the missing state variable for cache tracking
  const [cacheStatus, setCacheStatus] = useState('') 

  useEffect(() => {
    fetchAttraction()
    checkUser()
  }, [id])

  async function fetchAttraction() {
    setLoading(true)

    // 1. Check Cache First
    const cached = getCachedAttraction(id)
    if (cached) {
      setAttraction(cached)
      setLoading(false)
      setCacheStatus('served from browser cache')
      return
    }

    // 2. Fetch from Database if no cache
    const { data, error } = await supabase
      .from('attraction')
      .select('*, city(*), category(*)')
      .eq('attraction_id', id)
      .single()

    if (error) { 
      router.push('/attractions')
      return 
    }

    setAttraction(data)
    setCachedAttraction(id, data) // Save to cache for next time
    setCacheStatus('fetched from live database')
    setLoading(false)
  }

  async function checkUser() {
    const { data: { user } } = await supabase.auth.getUser()
    setUser(user)
    
    if (user) {
      const { data } = await supabase
        .from('favourite')
        .select('favourite_id')
        .eq('attraction_id', id)
        .eq('user_id', user.id)
        .maybeSingle() 
      
      setSaved(!!data)
    }
  }

  async function handleSave() {
    if (!user) { 
      router.push('/login')
      return 
    }

    if (saved) {
      const { error } = await supabase
        .from('favourite')
        .delete()
        .eq('attraction_id', id)
        .eq('user_id', user.id)

      if (!error) {
        setSaved(false)
        showToast('Removed from favourites')
      }
    } else {
      const { error } = await supabase
        .from('favourite')
        .insert({ user_id: user.id, attraction_id: id })
      
      if (!error) {
        setSaved(true)
        showToast('Saved to favourites!')
      }
    }
  }

  function showToast(msg) {
    setToast(msg)
    setTimeout(() => setToast(''), 2500)
  }

  if (loading) return <div className="loading-state">Loading...</div>
  if (!attraction) return null

  return (
    <div>
      {/* Hero section */}
      <div className="detail-hero">
        <img
          src={attraction.image_url || 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=1200'}
          alt={attraction.name_en}
        />
        <div className="detail-hero-overlay" />
        <div className="detail-hero-text">
          <div className="detail-hero-name">{attraction.name_en}</div>
          <div className="detail-hero-cn">{attraction.name_zh}</div>
          {/* Optional Cache Status Label */}
          <div className="cache-status-overlay">{cacheStatus}</div>
        </div>
      </div>

      <div className="detail-bar">
        <Link href="/attractions" className="detail-action">← Back to Attractions</Link>
        <button className={`detail-save ${saved ? 'saved' : ''}`} onClick={handleSave}>
          {saved ? '✓ Saved' : '+ Save'}
        </button>
      </div>

      <div className="detail-body">
        <div className="detail-main">
          <div className="detail-tags">
            <span className="dtag dtag-cat">{attraction.category?.name}</span>
            <span className="dtag dtag-hrs">🕐 {attraction.opening_hours}</span>
            {attraction.passport_required && (
              <span className="dtag dtag-pass">🪪 ID / Passport Required</span>
            )}
          </div>

          <p className="detail-desc">{attraction.description_en}</p>

          {attraction.booking_notes && (
            <div className="booking-note">
              <div className="booking-note-title">📋 BEFORE YOU GO</div>
              <p className="booking-note-text">{attraction.booking_notes}</p>
            </div>
          )}

          <div className="detail-addr">
            <div className="detail-addr-label">📍 ADDRESS</div>
            <div>{attraction.address_en}</div>
            <div>{attraction.address_zh}</div>
          </div>
        </div>

        <div className="detail-sidebar">
          <div className="info-card">
            <div className="info-card-head">Visitor Info</div>
            <div className="info-row">
              <span className="info-label">Opening Hours</span>
              <span className="info-val">{attraction.opening_hours}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Entrance Fee</span>
              <span className="info-val">
                {attraction.entrance_fee === 0 ? 'Free' : `¥${attraction.entrance_fee}`}
              </span>
            </div>
            <div className="info-row">
              <span className="info-label">City</span>
              <span className="info-val">{attraction.city?.name_en}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Category</span>
              <span className="info-val">{attraction.category?.name}</span>
            </div>
          </div>

          {attraction.ticket_url && (
            <a
              href={attraction.ticket_url}
              target="_blank"
              rel="noopener noreferrer"
              className="detail-ticket-btn"
            >
              🎟 Book Tickets
            </a>
          )}

          <button
            onClick={handleSave}
            className={`detail-save-btn${saved ? ' saved' : ''}`}
          >
            {saved ? '✓ Saved to Favourites' : '+ Save to Favourites'}
          </button>
        </div>
      </div>

      <div className={`toast ${toast ? 'show' : ''}`}>{toast}</div>
    </div>
  )
}
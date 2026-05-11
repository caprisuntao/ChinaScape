'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'

export default function AttractionDetailPage() {
  const supabase = createClient()
  const { id } = useParams()
  const router = useRouter()
  const [attraction, setAttraction] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saved, setSaved] = useState(false)
  const [user, setUser] = useState(null)
  const [toast, setToast] = useState('')

  useEffect(() => {
    fetchAttraction()
    checkUser()
  }, [id])

  async function fetchAttraction() {
    const { data, error } = await supabase
      .from('attraction')
      .select('*, city(*), category(*)')
      .eq('attraction_id', id)
      .single()

    if (error) { 
      router.push('/attractions'); 
      return 
    }
    setAttraction(data)
    setLoading(false)
  }

  async function checkUser() {
    const { data: { user } } = await supabase.auth.getUser()
    setUser(user)
    
    if (user) {
      // Changed .single() to .maybeSingle() so it doesn't throw an error if not found
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
      router.push('/login'); 
      return 
    }

    if (saved) {
      // Simplified: Delete directly using attraction_id and user_id 
      // instead of fetching the favourite_id first
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

  if (loading) return <div style={{ padding: 60, textAlign: 'center', color: '#7A6A58' }}>Loading...</div>
  if (!attraction) return null

  return (
    <div>
      {/* Hero image */}
      <div className="detail-hero">
        <img
          src={attraction.image_url || 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=1200'}
          alt={attraction.name_en}
        />
        <div className="detail-hero-overlay" />
        <div className="detail-hero-text">
          <div className="detail-hero-name">{attraction.name_en}</div>
          <div className="detail-hero-cn">{attraction.name_zh}</div>
        </div>
      </div>

      {/* Action bar */}
      <div className="detail-bar">
        <Link href="/attractions" className="detail-action">← Back to Attractions</Link>
        <button className={`detail-save ${saved ? 'saved' : ''}`} onClick={handleSave}>
          {saved ? '✓ Saved' : '+ Save'}
        </button>
      </div>

      {/* Body */}
      <div className="detail-body">
        {/* Left — main info */}
        <div>
          <div className="detail-tags">
            <span className="dtag dtag-cat">{attraction.category?.name}</span>
            <span className="dtag dtag-hrs">🕐 {attraction.opening_hours}</span>
            {attraction.passport_required && (
              <span className="dtag dtag-pass">🪪 ID / Passport Required</span>
            )}
          </div>

          <p className="detail-desc">{attraction.description_en}</p>

          {attraction.booking_notes && (
            <div style={{ marginTop: 20, background: '#FEF9E7', border: '1px solid #C9960A', borderRadius: 10, padding: '14px 18px' }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#7B6000', marginBottom: 5 }}>📋 BEFORE YOU GO</div>
              <p style={{ fontSize: 13, color: '#3D2E1E', lineHeight: 1.7 }}>{attraction.booking_notes}</p>
            </div>
          )}

          {/* Address */}
          <div className="detail-addr">
            <div style={{ fontSize: 12, fontWeight: 600, color: '#3D2E1E', marginBottom: 4 }}>📍 ADDRESS</div>
            <div>{attraction.address_en}</div>
            <div>{attraction.address_zh}</div>
          </div>

          {/* Chinese flashcard */}
          {attraction.flashcard && (
            <div style={{ marginTop: 20, background: '#B5271A', borderRadius: 12, padding: '20px 24px', color: '#fff' }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', opacity: 0.8, marginBottom: 10 }}>
                🚕 SHOW THIS TO YOUR TAXI DRIVER
              </div>
              <div style={{ fontSize: 28, fontWeight: 700, fontFamily: 'serif', marginBottom: 6 }}>
                {attraction.flashcard.chinese_name}
              </div>
              <div style={{ fontSize: 16, opacity: 0.9, marginBottom: 4 }}>
                {attraction.flashcard.chinese_address}
              </div>
              <div style={{ fontSize: 13, opacity: 0.7 }}>
                {attraction.flashcard.pinyin}
              </div>
            </div>
          )}
        </div>

        {/* Right — sidebar */}
        <div>
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
            <div className="info-row">
              <span className="info-label">ID Required</span>
              <span className="info-val">{attraction.passport_required ? 'Yes' : 'No'}</span>
            </div>
          </div>

          {/* FIX: Re-added missing <a> opening tag */}
          {attraction.ticket_url && (
            <a 
              href={attraction.ticket_url}
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: 'block', background: '#B5271A', color: '#fff', borderRadius: 24, padding: '12px 0', textAlign: 'center', fontSize: 14, fontWeight: 600, textDecoration: 'none', marginBottom: 12 }}
            >
              🎟 Book Tickets
            </a>
          )}

          <button
            onClick={handleSave}
            style={{ width: '100%', background: saved ? '#3D2E1E' : '#FAF7F2', color: saved ? '#fff' : '#3D2E1E', border: '1px solid #E8E0D4', borderRadius: 24, padding: '12px 0', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}
          >
            {saved ? '✓ Saved to Favourites' : '+ Save to Favourites'}
          </button>
        </div>
      </div>

      {/* Toast */}
      <div className={`toast ${toast ? 'show' : ''}`}>{toast}</div>
    </div>
  )
}
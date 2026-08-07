'use client'
import { useEffect, useRef, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

export default function Profile() {
  const [user, setUser] = useState(null)
  const [profileData, setProfileData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [newName, setNewName] = useState('')
  const [nameError, setNameError] = useState('')
  const [updating, setUpdating] = useState(false)
  const [itineraries, setItineraries] = useState([])
  const [itinError, setItinError] = useState('')
  const [favourites, setFavourites] = useState([])
  const [favError, setFavError] = useState('')
  const [toast, setToast] = useState('')
  const toastTimer = useRef(null)

  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    async function fetchAll() {
      setLoading(true)
      const { data: { user }, error: authError } = await supabase.auth.getUser()

      if (authError || !user) {
        router.push('/login')
        return
      }

      setUser(user)

      // Fetch profile
      const profileRes = await fetch('/api/profile')
      const profileJson = await profileRes.json().catch(() => ({}))
      const profile = profileRes.ok ? profileJson.data : null
      if (profile) {
        setProfileData(profile)
        setNewName(profile.display_name)
      } else {
        setNewName(user.user_metadata?.display_name || 'Explorer')
      }

      await Promise.all([loadItineraries(), loadFavourites()])
      setLoading(false)
    }

    fetchAll()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function loadItineraries() {
    setItinError('')
    try {
      const res = await fetch('/api/itineraries')
      const json = await res.json().catch(() => ({}))
      if (res.ok) setItineraries(json.data || [])
      else setItinError('Couldn\u2019t load your itineraries.')
    } catch {
      setItinError('Couldn\u2019t load your itineraries.')
    }
  }

  async function loadFavourites() {
    setFavError('')
    try {
      const res = await fetch('/api/favourites')
      const json = await res.json().catch(() => ({}))
      if (res.ok) setFavourites(json.data || [])
      else setFavError('Couldn\u2019t load your saved spots.')
    } catch {
      setFavError('Couldn\u2019t load your saved spots.')
    }
  }

  async function handleSaveName() {
    if (!newName.trim()) {
      setNameError('Name can\u2019t be empty')
      return
    }
    setNameError('')
    setUpdating(true)

    const res = await fetch('/api/profile', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ display_name: newName.trim() }),
    })
    const json = await res.json().catch(() => ({}))

    if (res.ok) {
      setProfileData(prev => ({ ...(prev || {}), display_name: json.data?.display_name ?? newName.trim() }))
      setIsEditing(false)
      showToast('Name updated!')
    } else {
      showToast(json.error || 'Error updating name. Try again.')
    }
    setUpdating(false)
  }

  async function removeItinerary(itineraryId) {
    if (!window.confirm('Remove this itinerary from your profile? This cannot be undone.')) return
    const res = await fetch(`/api/itineraries/${itineraryId}`, { method: 'DELETE' })
    if (res.ok) {
      setItineraries(prev => prev.filter(i => i.itinerary_id !== itineraryId))
      showToast('Itinerary removed')
    } else {
      showToast('Error removing itinerary. Try again.')
    }
  }

  async function removeFavourite(favouriteId) {
    if (!window.confirm('Remove this spot from your saved list?')) return
    const res = await fetch(`/api/favourites/${favouriteId}`, { method: 'DELETE' })
    if (res.ok) {
      setFavourites(prev => prev.filter(f => f.favourite_id !== favouriteId))
      showToast('Removed from saved spots')
    } else {
      showToast('Error removing spot. Try again.')
    }
  }

  function showToast(msg) {
    setToast(msg)
    clearTimeout(toastTimer.current)
    toastTimer.current = setTimeout(() => setToast(''), 2500)
  }

  if (loading) {
    return <div role="status" className="text-center py-16 text-ink-lt">Loading your profile...</div>
  }

  const displayName = profileData?.display_name || user?.user_metadata?.display_name || 'Explorer'
  const initials = displayName.charAt(0).toUpperCase()

  return (
    <>
      {/* Hero band */}
      <section className="bg-red">
        <div className="max-w-[1200px] mx-auto px-4 md:px-12 py-12 md:py-14">
          <Link href="/" className="text-[12px] text-white/85 hover:text-white transition-colors duration-200">← Back to Home</Link>
          <div className="flex items-center gap-4 mt-3">
            <div className="w-[56px] h-[56px] rounded-full bg-white/15 border border-white/30 flex items-center justify-center font-display text-2xl text-white font-bold shrink-0">{initials}</div>
            <div>
              {isEditing ? (
                <div>
                  <input
                    autoFocus
                    type="text"
                    value={newName}
                    aria-label="Display name"
                    onChange={e => { setNewName(e.target.value); setNameError('') }}
                    onKeyDown={e => {
                      if (e.key === 'Enter') handleSaveName()
                      if (e.key === 'Escape') { setIsEditing(false); setNewName(displayName); setNameError('') }
                    }}
                    className="bg-white/10 border border-white/30 text-white rounded-thumb px-3 py-1.5 font-display text-xl font-bold outline-none w-[240px] placeholder:text-white/50 focus-visible:ring-2 focus-visible:ring-white/60"
                    placeholder="Your name"
                  />
                  {nameError && <p className="text-xs text-gold-lt mt-1 font-medium">{nameError}</p>}
                  <div className="flex gap-2 mt-2">
                    <button onClick={handleSaveName} disabled={updating} className="text-[12px] font-semibold text-red bg-white rounded-full px-4 py-1.5 border-0 cursor-pointer disabled:opacity-60">
                      {updating ? 'Saving...' : 'Save'}
                    </button>
                    <button onClick={() => { setIsEditing(false); setNewName(displayName); setNameError('') }} className="text-[12px] text-white/85 border border-white/30 rounded-full px-4 py-1.5 bg-transparent cursor-pointer">
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-1.5">
                  <h1 className="font-display text-[24px] md:text-[30px] font-bold text-white leading-tight">{displayName}</h1>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="text-white/60 hover:text-white transition-colors cursor-pointer bg-transparent border-0 p-1"
                    title="Edit name"
                    aria-label="Edit name"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5" aria-hidden="true">
                      <path d="M17 3a2.83 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
                    </svg>
                  </button>
                </div>
              )}
              <p className="text-[13px] text-white/85 mt-1">{user?.email}</p>
            </div>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-8 px-4 md:px-12 py-4 md:py-10 items-start">
        {/* ── Sidebar ── */}
        <div>
          {/* Stats — real counts */}
          <div className="flex mt-5 border border-paper-dkr rounded-card overflow-hidden bg-white">
            <div className="flex-1 py-4 text-center border-r border-paper-dkr">
              <div className="text-xl font-bold text-red">{itineraries.length}</div>
              <div className="text-[11px] text-ink-lt mt-0.5">Itineraries</div>
            </div>
            <div className="flex-1 py-4 text-center">
              <div className="text-xl font-bold text-red">{favourites.length}</div>
              <div className="text-[11px] text-ink-lt mt-0.5">Saved</div>
            </div>
          </div>

          {/* Member since */}
          <div className="mt-4 text-[11px] text-ink-lt text-center">
            Member since {new Date(user?.created_at).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}
          </div>

          <p className="text-center text-[13px] text-ink-lt mt-5">
            <Link href="/reset-password" className="text-red font-medium">Reset password</Link>
          </p>
        </div>

        {/* ── Main content ── */}
        <div>

          {/* Saved Itineraries */}
          <div className="bg-white border border-paper-dkr rounded-card overflow-hidden mb-4">
            <div className="px-5 py-4 font-display text-h3 font-bold text-ink border-b border-paper-dk flex items-center justify-between">
              Saved Itineraries
              <Link href="/itinerary" className="text-red font-medium text-xs no-underline">+ New</Link>
            </div>

            {itinError ? (
              <div className="p-6 text-center">
                <p className="text-[13px] text-ink-md mb-3">{itinError}</p>
                <button onClick={loadItineraries} className="bg-red text-white rounded-full px-5 py-2 text-[13px] font-semibold cursor-pointer border-0 hover:bg-red-dk transition-colors">Try again</button>
              </div>
            ) : itineraries.length === 0 ? (
              <div className="p-6 text-center">
                <p className="text-[13px] text-ink-lt mb-3">No itineraries saved yet.</p>
                <Link href="/itinerary" className="bg-red text-white rounded-full px-5 py-2 text-[13px] font-semibold inline-block">Build your first itinerary →</Link>
              </div>
            ) : (
              itineraries.map(it => (
                <div key={it.itinerary_id} className="flex items-center gap-3 px-5 py-3 border-b border-paper-dk">
                  <div className="w-11 h-11 rounded-thumb bg-red-xlt border border-red-lt flex items-center justify-center shrink-0">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-red" aria-hidden="true">
                      <rect x="3" y="4" width="18" height="18" rx="2" />
                      <line x1="16" y1="2" x2="16" y2="6" />
                      <line x1="8" y1="2" x2="8" y2="6" />
                      <line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-ink truncate">{it.title}</div>
                    <div className="text-xs text-ink-lt mt-0.5">
                      {it.duration_days} day{it.duration_days !== 1 ? 's' : ''}
                      {it.metadata?.days ? ` · ${it.metadata.days.flatMap(d => d.items).length} attraction${it.metadata.days.flatMap(d => d.items).length !== 1 ? 's' : ''}` : ''}
                      {' · '}Saved {new Date(it.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </div>
                  </div>
                  <div className="flex gap-1.5 shrink-0">
                    <Link
                      href={`/itinerary?id=${it.itinerary_id}`}
                      className="text-xs text-red font-semibold px-2.5 py-1 border border-red-lt rounded-full bg-red-xlt"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => removeItinerary(it.itinerary_id)}
                      aria-label={`Remove ${it.title}`}
                      className="text-base text-ink-lt p-2 cursor-pointer transition-colors duration-200 hover:text-red bg-transparent border-0"
                      title="Remove itinerary"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px]" aria-hidden="true">
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Saved Attractions */}
          <div className="bg-white border border-paper-dkr rounded-card overflow-hidden mb-4">
            <div className="px-5 py-4 font-display text-h3 font-bold text-ink border-b border-paper-dk flex items-center justify-between">
              Saved Spots
              <Link href="/attractions" className="text-red font-medium text-xs no-underline">Browse more</Link>
            </div>

            {favError ? (
              <div className="p-6 text-center">
                <p className="text-[13px] text-ink-md mb-3">{favError}</p>
                <button onClick={loadFavourites} className="bg-red text-white rounded-full px-5 py-2 text-[13px] font-semibold cursor-pointer border-0 hover:bg-red-dk transition-colors">Try again</button>
              </div>
            ) : favourites.length === 0 ? (
              <div className="p-6 text-center">
                <p className="text-[13px] text-ink-lt mb-3">No saved spots yet.</p>
                <Link href="/attractions" className="bg-red text-white rounded-full px-5 py-2 text-[13px] font-semibold inline-block">Explore attractions →</Link>
              </div>
            ) : (
              favourites.map(fav => (
                <div key={fav.favourite_id} className="flex items-center gap-3 px-5 py-3 border-b border-paper-dk transition-colors duration-150 hover:bg-paper">
                  {/* Clickable part */}
                  <Link
                    href={`/attractions/${fav.attraction?.attraction_id}`}
                    className="flex items-center gap-3 flex-1 min-w-0"
                  >
                    <div className="w-[52px] h-[52px] rounded-thumb overflow-hidden shrink-0">
                      <Image
                        src={fav.attraction?.image_url || 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=120&q=70'}
                        alt=""
                        width={120}
                        height={90}
                        unoptimized
                        onError={e => e.target.src = 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=120&q=70'}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-ink truncate">{fav.attraction?.name_en}</div>
                      <div className="text-xs text-ink-lt mt-0.5 truncate">
                        {fav.attraction?.name_zh}
                        {fav.attraction?.city?.name_en ? ` · ${fav.attraction.city.name_en}` : ''}
                        {fav.attraction?.category?.name ? ` · ${fav.attraction.category.name}` : ''}
                      </div>
                      <div className="text-[11px] text-ink-lt mt-0.5">
                        Saved {new Date(fav.saved_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </div>
                    </div>
                  </Link>

                  {/* Fee + remove — sibling of the link, not nested inside it */}
                  <div className="flex flex-col items-end gap-1.5 shrink-0">
                    <span className={`text-xs font-semibold ${fav.attraction?.entrance_fee === 0 ? 'text-green-dk' : 'text-ink-md'}`}>
                      {fav.attraction?.entrance_fee === 0 ? 'Free' : `¥${fav.attraction?.entrance_fee}`}
                    </span>
                    <button
                      onClick={() => removeFavourite(fav.favourite_id)}
                      aria-label={`Remove ${fav.attraction?.name_en || 'this spot'} from saved`}
                      className="text-base text-ink-lt p-2 cursor-pointer transition-colors duration-200 hover:text-red bg-transparent border-0"
                      title="Remove from saved"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px]" aria-hidden="true">
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

        </div>
      </div>

      {/* Toast */}
      <div role="status" aria-live="polite" className={`fixed bottom-8 left-1/2 -translate-x-1/2 bg-ink text-white px-6 py-3 rounded-full text-[13px] font-medium transition-transform duration-300 z-[999] max-w-[calc(100vw-32px)] text-center ${toast ? 'translate-y-0' : 'translate-y-[80px]'}`}>{toast}</div>
    </>
  )
}

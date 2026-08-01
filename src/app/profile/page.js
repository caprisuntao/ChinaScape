'use client'
import { useEffect, useState } from 'react'
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
  const [updating, setUpdating] = useState(false)
  const [itineraries, setItineraries] = useState([])
  const [favourites, setFavourites] = useState([])
  const [toast, setToast] = useState('')

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
      const { data: profile } = await supabase
        .from('profile')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (profile) {
        setProfileData(profile)
        setNewName(profile.display_name)
      } else {
        setNewName(user.user_metadata?.display_name || 'Explorer')
      }

      // Fetch itineraries
      const { data: itin } = await supabase
        .from('itinerary')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
      setItineraries(itin || [])

      // Fetch favourites with attraction details
      const { data: favs } = await supabase
        .from('favourite')
        .select('*, attraction(*, city(*), category(*))')
        .eq('user_id', user.id)
        .order('saved_at', { ascending: false })
      setFavourites(favs || [])

      setLoading(false)
    }

    fetchAll()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function handleSaveName() {
    if (!newName.trim()) return
    setUpdating(true)

    const { error: authError } = await supabase.auth.updateUser({
      data: { display_name: newName }
    })

    const { error: profileError } = await supabase
      .from('profile')
      .update({ display_name: newName })
      .eq('user_id', user.id)

    if (!authError && !profileError) {
      setProfileData(prev => ({ ...prev, display_name: newName }))
      setIsEditing(false)
      showToast('Name updated!')
    } else {
      showToast('Error updating name. Try again.')
    }
    setUpdating(false)
  }

  async function removeItinerary(itineraryId) {
    if (!window.confirm('Remove this itinerary from your profile? This cannot be undone.')) return
    await supabase.from('itinerary').delete().eq('itinerary_id', itineraryId)
    setItineraries(prev => prev.filter(i => i.itinerary_id !== itineraryId))
    showToast('Itinerary removed')
  }

  async function removeFavourite(favouriteId) {
    if (!window.confirm('Remove this spot from your saved list?')) return
    await supabase.from('favourite').delete().eq('favourite_id', favouriteId)
    setFavourites(prev => prev.filter(f => f.favourite_id !== favouriteId))
    showToast('Removed from saved spots')
  }

  function showToast(msg) {
    setToast(msg)
    setTimeout(() => setToast(''), 2500)
  }

  if (loading) {
    return <div className="text-center py-[60px] text-ink-lt">Loading your profile...</div>
  }

  const displayName = profileData?.display_name || user?.user_metadata?.display_name || 'Explorer'
  const initials = displayName.charAt(0).toUpperCase()

  return (
    <>
      {/* Hero band */}
      <section className="bg-red">
        <div className="max-w-[1200px] mx-auto px-4 md:px-[60px] py-8 md:py-10">
          <Link href="/" className="text-[12px] text-white/70 hover:text-white transition-colors duration-200">← Back to Home</Link>
          <div className="flex items-center gap-4 mt-3">
            <div className="w-[56px] h-[56px] rounded-full bg-white/15 border border-white/30 flex items-center justify-center font-display text-2xl text-white font-bold shrink-0">{initials}</div>
            <div>
              {isEditing ? (
                <div>
                  <input
                    autoFocus
                    type="text"
                    value={newName}
                    onChange={e => setNewName(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSaveName()}
                    className="bg-white/10 border border-white/30 text-white rounded-md px-3 py-1.5 font-display text-xl font-bold outline-none w-[240px] placeholder:text-white/50"
                    placeholder="Your name"
                  />
                  <div className="flex gap-2 mt-2">
                    <button onClick={handleSaveName} disabled={updating} className="text-[12px] font-semibold text-red bg-white rounded-full px-4 py-1.5 border-0 cursor-pointer">
                      {updating ? 'Saving...' : 'Save'}
                    </button>
                    <button onClick={() => { setIsEditing(false); setNewName(displayName) }} className="text-[12px] text-white/80 border border-white/30 rounded-full px-4 py-1.5 bg-transparent cursor-pointer">
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-1.5">
                  <h1 className="font-display text-[24px] md:text-[30px] font-bold text-white leading-tight">{displayName}</h1>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="text-white/50 hover:text-white transition-colors cursor-pointer bg-transparent border-0 p-1"
                    title="Edit name"
                    aria-label="Edit name"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5" aria-hidden="true">
                      <path d="M17 3a2.83 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
                    </svg>
                  </button>
                </div>
              )}
              <p className="text-[13px] text-white/70 mt-1">{user?.email}</p>
            </div>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-[32px] px-4 md:px-[60px] py-4 md:py-[40px] items-start">
        {/* ── Sidebar ── */}
        <div>
          {/* Stats — real counts */}
          <div className="flex mt-5 border border-paper-dkr rounded-card overflow-hidden bg-white">
            <div className="flex-1 py-[14px] text-center border-r border-paper-dkr">
              <div className="text-xl font-bold text-red">{itineraries.length}</div>
              <div className="text-[11px] text-ink-lt mt-[2px]">Itineraries</div>
            </div>
            <div className="flex-1 py-[14px] text-center">
              <div className="text-xl font-bold text-red">{favourites.length}</div>
              <div className="text-[11px] text-ink-lt mt-[2px]">Saved</div>
            </div>
          </div>

          {/* Member since */}
          <div className="mt-4 text-[11px] text-ink-xlt text-center">
            Member since {new Date(user?.created_at).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}
          </div>

          <p className="text-center text-[13px] text-ink-lt mt-5">
            <Link href="/reset-password" className="text-red font-medium">Reset password</Link>
          </p>
        </div>

        {/* ── Main content ── */}
        <div>

          {/* Saved Itineraries */}
          <div className="bg-white border border-paper-dkr rounded-card overflow-hidden mb-[18px]">
            <div className="px-5 py-4 font-display text-[15px] font-bold text-ink border-b border-paper-dk flex items-center justify-between">
              Saved Itineraries
              <Link href="/itinerary" className="text-red font-medium text-xs no-underline">+ New</Link>
            </div>

            {itineraries.length === 0 ? (
              <div className="p-6 text-center">
                <p className="text-[13px] text-ink-lt mb-3">No itineraries saved yet.</p>
                <Link href="/itinerary" className="bg-red text-white rounded-full px-5 py-2 text-[13px] font-semibold inline-block">Build your first itinerary →</Link>
              </div>
            ) : (
              itineraries.map(it => (
                <div key={it.itinerary_id} className="flex items-center gap-[14px] px-5 py-[14px] border-b border-paper-dk cursor-pointer transition-colors duration-150 hover:bg-paper">
                  <div className="w-11 h-11 rounded-lg bg-red-xlt border border-red-lt flex items-center justify-center shrink-0">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-red" aria-hidden="true">
                      <rect x="3" y="4" width="18" height="18" rx="2" />
                      <line x1="16" y1="2" x2="16" y2="6" />
                      <line x1="8" y1="2" x2="8" y2="6" />
                      <line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-ink">{it.title}</div>
                    <div className="text-xs text-ink-lt mt-[2px]">
                      {it.duration_days} day{it.duration_days !== 1 ? 's' : ''}
                      {it.metadata?.days ? ` · ${it.metadata.days.flatMap(d => d.items).length} attraction${it.metadata.days.flatMap(d => d.items).length !== 1 ? 's' : ''}` : ''}
                      {' · '}Saved {new Date(it.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </div>
                  </div>
                  <div className="flex gap-1.5 shrink-0">
                    <Link href="/itinerary" className="text-xs text-red font-semibold px-[10px] py-[5px] border border-red-lt rounded-[14px] bg-red-xlt">Edit</Link>
                    <button
                      onClick={() => removeItinerary(it.itinerary_id)}
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
          <div className="bg-white border border-paper-dkr rounded-card overflow-hidden mb-[18px]">
            <div className="px-5 py-4 font-display text-[15px] font-bold text-ink border-b border-paper-dk flex items-center justify-between">
              Saved Spots
              <Link href="/attractions" className="text-red font-medium text-xs no-underline">Browse more</Link>
            </div>

            {favourites.length === 0 ? (
              <div className="p-6 text-center">
                <p className="text-[13px] text-ink-lt mb-3">No saved spots yet.</p>
                <Link href="/attractions" className="bg-red text-white rounded-full px-5 py-2 text-[13px] font-semibold inline-block">Explore attractions →</Link>
              </div>
            ) : (
              favourites.map(fav => (
                <Link
                  key={fav.favourite_id}
                  href={`/attractions/${fav.attraction?.attraction_id}`}
                  className="flex items-center gap-[14px] px-5 py-[14px] border-b border-paper-dk cursor-pointer transition-colors duration-150 hover:bg-paper"
                >
                  {/* Image */}
                  <div className="w-[52px] h-[52px] rounded-lg overflow-hidden shrink-0">
                    <Image
                      src={fav.attraction?.image_url || 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=120&q=70'}
                      alt={fav.attraction?.name_en}
                      width={120}
                      height={90}
                      unoptimized
                      onError={e => e.target.src = 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=120&q=70'}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1">
                    <div className="text-sm font-medium text-ink">{fav.attraction?.name_en}</div>
                    <div className="text-xs text-ink-lt mt-[2px]">
                      {fav.attraction?.name_zh}
                      {fav.attraction?.city?.name_en ? ` · ${fav.attraction.city.name_en}` : ''}
                      {fav.attraction?.category?.name ? ` · ${fav.attraction.category.name}` : ''}
                    </div>
                    <div className="text-[11px] text-ink-xlt mt-[2px]">
                      Saved {new Date(fav.saved_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </div>
                  </div>

                  {/* Fee + remove */}
                  <div className="flex flex-col items-end gap-1.5 shrink-0">
                    <span className={`text-xs font-semibold ${fav.attraction?.entrance_fee === 0 ? 'text-green-dk' : 'text-ink-md'}`}>
                      {fav.attraction?.entrance_fee === 0 ? 'Free' : `¥${fav.attraction?.entrance_fee}`}
                    </span>
                    <button
                      onClick={e => { e.preventDefault(); removeFavourite(fav.favourite_id) }}
                      className="text-base text-ink-lt p-2 cursor-pointer transition-colors duration-200 hover:text-red bg-transparent border-0"
                      title="Remove from saved"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px]" aria-hidden="true">
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                      </svg>
                    </button>
                  </div>
                </Link>
              ))
            )}
          </div>

        </div>
      </div>

      {/* Toast */}
      <div className={`fixed bottom-[28px] left-1/2 -translate-x-1/2 bg-ink text-white px-[22px] py-[11px] rounded-full text-[13px] font-medium transition-transform duration-300 z-[999] whitespace-nowrap ${toast ? 'translate-y-0' : 'translate-y-[80px]'}`}>{toast}</div>
    </>
  )
}

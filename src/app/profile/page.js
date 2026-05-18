'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

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
    await supabase.from('itinerary').delete().eq('itinerary_id', itineraryId)
    setItineraries(prev => prev.filter(i => i.itinerary_id !== itineraryId))
    showToast('Itinerary removed')
  }

  async function removeFavourite(favouriteId) {
    await supabase.from('favourite').delete().eq('favourite_id', favouriteId)
    setFavourites(prev => prev.filter(f => f.favourite_id !== favouriteId))
    showToast('Removed from saved spots')
  }

  function showToast(msg) {
    setToast(msg)
    setTimeout(() => setToast(''), 2500)
  }

  if (loading) {
    return <div style={{ padding: 60, textAlign: 'center', color: '#7A6A58' }}>Loading your profile...</div>
  }

  const displayName = profileData?.display_name || user?.user_metadata?.display_name || 'Explorer'
  const initials = displayName.charAt(0).toUpperCase()

  return (
    <div className="screen active">
      <div className="detail-bar" style={{ padding: '0 32px' }}>
        <Link href="/" className="detail-action">← Back</Link>
        <div style={{ padding: '14px 0', fontFamily: "'Noto Serif SC', serif", fontSize: 17, fontWeight: 700 }}>My Profile</div>
      </div>

      <div className="profile-page">
        {/* ── Sidebar ── */}
        <div className="profile-sidebar">
          <div className="profile-av-lg">{initials}</div>

          {isEditing ? (
            <div style={{ marginTop: 12, width: '100%' }}>
              <input
                type="text"
                value={newName}
                onChange={e => setNewName(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSaveName()}
                style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #E8E0D4', textAlign: 'center', fontFamily: 'inherit', fontSize: '15px', outline: 'none' }}
              />
              <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '10px' }}>
                <button onClick={handleSaveName} disabled={updating} style={{ color: '#B5271A', fontSize: '13px', fontWeight: 600, border: 'none', background: 'none', cursor: 'pointer' }}>
                  {updating ? 'Saving...' : 'Save'}
                </button>
                <button onClick={() => { setIsEditing(false); setNewName(displayName) }} style={{ color: '#7A6A58', fontSize: '13px', border: 'none', background: 'none', cursor: 'pointer' }}>
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="profile-name">
              {displayName}
              <span onClick={() => setIsEditing(true)} style={{ fontSize: 10, marginLeft: 8, color: '#B5271A', cursor: 'pointer', fontWeight: 400 }}>✎ Edit</span>
            </div>
          )}

          <div className="profile-sub">{user?.email}</div>
          <p style={{ textAlign: 'center', fontSize: 13, color: '#7A6A58', marginTop: 12 }}>
            <Link href="/reset-password" style={{ color: '#B5271A', fontWeight: 500 }}>Reset password</Link>
          </p>

          {/* Stats — real counts */}
          <div className="profile-stats">
            <div className="pstat">
              <div className="pstat-n">{itineraries.length}</div>
              <div className="pstat-l">Itineraries</div>
            </div>
            <div className="pstat">
              <div className="pstat-n">{favourites.length}</div>
              <div className="pstat-l">Saved</div>
            </div>
          </div>

          {/* Member since */}
          <div style={{ marginTop: 16, fontSize: 11, color: '#BFB5A8', textAlign: 'center' }}>
            Member since {new Date(user?.created_at).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}
          </div>
        </div>

        {/* ── Main content ── */}
        <div className="profile-main">

          {/* Saved Itineraries */}
          <div className="prof-card">
            <div className="prof-card-head">
              Saved Itineraries
              <Link href="/itinerary" style={{ fontSize: 12, color: '#B5271A', fontFamily: 'inherit', fontWeight: 500, textDecoration: 'none' }}>
                + New
              </Link>
            </div>

            {itineraries.length === 0 ? (
              <div style={{ padding: '24px 20px', textAlign: 'center' }}>
                <p style={{ fontSize: 13, color: '#7A6A58', marginBottom: 12 }}>No itineraries saved yet.</p>
                <Link href="/itinerary" style={{ background: '#B5271A', color: '#fff', borderRadius: 20, padding: '8px 20px', fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>
                  Build your first itinerary →
                </Link>
              </div>
            ) : (
              itineraries.map(it => (
                <div key={it.itinerary_id} className="saved-row">
                  {/* Icon */}
                  <div style={{ width: 44, height: 44, borderRadius: 8, background: '#FDF2F1', border: '1px solid #FADBD8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>
                    🗓
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1 }}>
                    <div className="saved-name">{it.title}</div>
                    <div className="saved-meta">
                      {it.duration_days} day{it.duration_days !== 1 ? 's' : ''}
                      {it.metadata?.days ? ` · ${it.metadata.days.flatMap(d => d.items).length} attraction${it.metadata.days.flatMap(d => d.items).length !== 1 ? 's' : ''}` : ''}
                      {' · '}Saved {new Date(it.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                    <Link
                      href="/itinerary"
                      style={{ fontSize: 12, color: '#B5271A', fontWeight: 600, textDecoration: 'none', padding: '5px 10px', border: '1px solid #FADBD8', borderRadius: 14, background: '#FDF2F1' }}
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => removeItinerary(it.itinerary_id)}
                      className="saved-dl"
                      title="Remove itinerary"
                    >
                      🗑
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Saved Attractions */}
          <div className="prof-card">
            <div className="prof-card-head">
              Saved Spots
              <Link href="/attractions" style={{ fontSize: 12, color: '#B5271A', fontFamily: 'inherit', fontWeight: 500, textDecoration: 'none' }}>
                Browse more
              </Link>
            </div>

            {favourites.length === 0 ? (
              <div style={{ padding: '24px 20px', textAlign: 'center' }}>
                <p style={{ fontSize: 13, color: '#7A6A58', marginBottom: 12 }}>No saved spots yet.</p>
                <Link href="/attractions" style={{ background: '#B5271A', color: '#fff', borderRadius: 20, padding: '8px 20px', fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>
                  Explore attractions →
                </Link>
              </div>
            ) : (
              favourites.map(fav => (
                <Link
                  key={fav.favourite_id}
                  href={`/attractions/${fav.attraction?.attraction_id}`}
                  className="saved-row"
                  style={{ textDecoration: 'none' }}
                >
                  {/* Image */}
                  <div className="saved-img">
                    <img
                      src={fav.attraction?.image_url || 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=120&q=70'}
                      alt={fav.attraction?.name_en}
                      onError={e => e.target.src = 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=120&q=70'}
                    />
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1 }}>
                    <div className="saved-name">{fav.attraction?.name_en}</div>
                    <div className="saved-meta">
                      {fav.attraction?.name_zh}
                      {fav.attraction?.city?.name_en ? ` · ${fav.attraction.city.name_en}` : ''}
                      {fav.attraction?.category?.name ? ` · ${fav.attraction.category.name}` : ''}
                    </div>
                    <div style={{ fontSize: 11, color: '#BFB5A8', marginTop: 2 }}>
                      Saved {new Date(fav.saved_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </div>
                  </div>

                  {/* Fee + remove */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6, flexShrink: 0 }}>
                    <span style={{ fontSize: 12, fontWeight: 600, color: fav.attraction?.entrance_fee === 0 ? '#1A6B2E' : '#3D2E1E' }}>
                      {fav.attraction?.entrance_fee === 0 ? 'Free' : `¥${fav.attraction?.entrance_fee}`}
                    </span>
                    <button
                      onClick={e => { e.preventDefault(); removeFavourite(fav.favourite_id) }}
                      className="saved-dl"
                      title="Remove from saved"
                    >
                      🗑
                    </button>
                  </div>
                </Link>
              ))
            )}
          </div>

        </div>
      </div>

      {/* Toast */}
      <div className={`toast ${toast ? 'show' : ''}`}>{toast}</div>
    </div>
  )
}
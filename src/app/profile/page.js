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
    return <div className="loading-state">Loading your profile...</div>
  }

  const displayName = profileData?.display_name || user?.user_metadata?.display_name || 'Explorer'
  const initials = displayName.charAt(0).toUpperCase()

  return (
    <div className="screen active">
      <div className="detail-bar">
        <Link href="/" className="detail-action">← Back</Link>
        <div className="detail-bar-title">My Profile</div>
      </div>

      <div className="profile-page">
        {/* ── Sidebar ── */}
        <div className="profile-sidebar">
          <div className="profile-av-lg">{initials}</div>

          {isEditing ? (
            <div className="prof-edit-wrap">
              <input
                type="text"
                value={newName}
                onChange={e => setNewName(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSaveName()}
                className="prof-edit-input"
              />
              <div className="prof-edit-actions">
                <button onClick={handleSaveName} disabled={updating} className="prof-edit-save">
                  {updating ? 'Saving...' : 'Save'}
                </button>
                <button onClick={() => { setIsEditing(false); setNewName(displayName) }} className="prof-edit-cancel">
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="profile-name">
              {displayName}
              <span onClick={() => setIsEditing(true)} className="prof-edit-icon">✎ Edit</span>
            </div>
          )}

          <div className="profile-sub">{user?.email}</div>
          <p className="prof-reset-link">
            <Link href="/reset-password" className="auth-link">Reset password</Link>
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
          <div className="prof-member-since">
            Member since {new Date(user?.created_at).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}
          </div>
        </div>

        {/* ── Main content ── */}
        <div className="profile-main">

          {/* Saved Itineraries */}
          <div className="prof-card">
            <div className="prof-card-head">
              Saved Itineraries
              <Link href="/itinerary" className="auth-link" style={{ fontSize: 12, textDecoration: 'none' }}>+ New</Link>
            </div>

            {itineraries.length === 0 ? (
              <div className="prof-empty">
                <p className="empty-state-text">No itineraries saved yet.</p>
                <Link href="/itinerary" className="empty-state-link">Build your first itinerary →</Link>
              </div>
            ) : (
              itineraries.map(it => (
                <div key={it.itinerary_id} className="saved-row">
                  <div className="prof-itin-icon">🗓</div>
                  <div className="prof-itin-info">
                    <div className="saved-name">{it.title}</div>
                    <div className="saved-meta">
                      {it.duration_days} day{it.duration_days !== 1 ? 's' : ''}
                      {it.metadata?.days ? ` · ${it.metadata.days.flatMap(d => d.items).length} attraction${it.metadata.days.flatMap(d => d.items).length !== 1 ? 's' : ''}` : ''}
                      {' · '}Saved {new Date(it.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </div>
                  </div>
                  <div className="prof-itin-actions">
                    <Link href="/itinerary" className="prof-itin-edit">Edit</Link>
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
              <Link href="/attractions" className="auth-link" style={{ fontSize: 12, textDecoration: 'none' }}>Browse more</Link>
            </div>

            {favourites.length === 0 ? (
              <div className="prof-empty">
                <p className="empty-state-text">No saved spots yet.</p>
                <Link href="/attractions" className="empty-state-link">Explore attractions →</Link>
              </div>
            ) : (
              favourites.map(fav => (
                <Link
                  key={fav.favourite_id}
                  href={`/attractions/${fav.attraction?.attraction_id}`}
                  className="saved-row"
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
                  <div className="prof-fav-meta">
                    <div className="saved-name">{fav.attraction?.name_en}</div>
                    <div className="saved-meta">
                      {fav.attraction?.name_zh}
                      {fav.attraction?.city?.name_en ? ` · ${fav.attraction.city.name_en}` : ''}
                      {fav.attraction?.category?.name ? ` · ${fav.attraction.category.name}` : ''}
                    </div>
                    <div className="prof-fav-save-date">
                      Saved {new Date(fav.saved_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </div>
                  </div>

                  {/* Fee + remove */}
                  <div className="prof-fav-side">
                    <span className={`prof-fav-fee${fav.attraction?.entrance_fee === 0 ? ' free' : ''}`}>
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
'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function Profile() {
  const [user, setUser] = useState(null)
  const [profileData, setProfileData] = useState(null)
  const [loading, setLoading] = useState(true)
  
  // New state for editing
  const [isEditing, setIsEditing] = useState(false)
  const [newName, setNewName] = useState('')
  const [updating, setUpdating] = useState(false)

  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    async function fetchProfile() {
      setLoading(true)
      const { data: { user }, error: authError } = await supabase.auth.getUser()
      
      if (authError || !user) {
        router.push('/login')
        return
      }

      setUser(user)

      const { data: profile } = await supabase
        .from('profile')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (profile) {
        setProfileData(profile)
        setNewName(profile.display_name) // Initialize input with current name
      } else {
        setNewName(user.user_metadata?.display_name || 'Explorer')
      }
      
      setLoading(false)
    }

    fetchProfile()
  }, [supabase, router])

  // Function to handle the database and auth update
  async function handleSaveName() {
    if (!newName.trim()) return
    setUpdating(true)

    // 1. Update Supabase Auth metadata
    const { error: authError } = await supabase.auth.updateUser({
      data: { display_name: newName }
    })

    // 2. Update your custom 'profile' table
    const { error: profileError } = await supabase
      .from('profile')
      .update({ display_name: newName })
      .eq('user_id', user.id)

    if (!authError && !profileError) {
      setProfileData(prev => ({ ...prev, display_name: newName }))
      setIsEditing(false)
    } else {
      alert("Error updating name. Please try again.")
    }
    setUpdating(false)
  }

  if (loading) {
    return <div style={{ padding: 60, textAlign: 'center' }}>Loading your profile...</div>
  }

  const displayName = profileData?.display_name || user?.user_metadata?.display_name || 'Explorer'
  const initials = displayName.charAt(0).toUpperCase()

  return (
    <div className="screen active">
      <div className="detail-bar" style={{padding: '0 32px'}}>
        <Link href="/" className="detail-action">← Back</Link>
        <div style={{padding: '14px 0', fontFamily: "'Noto Serif SC', serif", fontSize: 17, fontWeight: 700}}>My Profile</div>
      </div>
      
      <div className="profile-page">
        <div className="profile-sidebar">
          <div className="profile-av-lg">{initials}</div>
          
          {isEditing ? (
            <div style={{ marginTop: 12, width: '100%' }}>
              <input 
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                style={{ 
                  width: '100%', 
                  padding: '8px', 
                  borderRadius: '6px', 
                  border: '1px solid #E8E0D4',
                  textAlign: 'center',
                  fontFamily: 'inherit',
                  fontSize: '15px'
                }}
              />
              <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '10px' }}>
                <button 
                  onClick={handleSaveName} 
                  disabled={updating}
                  style={{ color: '#B5271A', fontSize: '13px', fontWeight: 600, border: 'none', background: 'none', cursor: 'pointer' }}
                >
                  {updating ? 'Saving...' : 'Save'}
                </button>
                <button 
                  onClick={() => { setIsEditing(false); setNewName(displayName); }} 
                  style={{ color: '#7A6A58', fontSize: '13px', border: 'none', background: 'none', cursor: 'pointer' }}
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="profile-name">
                {displayName} 
                <span 
                  onClick={() => setIsEditing(true)} 
                  style={{ fontSize: 10, marginLeft: 8, color: '#B5271A', cursor: 'pointer', fontWeight: 400 }}
                >
                  ✎ Edit
                </span>
              </div>
            </>
          )}

          <div className="profile-sub">{user?.email}</div>
          <p style={{ textAlign: 'center', fontSize: 13, color: '#7A6A58',marginTop: 12 }}>
          <Link href="/reset-password" style={{color: '#B5271A', fontWeight: 500 }}>Reset password</Link>
          </p>
          
          <div className="profile-stats">
            <div className="pstat"><div className="pstat-n">0</div><div className="pstat-l">Itineraries</div></div>
            <div className="pstat"><div className="pstat-n">0</div><div className="pstat-l">Saved</div></div>
          </div>
        </div>
        
        <div className="profile-main">
          {/* ... existing Itineraries and Saved Spots sections ... */}
          <div className="prof-card">
            <div className="prof-card-head">Saved Itineraries <span>Edit</span></div>
            <div className="saved-row">
              <p style={{ fontSize: 13, color: '#7A6A58', padding: '10px 0' }}>No itineraries saved yet.</p>
            </div>
          </div>
          
          <div className="prof-card">
            <div className="prof-card-head">Saved Spots <span>Edit</span></div>
            <p style={{ fontSize: 13, color: '#7A6A58', padding: '20px' }}>Your saved attractions will appear here.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
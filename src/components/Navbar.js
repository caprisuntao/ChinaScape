'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client' //[cite: 9]
import Link from 'next/link'
import SearchBar from './Searchbar'
import { useRouter } from 'next/navigation'


export default function Navbar() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    // 1. Check initial session on load
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setUser(session?.user ?? null)
      setLoading(false)
    }
    getSession()

    // 2. Listen for login/logout events across the app
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null)
      if (event === 'SIGNED_OUT') router.push('/')
    })

    return () => authListener.subscription.unsubscribe()
  }, [supabase, router])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.refresh() // Refresh to update server-side data
  }

  return (
    <div className="topbar">
      <Link href="/" className="topbar-logo" style={{ textDecoration: 'none' }}>
        ChinaScape <span>中国旅游</span>
      </Link>
      
      <div className="topbar-nav">
        <Link href="/" className="nav-item">Home</Link>
        <Link href="/itinerary" className="nav-item">Itinerary</Link>
        <Link href="/cultural" className="nav-item">Cultural Guide</Link>
        <Link href="/attractions" className="nav-item">Explore</Link>
      </div>

      <div className="topbar-right">
        <SearchBar />
        </div>

        {!loading && (
          user ? (
            <>
              <Link href="/profile" className="profile-btn" style={{ textDecoration: 'none' }}>
                <div className="profile-av">
                  {/* Show first letter of display name or 'U' */}
                  {user.user_metadata?.display_name?.charAt(0) || '旅'}
                </div>
                My Profile
              </Link>
              <button onClick={handleLogout} className="nav-item" style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="nav-item">Login</Link>
              <Link href="/register" className="profile-btn" style={{ textDecoration: 'none' }}>
                Register
              </Link>
            </>
          )
        )}
      </div>
  )
}


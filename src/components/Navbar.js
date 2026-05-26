'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import Link from 'next/link'
import SearchBar from './Searchbar'
import { useRouter, usePathname } from 'next/navigation'


export default function Navbar() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [menuOpen, setMenuOpen] = useState(false)
  const supabase = createClient()
  const router = useRouter()
  const pathname = usePathname()

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

  // Close mobile menu on route change
   
  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setMenuOpen(false)
    router.refresh()
  }

  const isActive = (path) => pathname === path ? 'active' : ''

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/itinerary', label: 'Itinerary' },
    { href: '/cultural', label: 'Cultural Guide' },
    { href: '/attractions', label: 'Explore' },
  ]

  return (
    <>
      <div className="topbar">
        <Link href="/" className="topbar-logo">
          ChinaScape <span>中国旅游</span>
        </Link>
        
        <div className="topbar-nav">
          {navLinks.map(link => (
            <Link key={link.href} href={link.href} className={`nav-item ${isActive(link.href)}`}>
              {link.label}
            </Link>
          ))}
        </div>

        <div className="topbar-right">
          <SearchBar />
        </div>

        {!loading && (
          user ? (
            <div className="topbar-auth">
              <Link href="/profile" className="profile-btn">
                <div className="profile-av">
                  {user.user_metadata?.display_name?.charAt(0) || '旅'}
                </div>
                My Profile
              </Link>
              <button onClick={handleLogout} className="nav-item logout-btn" style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                Logout
              </button>
            </div>
          ) : (
            <div className="topbar-auth">
              <Link href="/login" className="nav-item">Login</Link>
              <Link href="/register" className="profile-btn">Register</Link>
            </div>
          )
        )}

        {/* Hamburger button – visible on mobile */}
        <button
          className={`hamburger ${menuOpen ? 'open' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation menu"
          aria-expanded={menuOpen}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      {/* Mobile menu overlay */}
      <div
        className={`mobile-menu-overlay ${menuOpen ? 'open' : ''}`}
        onClick={() => setMenuOpen(false)}
        aria-hidden="true"
      />

      {/* Mobile menu drawer */}
      <div className={`mobile-menu ${menuOpen ? 'open' : ''}`}>
        <div className="mobile-menu-header">
          <Link href="/" className="topbar-logo" onClick={() => setMenuOpen(false)}>
            ChinaScape <span>中国旅游</span>
          </Link>
        </div>

        <div className="mobile-menu-search">
          <SearchBar />
        </div>

        <nav className="mobile-nav-links">
          {navLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className={`mobile-nav-item ${isActive(link.href)}`}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="mobile-menu-auth">
          {!loading && (
            user ? (
              <>
                <Link href="/profile" className="mobile-nav-item" onClick={() => setMenuOpen(false)}>
                  <span className="profile-av" style={{ display: 'inline-flex', marginRight: 10, verticalAlign: 'middle' }}>
                    {user.user_metadata?.display_name?.charAt(0) || '旅'}
                  </span>
                  My Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="mobile-nav-item mobile-logout-btn"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="mobile-nav-item" onClick={() => setMenuOpen(false)}>Login</Link>
                <Link href="/register" className="mobile-nav-item mobile-register-btn" onClick={() => setMenuOpen(false)}>
                  Register
                </Link>
              </>
            )
          )}
        </div>
      </div>
    </>
  )
}


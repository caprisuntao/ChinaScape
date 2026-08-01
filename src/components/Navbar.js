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
    // eslint-disable-next-line react-hooks/set-state-in-effect
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

  // Desktop nav item active state
  const navActive = (path) => pathname === path ? 'text-red border-red' : ''
  // Mobile nav item active state
  const mobileActive = (path) => pathname === path ? 'text-red bg-red-xlt border-red font-semibold' : ''

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/itinerary', label: 'Itinerary' },
    { href: '/cultural', label: 'Cultural Guide' },
    { href: '/attractions', label: 'Explore' },
  ]

  return (
    <>
      <div className="flex items-center bg-white border-b border-paper-dkr sticky top-0 z-[100]">
        <Link href="/" className="font-display text-xl font-bold text-red px-[28px] border-r border-paper-dkr cursor-pointer h-14 flex items-center gap-[10px] whitespace-nowrap">
          ChinaScape <span className="text-[13px] text-ink-lt font-body font-normal">中国旅游</span>
        </Link>

        <div className="hidden min-[901px]:flex items-center flex-1 px-2">
          {navLinks.map(link => (
            <Link key={link.href} href={link.href} className={`px-[18px] h-14 flex items-center text-[13px] font-medium text-ink-md cursor-pointer border-b-2 border-transparent transition-all duration-200 hover:text-red ${navActive(link.href)}`}>
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden min-[901px]:flex items-center gap-[10px] px-6 ml-auto">
          <SearchBar />
        </div>

        {!loading && (
          user ? (
            <div className="hidden min-[901px]:flex items-center gap-1">
              <Link href="/profile" className="flex items-center gap-2 bg-red-xlt border border-red-lt rounded-full px-3.5 py-1.5 text-[13px] font-medium text-red-dk transition-all duration-200 hover:bg-red-lt">
                <div className="w-[26px] h-[26px] rounded-full bg-red flex items-center justify-center text-[11px] text-white font-display font-bold">
                  {user.user_metadata?.display_name?.charAt(0) || '旅'}
                </div>
                My Profile
              </Link>
              <button onClick={handleLogout} className="px-[18px] h-14 flex items-center text-[13px] font-medium text-ink-md cursor-pointer border-b-2 border-transparent transition-all duration-200 hover:text-red bg-transparent border-0 whitespace-nowrap">
                Logout
              </button>
            </div>
          ) : (
            <div className="hidden min-[901px]:flex items-center gap-1">
              <Link href="/login" className="px-[18px] h-14 flex items-center text-[13px] font-medium text-ink-md cursor-pointer border-b-2 border-transparent transition-all duration-200 hover:text-red bg-transparent">Login</Link>
              <Link href="/register" className="flex items-center gap-2 bg-red-xlt border border-red-lt rounded-full px-3.5 py-1.5 text-[13px] font-medium text-red-dk transition-all duration-200 hover:bg-red-lt">Register</Link>
            </div>
          )
        )}

        {/* Hamburger button – visible on mobile */}
        <button
          className={`hamburger hidden max-[900px]:flex flex-col justify-center items-center gap-[5px] w-10 h-10 bg-transparent border-0 cursor-pointer p-2 z-[200] rounded-thumb transition-colors duration-200 hover:bg-paper ml-auto mr-2 ${menuOpen ? 'open' : ''}`}
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
        className={`hidden max-[900px]:block fixed inset-0 bg-ink/40 z-[150] transition-opacity duration-300 ${menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setMenuOpen(false)}
        aria-hidden="true"
      />

      {/* Mobile menu drawer */}
      <div className={`hidden max-[900px]:flex fixed top-0 right-0 w-[300px] max-w-[85vw] h-dvh bg-white z-[160] transform transition-transform duration-[350ms] ease-[cubic-bezier(.4,0,.2,1)] flex-col overflow-y-auto shadow-drawer ${menuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="px-6 pt-5 pb-3 border-b border-paper-dkr">
          <Link href="/" className="font-display text-xl font-bold text-red flex items-center gap-[10px] whitespace-nowrap" onClick={() => setMenuOpen(false)}>
            ChinaScape <span className="text-[13px] text-ink-lt font-body font-normal">中国旅游</span>
          </Link>
        </div>

        <div className="px-6 py-4 border-b border-paper-dkr">
          <SearchBar fullWidth />
        </div>

        <nav className="flex flex-col py-2">
          {navLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center px-6 py-[14px] text-sm font-medium text-ink-md cursor-pointer transition-all duration-150 border-l-[3px] border-transparent hover:text-red hover:bg-red-xlt hover:border-red ${mobileActive(link.href)}`}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="mt-auto py-4 border-t border-paper-dkr">
          {!loading && (
            user ? (
              <>
                <Link href="/profile" className={`flex items-center px-6 py-[14px] text-sm cursor-pointer transition-all duration-150 border-l-[3px] border-transparent hover:text-red hover:bg-red-xlt hover:border-red ${mobileActive('/profile')}`} onClick={() => setMenuOpen(false)}>
                  <span className="w-[26px] h-[26px] rounded-full bg-red flex items-center justify-center text-[11px] text-white font-display font-bold inline-flex mr-[10px] align-middle shrink-0">
                    {user.user_metadata?.display_name?.charAt(0) || '旅'}
                  </span>
                  My Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center px-6 py-[14px] text-sm cursor-pointer transition-all duration-150 border-l-[3px] border-transparent text-ink-lt bg-transparent w-full text-left"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className={`flex items-center px-6 py-[14px] text-sm font-medium text-ink-md cursor-pointer transition-all duration-150 border-l-[3px] border-transparent hover:text-red hover:bg-red-xlt hover:border-red ${mobileActive('/login')}`} onClick={() => setMenuOpen(false)}>Login</Link>
                <Link href="/register" className="flex items-center px-6 py-[14px] text-sm cursor-pointer transition-all duration-150 border-l-[3px] border-transparent text-red-dk font-semibold hover:bg-red-xlt hover:border-red" onClick={() => setMenuOpen(false)}>
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

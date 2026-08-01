'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import Link from 'next/link'

export default function LoginPage() {
  const router = useRouter()
  const supabase = createClient()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleLogin() {
    setError('')
    if (!email.trim()) return setError('Email is required.')
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return setError('Please enter a valid email address.')
    if (!password) return setError('Password is required.')

    setLoading(true)

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    router.push('/')
  }

  return (
    <div className="grid md:grid-cols-2">
      {/* Brand panel — desktop only */}
      <div className="hidden md:flex flex-col justify-between bg-red px-10 md:px-[60px] py-10 md:py-12 text-white">
        <Link href="/" className="font-display text-xl font-bold">
          ChinaScape <span className="text-[13px] text-white/60 font-body font-normal">中国旅游</span>
        </Link>
        <div>
          <h2 className="font-display text-[30px] font-bold leading-[1.2]">Your journey starts here.</h2>
          <p className="mt-3 text-sm text-white/75 leading-relaxed max-w-[380px]">
            Save favourite attractions, build day-by-day itineraries, and explore China&rsquo;s culture — all in one place.
          </p>
        </div>
        <div className="text-[11px] text-white/50">ChinaScape · 中国旅游</div>
      </div>

      {/* Form panel */}
      <div className="flex items-center justify-center px-5 py-12 md:py-16">
        <form
          onSubmit={e => { e.preventDefault(); handleLogin() }}
          className="w-full max-w-[400px]"
        >
          <div className="bg-white border border-paper-dkr rounded-card p-8 shadow-subtle">
            <h1 className="font-display text-2xl text-red mb-2">Welcome Back</h1>
            <p className="text-[13px] text-ink-lt mb-6">Sign in to your ChinaScape account.</p>

            {error && <div className="bg-red-xlt border border-red-lt rounded-lg px-3.5 py-[10px] text-[13px] text-red mb-4">{error}</div>}

            <div className="mb-[14px]">
              <label htmlFor="email" className="text-xs font-semibold text-ink-md block mb-[5px]">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@email.com"
                className="w-full px-3.5 py-2.5 border border-paper-dkr rounded-lg text-sm outline-none focus:border-red transition-colors"
              />
            </div>

            <div className="mb-[22px]">
              <label htmlFor="password" className="text-xs font-semibold text-ink-md block mb-[5px]">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Your password"
                className="w-full px-3.5 py-2.5 border border-paper-dkr rounded-lg text-sm outline-none focus:border-red transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red text-white rounded-full py-3 text-sm font-semibold cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed border-0 hover:bg-red-dk transition-colors"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>

            <p className="text-center text-[13px] text-ink-lt mt-[18px]">
              Don&apos;t have an account?{' '}
              <Link href="/register" className="text-red font-medium">Create one</Link><br />
              Forgot your password?{' '}
              <Link href="/forgot-password" className="text-red font-medium">Reset it</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}

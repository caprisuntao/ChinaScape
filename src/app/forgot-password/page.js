'use client'
import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import Link from 'next/link'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [isError, setIsError] = useState(false)
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  const handleReset = async (e) => {
    e.preventDefault()
    setMessage('')
    if (!email.trim()) {
      setIsError(true)
      setMessage('Email is required.')
      return
    }
    setLoading(true)
    // triggers Supabase to send a reset email
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/reset-password`,
    })
    setLoading(false)
    if (error) {
      setIsError(true)
      setMessage(error.message)
    } else {
      setIsError(false)
      setMessage('Check your email for the reset link!')
    }
  }

  return (
    <div className="grid md:grid-cols-2">
      {/* Brand panel — desktop only */}
      <div className="hidden md:flex flex-col justify-between bg-red px-10 md:px-[60px] py-10 md:py-12 text-white">
        <Link href="/" className="font-display text-xl font-bold">
          ChinaScape <span className="text-[13px] text-white/60 font-body font-normal">中国旅游</span>
        </Link>
        <div>
          <h2 className="font-display text-[30px] font-bold leading-[1.2]">Forgot your password?</h2>
          <p className="mt-3 text-sm text-white/75 leading-relaxed max-w-[380px]">
            No problem. Enter your email and we&rsquo;ll send you a link to reset it.
          </p>
        </div>
        <div className="text-[11px] text-white/50">ChinaScape · 中国旅游</div>
      </div>

      {/* Form panel */}
      <div className="flex items-center justify-center px-5 py-12 md:py-16">
        <form onSubmit={handleReset} className="w-full max-w-[400px]">
          <div className="bg-white border border-paper-dkr rounded-card p-8 shadow-subtle">
            <h1 className="font-display text-2xl text-red mb-2">Reset Password</h1>
            <p className="text-[13px] text-ink-lt mb-6">We&rsquo;ll email you a secure reset link.</p>

            {message && (
              <div className={`rounded-lg px-3.5 py-[10px] text-[13px] mb-4 ${isError ? 'bg-red-xlt border border-red-lt text-red' : 'bg-green-lt text-green-dk'}`}>
                {message}
              </div>
            )}

            <div className="mb-[22px]">
              <label htmlFor="email" className="text-xs font-semibold text-ink-md block mb-[5px]">Email</label>
              <input
                id="email"
                type="email"
                placeholder="you@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 border border-paper-dkr rounded-lg text-sm outline-none focus:border-red transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red text-white rounded-full py-3 text-sm font-semibold cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed border-0 hover:bg-red-dk transition-colors"
            >
              {loading ? 'Sending link...' : 'Send Reset Link'}
            </button>

            <Link href="/login" className="block mt-[18px] text-center text-[13px] text-ink-lt hover:text-red transition-colors">Back to Login</Link>
          </div>
        </form>
      </div>
    </div>
  )
}

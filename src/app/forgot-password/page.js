'use client'
import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import Link from 'next/link'
import AuthShell, { AuthCard, AuthAlert, AuthField, validateEmail } from '@/components/AuthShell'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [isError, setIsError] = useState(false)
  const [fieldError, setFieldError] = useState('')
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  const handleReset = async (e) => {
    e.preventDefault()
    setMessage('')
    const emailError = validateEmail(email)
    setFieldError(emailError)
    if (emailError) return
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
    <AuthShell
      headline="Forgot your password?"
      sub="No problem. Enter your email and we&rsquo;ll send you a link to reset it."
    >
      <form onSubmit={handleReset} noValidate className="w-full max-w-[400px]">
        <AuthCard>
          <h1 className="font-display text-2xl text-red mb-2">Reset Password</h1>
          <p className="text-[13px] text-ink-lt mb-6">We&rsquo;ll email you a secure reset link.</p>

          {message && <AuthAlert type={isError ? 'error' : 'success'}>{message}</AuthAlert>}

          <AuthField
            id="email"
            label="Email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="you@email.com"
            autoComplete="email"
            error={fieldError}
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red text-white rounded-full py-3 text-sm font-semibold cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed border-0 hover:bg-red-dk transition-colors"
          >
            {loading ? 'Sending link...' : 'Send Reset Link'}
          </button>

          <Link href="/login" className="block mt-4 text-center text-[13px] text-ink-lt hover:text-red transition-colors">Back to Login</Link>
        </AuthCard>
      </form>
    </AuthShell>
  )
}

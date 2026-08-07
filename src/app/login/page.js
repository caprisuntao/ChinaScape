'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import Link from 'next/link'
import AuthShell, { AuthCard, AuthAlert, AuthField, validateEmail } from '@/components/AuthShell'

export default function LoginPage() {
  const router = useRouter()
  const supabase = createClient()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})
  const [serverError, setServerError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleLogin(e) {
    e.preventDefault()
    const errors = {}
    const emailError = validateEmail(email)
    if (emailError) errors.email = emailError
    if (!password) errors.password = 'Password is required.'
    setFieldErrors(errors)
    setServerError('')
    if (Object.keys(errors).length > 0) return

    setLoading(true)

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setServerError(error.message)
      setLoading(false)
      return
    }

    router.push('/')
  }

  return (
    <AuthShell
      headline="Your journey starts here."
      sub="Save favourite attractions, build day-by-day itineraries, and explore China&rsquo;s culture — all in one place."
    >
      <form onSubmit={handleLogin} noValidate className="w-full max-w-[400px]">
        <AuthCard>
          <h1 className="font-display text-2xl text-red mb-2">Welcome Back</h1>
          <p className="text-[13px] text-ink-lt mb-6">Sign in to your ChinaScape account.</p>

          {serverError && <AuthAlert>{serverError}</AuthAlert>}

          <AuthField
            id="email"
            label="Email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="you@email.com"
            autoComplete="email"
            error={fieldErrors.email}
          />

          <AuthField
            id="password"
            label="Password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Your password"
            autoComplete="current-password"
            error={fieldErrors.password}
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red text-white rounded-full py-3 text-sm font-semibold cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed border-0 hover:bg-red-dk transition-colors"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>

          <p className="text-center text-[13px] text-ink-lt mt-4">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="text-red font-medium">Create one</Link><br />
            Forgot your password?{' '}
            <Link href="/forgot-password" className="text-red font-medium">Reset it</Link>
          </p>
        </AuthCard>
      </form>
    </AuthShell>
  )
}

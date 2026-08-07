'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import Link from 'next/link'
import AuthShell, { AuthCard, AuthAlert, AuthField, validateEmail } from '@/components/AuthShell'

export default function RegisterPage() {
  const router = useRouter()
  const supabase = createClient()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})
  const [serverError, setServerError] = useState('')
  const [notice, setNotice] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleRegister(e) {
    e.preventDefault()
    const errors = {}
    if (!name.trim()) errors.name = 'Display name is required.'
    else if (name.trim().length < 2) errors.name = 'Name must be at least 2 characters.'
    const emailError = validateEmail(email)
    if (emailError) errors.email = emailError
    if (!password) errors.password = 'Password is required.'
    else if (password.length < 6) errors.password = 'Password must be at least 6 characters.'
    setFieldErrors(errors)
    setServerError('')
    setNotice('')
    if (Object.keys(errors).length > 0) return

    setLoading(true)

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { display_name: name }
      }
    })

    if (error) {
      setServerError(error.message)
      setLoading(false)
      return
    }

    setLoading(false)

    // If email confirmation is enabled there is no session yet — tell the
    // user to confirm their email instead of silently dropping them on home.
    if (data.session) {
      router.push('/')
    } else {
      setNotice('Check your email to confirm your account — we sent a link to ' + email + '.')
    }
  }

  async function resendEmail() {
    setServerError('')
    setLoading(true)
    const { error } = await supabase.auth.resend({ type: 'signup', email })
    setLoading(false)
    if (error) setServerError(error.message)
    else setNotice('Confirmation email resent — check your inbox.')
  }

  return (
    <AuthShell
      headline="Your journey starts here."
      sub="Join thousands of travelers planning their perfect trip through China."
    >
      <form onSubmit={handleRegister} noValidate className="w-full max-w-[400px]">
        <AuthCard>
          <h1 className="font-display text-2xl text-red mb-2">Create Account</h1>
          <p className="text-[13px] text-ink-lt mb-6">Join ChinaScape to save favourites and build itineraries.</p>

          {serverError && <AuthAlert>{serverError}</AuthAlert>}

          {notice && (
            <>
              <AuthAlert type="success">{notice}</AuthAlert>
              <div className="text-center -mt-2 mb-4">
                <button
                  type="button"
                  onClick={resendEmail}
                  disabled={loading}
                  className="text-[12px] text-red font-medium bg-transparent border-0 cursor-pointer underline underline-offset-2 hover:text-red-dk disabled:opacity-60"
                >
                  {loading ? 'Sending...' : 'Resend confirmation email'}
                </button>
              </div>
            </>
          )}

          <AuthField
            id="name"
            label="Display Name"
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Your name"
            autoComplete="name"
            error={fieldErrors.name}
          />

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
            placeholder="Min. 6 characters"
            autoComplete="new-password"
            error={fieldErrors.password}
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red text-white rounded-full py-3 text-sm font-semibold cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed border-0 hover:bg-red-dk transition-colors"
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </button>

          <p className="text-center text-[13px] text-ink-lt mt-4">
            Already have an account?{' '}
            <Link href="/login" className="text-red font-medium">Sign in</Link>
          </p>
        </AuthCard>
      </form>
    </AuthShell>
  )
}

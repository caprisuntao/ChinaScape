'use client'
import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import AuthShell, { AuthCard, AuthAlert, AuthField } from '@/components/AuthShell'

export default function ResetPassword() {
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [isError, setIsError] = useState(false)
  const [fieldError, setFieldError] = useState('')
  const [loading, setLoading] = useState(false)
  const supabase = createClient()
  const router = useRouter()

  const handleUpdate = async (e) => {
    e.preventDefault()
    setMessage('')
    if (!password || password.length < 6) {
      setIsError(true)
      setFieldError('Password must be at least 6 characters.')
      return
    }
    setFieldError('')
    setLoading(true)
    const { error } = await supabase.auth.updateUser({ password })
    setLoading(false)
    if (error) {
      setIsError(true)
      setMessage(error.message)
    } else {
      setIsError(false)
      setMessage('Password updated successfully!')
      setTimeout(() => router.push('/login'), 2000)
    }
  }

  return (
    <AuthShell
      headline="Almost there."
      sub="Set a new password for your account and you&rsquo;ll be right back in."
    >
      <form onSubmit={handleUpdate} noValidate className="w-full max-w-[400px]">
        <AuthCard>
          <h1 className="font-display text-2xl text-red mb-2">Enter New Password</h1>
          <p className="text-[13px] text-ink-lt mb-6">Choose a password you&rsquo;ll remember.</p>

          {message && <AuthAlert type={isError ? 'error' : 'success'}>{message}</AuthAlert>}

          <AuthField
            id="password"
            label="New Password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Min. 6 characters"
            autoComplete="new-password"
            error={fieldError}
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red text-white rounded-full py-3 text-sm font-semibold cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed border-0 hover:bg-red-dk transition-colors"
          >
            {loading ? 'Updating...' : 'Update Password'}
          </button>

          <Link href="/login" className="block mt-4 text-center text-[13px] text-ink-lt hover:text-red transition-colors">Back to Login</Link>
        </AuthCard>
      </form>
    </AuthShell>
  )
}

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
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-title">Welcome Back</h1>
        <p className="auth-subtitle">Sign in to your ChinaScape account.</p>

        {error && <div className="auth-error">{error}</div>}

        <div className="form-group">
          <label className="form-label">Email</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="you@email.com"
            className="form-input"
          />
        </div>

        <div style={{ marginBottom: 22 }}>
          <label className="form-label">Password</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Your password"
            className="form-input"
          />
        </div>

        <button onClick={handleLogin} disabled={loading} className="btn-primary">
          {loading ? 'Signing in...' : 'Sign In'}
        </button>

        <p className="auth-footer">
          Don&apos;t have an account?{' '}
          <Link href="/register" className="auth-link">Create one</Link><br />
          Forgot your password?{' '}
          <Link href="/forgot-password" className="auth-link">Reset it</Link>
        </p>
      </div>
    </div>
  )
}
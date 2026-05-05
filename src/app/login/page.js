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
    setLoading(true)
    setError('')

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    router.push('/')
  }

  return (
    <div style={{ maxWidth: 400, margin: '80px auto', padding: '0 20px' }}>
      <div style={{ background: '#fff', border: '1px solid #E8E0D4', borderRadius: 12, padding: 32 }}>
        <h1 style={{ fontFamily: 'serif', fontSize: 24, color: '#B5271A', marginBottom: 8 }}>
          Welcome Back
        </h1>
        <p style={{ fontSize: 13, color: '#7A6A58', marginBottom: 24 }}>
          Sign in to your ChinaScape account.
        </p>

        {error && (
          <div style={{ background: '#FDF2F1', border: '1px solid #FADBD8', borderRadius: 8, padding: '10px 14px', fontSize: 13, color: '#B5271A', marginBottom: 16 }}>
            {error}
          </div>
        )}

        <div style={{ marginBottom: 14 }}>
          <label style={{ fontSize: 12, fontWeight: 600, color: '#3D2E1E', display: 'block', marginBottom: 5 }}>Email</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="you@email.com"
            style={{ width: '100%', padding: '10px 14px', border: '1px solid #E8E0D4', borderRadius: 8, fontSize: 14, outline: 'none', fontFamily: 'inherit' }}
          />
        </div>

        <div style={{ marginBottom: 22 }}>
          <label style={{ fontSize: 12, fontWeight: 600, color: '#3D2E1E', display: 'block', marginBottom: 5 }}>Password</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Your password"
            style={{ width: '100%', padding: '10px 14px', border: '1px solid #E8E0D4', borderRadius: 8, fontSize: 14, outline: 'none', fontFamily: 'inherit' }}
          />
        </div>

        <button
          onClick={handleLogin}
          disabled={loading}
          style={{ width: '100%', background: '#B5271A', color: '#fff', border: 'none', borderRadius: 24, padding: '12px 0', fontSize: 14, fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1, fontFamily: 'inherit' }}
        >
          {loading ? 'Signing in...' : 'Sign In'}
        </button>

        <p style={{ textAlign: 'center', fontSize: 13, color: '#7A6A58', marginTop: 18 }}>
          Don&apos;t have an account?{' '}
          <Link href="/register" style={{ color: '#B5271A', fontWeight: 500 }}>Create one</Link><br></br>
          Forgot your password?{' '}
          <Link href="/forgot-password" style={{ color: '#B5271A', fontWeight: 500 }}>Reset it</Link>
        </p>
        
      </div>
    </div>
  )
}
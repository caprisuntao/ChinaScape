'use client'
import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import Link from 'next/link'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const supabase = createClient()

  const handleReset = async (e) => {
    e.preventDefault()
    // triggers Supabase to send a reset email
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/reset-password`,
    })
    if (error) setMessage(error.message)
    else setMessage('Check your email for the reset link!')
  }

  return (
    <div style={{ maxWidth: 400, margin: '100px auto', padding: '20px' }}>
      <h2 style={{ fontFamily: 'serif', color: '#B5271A' }}>Reset Password</h2>
      <form onSubmit={handleReset} style={{ marginTop: 20 }}>
        <input 
          type="email" 
          placeholder="Enter your email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '8px', border: '1px solid #ddd' }}
        />
        <button type="submit" style={{ width: '100%', background: '#B5271A', color: '#fff', padding: '12px', border: 'none', borderRadius: '24px', cursor: 'pointer' }}>
          Send Reset Link
        </button>
      </form>
      {message && <p style={{ marginTop: 15, fontSize: 14 }}>{message}</p>}
      <Link href="/login" style={{ display: 'block', marginTop: 20, fontSize: 13, color: '#7A6A58' }}>Back to Login</Link>
    </div>
  )
}
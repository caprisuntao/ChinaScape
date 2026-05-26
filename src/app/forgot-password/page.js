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
    <div className="auth-page-simple">
      <h2 className="auth-title-simple">Reset Password</h2>
      <form onSubmit={handleReset} className="auth-form">
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="auth-form-input"
        />
        <button type="submit" className="auth-form-btn">Send Reset Link</button>
      </form>
      {message && <p className="auth-form-msg">{message}</p>}
      <Link href="/login" className="back-link">Back to Login</Link>
    </div>
  )
}
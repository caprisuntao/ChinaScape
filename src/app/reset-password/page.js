'use client'
import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'

export default function ResetPassword() {
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const supabase = createClient()
  const router = useRouter()

  const handleUpdate = async (e) => {
    e.preventDefault()
    const { error } = await supabase.auth.updateUser({ password })
    if (error) setMessage(error.message)
    else {
      setMessage('Password updated successfully!')
      setTimeout(() => router.push('/login'), 2000)
    }
  }

  return (
    <div className="auth-page-simple">
      <h2 className="auth-title-simple">Enter New Password</h2>
      <form onSubmit={handleUpdate} className="auth-form">
        <input
          type="password"
          placeholder="New Password (min 6 chars)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="auth-form-input"
        />
        <button type="submit" className="auth-form-btn">Update Password</button>
      </form>
      {message && <p className="auth-form-msg">{message}</p>}
    </div>
  )
}
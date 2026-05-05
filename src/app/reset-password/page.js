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
    <div style={{ maxWidth: 400, margin: '100px auto', padding: '20px' }}>
      <h2 style={{ fontFamily: 'serif', color: '#B5271A' }}>Enter New Password</h2>
      <form onSubmit={handleUpdate} style={{ marginTop: 20 }}>
        <input 
          type="password" 
          placeholder="New Password (min 6 chars)" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '8px', border: '1px solid #ddd' }}
        />
        <button type="submit" style={{ width: '100%', background: '#B5271A', color: '#fff', padding: '12px', border: 'none', borderRadius: '24px', cursor: 'pointer' }}>
          Update Password
        </button>
      </form>
      {message && <p style={{ marginTop: 15 }}>{message}</p>}
    </div>
  )
}
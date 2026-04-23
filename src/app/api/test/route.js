import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = await createClient()
  
  // Test 1: check connection
  const { data, error } = await supabase
    .from('attraction')
    .select('*')
  
  // Test 2: check auth
  const { data: { user } } = await supabase.auth.getUser()

  return NextResponse.json({ 
    data,
    error,
    user,
    url: process.env.NEXT_PUBLIC_SUPABASE_URL,
    keyStart: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.slice(0, 20)
  })
}
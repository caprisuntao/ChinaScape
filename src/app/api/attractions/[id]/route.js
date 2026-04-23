import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request, { params }) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('attraction')
    .select('*, city(*), category(*), flashcard(*)')
    .eq('attraction_id', params.id)
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 404 })
  return NextResponse.json({ data })
}
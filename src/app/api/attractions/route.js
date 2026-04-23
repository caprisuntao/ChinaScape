import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request) {
  const supabase = createClient()
  const { searchParams } = new URL(request.url)
  const search = searchParams.get('search')
  const category = searchParams.get('category')

  let query = supabase
    .from('attraction')
    .select('*, city(*), category(*)')

  if (search) query = query.ilike('name_en', `%${search}%`)
  if (category) query = query.eq('category.name', category)

  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data })
}
import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request, { params }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const body = await request.json()
  const { data, error } = await supabase
    .from('itinerary_item')
    .insert({
      itinerary_id: params.id,
      attraction_id: body.attraction_id,
      day_number: body.day_number,
      order_in_day: body.order_in_day
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data }, { status: 201 })
}
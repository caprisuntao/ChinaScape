import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'
/**
 * @swagger
 * /api/itineraries/{id}/items:
 *   post:
 *     summary: Add an attraction to an itinerary
 *     description: Adds an attraction to a specific day and position within a user's itinerary.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The itinerary UUID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - attraction_id
 *               - day_number
 *               - order_in_day
 *             properties:
 *               attraction_id:
 *                 type: string
 *                 example: uuid-of-attraction
 *               day_number:
 *                 type: integer
 *                 example: 1
 *               order_in_day:
 *                 type: integer
 *                 example: 2
 *     responses:
 *       201:
 *         description: Attraction added to itinerary successfully
 *       401:
 *         description: Unauthorised - user not logged in
 *       500:
 *         description: Server error
 */
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

export async function PATCH(request, { params }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const body = await request.json()
  const { data, error } = await supabase
    .from('itinerary_item')
    .update(body)
    .eq('itinerary_id', params.id)
    .eq('user_id', user.id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data })
}

export async function DELETE(request, { params }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const { error } = await supabase
    .from('itinerary_item')
    .delete()
    .eq('itinerary_id', params.id)
    .eq('user_id', user.id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ message: 'Deleted' })
}
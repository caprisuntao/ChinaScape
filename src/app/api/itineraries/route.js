import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'
/**
 * @swagger
 * /api/itineraries:
 *   get:
 *     summary: Get user's itineraries
 *     description: Returns all itineraries belonging to the logged-in user.
 *     responses:
 *       200:
 *         description: List of itineraries returned successfully
 *       401:
 *         description: Unauthorised - user not logged in
 *   post:
 *     summary: Create a new itinerary
 *     description: Creates a new itinerary for the logged-in user.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: My Beijing Trip
 *               duration_days:
 *                 type: integer
 *                 example: 2
 *     responses:
 *       201:
 *         description: Itinerary created successfully
 *       401:
 *         description: Unauthorised - user not logged in
 */
export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const { data, error } = await supabase
    .from('itinerary')
    .select('*, itinerary_item(*, attraction(*))')
    .eq('user_id', user.id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data })
}

export async function POST(request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const body = await request.json()
  const { data, error } = await supabase
    .from('itinerary')
    .insert({ ...body, user_id: user.id })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data }, { status: 201 })
}
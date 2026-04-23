import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'
/**
 * @swagger
 * /api/favourites:
 *   get:
 *     summary: Get user's favourite attractions
 *     description: Returns all attractions saved by the logged-in user.
 *     responses:
 *       200:
 *         description: List of favourites returned successfully
 *       401:
 *         description: Unauthorised - user not logged in
 *   post:
 *     summary: Save an attraction to favourites
 *     description: Adds an attraction to the logged-in user's favourites.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               attraction_id:
 *                 type: string
 *                 example: uuid-of-attraction
 *     responses:
 *       201:
 *         description: Attraction saved to favourites
 *       401:
 *         description: Unauthorised - user not logged in
 */
export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const { data, error } = await supabase
    .from('favourite')
    .select('*, attraction(*)')
    .eq('user_id', user.id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data })
}

export async function POST(request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const { attraction_id } = await request.json()
  const { data, error } = await supabase
    .from('favourite')
    .insert({ user_id: user.id, attraction_id })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data }, { status: 201 })
}
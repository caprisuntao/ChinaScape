import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'
import { findOwnedItinerary } from '@/utils/supabase/ownership'

/**
 * @swagger
 * /api/itineraries/{id}:
 *   get:
 *     summary: Get one of the user's itineraries
 *     description: Returns a single itinerary (with its items and attractions) belonging to the logged-in user.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The itinerary UUID
 *     responses:
 *       200:
 *         description: Itinerary returned successfully
 *       401:
 *         description: Unauthorised - user not logged in
 *       404:
 *         description: Itinerary not found or not owned by the user
 *       500:
 *         description: Server error
 *   patch:
 *     summary: Update an itinerary
 *     description: Updates the title and/or duration of one of the logged-in user's itineraries.
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
 *             properties:
 *               title:
 *                 type: string
 *                 example: My Beijing Trip
 *               duration_days:
 *                 type: integer
 *                 example: 2
 *     responses:
 *       200:
 *         description: Itinerary updated successfully
 *       400:
 *         description: Invalid request body
 *       401:
 *         description: Unauthorised - user not logged in
 *       404:
 *         description: Itinerary not found or not owned by the user
 *       500:
 *         description: Server error
 *   delete:
 *     summary: Delete an itinerary
 *     description: Deletes one of the logged-in user's itineraries and its items.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The itinerary UUID
 *     responses:
 *       200:
 *         description: Itinerary deleted successfully
 *       401:
 *         description: Unauthorised - user not logged in
 *       404:
 *         description: Itinerary not found or not owned by the user
 *       500:
 *         description: Server error
 */

export async function GET(request, { params }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const { id } = await params
  const { data, error } = await supabase
    .from('itinerary')
    .select('*, itinerary_item(*, attraction(*))')
    .eq('itinerary_id', id)
    .eq('user_id', user.id)
    .maybeSingle()

  if (error) {
    console.error('Failed to fetch itinerary:', error)
    return NextResponse.json({ error: 'Failed to fetch itinerary.' }, { status: 500 })
  }
  if (!data) return NextResponse.json({ error: 'Itinerary not found.' }, { status: 404 })
  return NextResponse.json({ data })
}

export async function PATCH(request, { params }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const { id } = await params
  const body = await request.json().catch(() => null)
  if (!body || typeof body !== 'object') {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 })
  }

  // Whitelist updatable fields — never trust the raw request body
  const updates = {}
  if (body.title !== undefined) {
    const title = typeof body.title === 'string' ? body.title.trim() : ''
    if (!title) return NextResponse.json({ error: 'Title is required.' }, { status: 400 })
    if (title.length > 100) return NextResponse.json({ error: 'Title must be under 100 characters.' }, { status: 400 })
    updates.title = title
  }
  if (body.duration_days !== undefined) {
    if (!Number.isInteger(body.duration_days) || body.duration_days < 1) {
      return NextResponse.json({ error: 'Duration must be at least 1 day.' }, { status: 400 })
    }
    if (body.duration_days > 30) {
      return NextResponse.json({ error: 'Duration cannot exceed 30 days.' }, { status: 400 })
    }
    updates.duration_days = body.duration_days
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: 'No valid fields to update.' }, { status: 400 })
  }

  // Ownership check: only the owner of the itinerary may update it
  let owned
  try {
    owned = await findOwnedItinerary(supabase, user.id, id)
  } catch (error) {
    console.error('Ownership check failed:', error)
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 })
  }
  if (!owned) return NextResponse.json({ error: 'Itinerary not found.' }, { status: 404 })

  const { data, error } = await supabase
    .from('itinerary')
    .update(updates)
    .eq('itinerary_id', id)
    .eq('user_id', user.id)
    .select()
    .single()

  if (error) {
    console.error('Failed to update itinerary:', error)
    return NextResponse.json({ error: 'Failed to update itinerary.' }, { status: 500 })
  }
  return NextResponse.json({ data })
}

export async function DELETE(request, { params }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const { id } = await params

  // Ownership check: only the owner of the itinerary may delete it
  let owned
  try {
    owned = await findOwnedItinerary(supabase, user.id, id)
  } catch (error) {
    console.error('Ownership check failed:', error)
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 })
  }
  if (!owned) return NextResponse.json({ error: 'Itinerary not found.' }, { status: 404 })

  // Delete items first in case the foreign key has no cascade
  const { error: itemError } = await supabase
    .from('itinerary_item')
    .delete()
    .eq('itinerary_id', id)
  if (itemError) {
    console.error('Failed to delete itinerary items:', itemError)
    return NextResponse.json({ error: 'Failed to delete itinerary.' }, { status: 500 })
  }

  const { error } = await supabase
    .from('itinerary')
    .delete()
    .eq('itinerary_id', id)
    .eq('user_id', user.id)

  if (error) {
    console.error('Failed to delete itinerary:', error)
    return NextResponse.json({ error: 'Failed to delete itinerary.' }, { status: 500 })
  }
  return NextResponse.json({ message: 'Deleted' })
}

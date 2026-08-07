import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'
import { validateItineraryItem, validateDayNumber, validateOrderInDay } from '@/lib/validation'
import { findOwnedItinerary } from '@/utils/supabase/ownership'

/**
 * @swagger
 * /api/itineraries/{id}/items:
 *   post:
 *     summary: Add an attraction to an itinerary
 *     description: Adds an attraction to a specific day and position within the authenticated user's itinerary.
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
 *       400:
 *         description: Invalid request body
 *       401:
 *         description: Unauthorised - user not logged in
 *       404:
 *         description: Itinerary not found or not owned by the user
 *       500:
 *         description: Server error
 *   patch:
 *     summary: Update items in an itinerary
 *     description: Updates day_number, order_in_day or time for items of the authenticated user's itinerary.
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
 *               day_number:
 *                 type: integer
 *                 example: 1
 *               order_in_day:
 *                 type: integer
 *                 example: 3
 *               time:
 *                 type: string
 *                 example: 09:00
 *     responses:
 *       200:
 *         description: Items updated successfully
 *       400:
 *         description: Invalid request body
 *       401:
 *         description: Unauthorised - user not logged in
 *       404:
 *         description: Itinerary not found or not owned by the user
 *       500:
 *         description: Server error
 *   delete:
 *     summary: Remove all items from an itinerary
 *     description: Deletes all items belonging to the authenticated user's itinerary.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The itinerary UUID
 *     responses:
 *       200:
 *         description: Items deleted successfully
 *       401:
 *         description: Unauthorised - user not logged in
 *       404:
 *         description: Itinerary not found or not owned by the user
 *       500:
 *         description: Server error
 */

async function getAuthUser(supabase) {
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

export async function POST(request, { params }) {
  const supabase = await createClient()
  const user = await getAuthUser(supabase)
  if (!user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const { id } = await params
  const body = await request.json().catch(() => null)

  const validationError = validateItineraryItem(body)
  if (validationError) {
    return NextResponse.json({ error: validationError.error }, { status: validationError.status })
  }

  // Ownership check: only the owner of the itinerary may add items to it
  let owned
  try {
    owned = await findOwnedItinerary(supabase, user.id, id)
  } catch (error) {
    console.error('Ownership check failed:', error)
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 })
  }
  if (!owned) return NextResponse.json({ error: 'Itinerary not found.' }, { status: 404 })

  const { data, error } = await supabase
    .from('itinerary_item')
    .insert({
      itinerary_id: id,
      attraction_id: body.attraction_id,
      day_number: body.day_number,
      order_in_day: body.order_in_day
    })
    .select()
    .single()

  if (error) {
    console.error('Failed to add itinerary item:', error)
    return NextResponse.json({ error: 'Failed to add attraction to itinerary.' }, { status: 500 })
  }
  return NextResponse.json({ data }, { status: 201 })
}

export async function PATCH(request, { params }) {
  const supabase = await createClient()
  const user = await getAuthUser(supabase)
  if (!user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const { id } = await params
  const body = await request.json().catch(() => null)
  if (!body || typeof body !== 'object') {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 })
  }

  // Whitelist updatable fields — never mass-assign the raw request body
  const updates = {}
  if (body.day_number !== undefined) updates.day_number = body.day_number
  if (body.order_in_day !== undefined) updates.order_in_day = body.order_in_day
  if (body.time !== undefined) updates.time = body.time

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: 'No valid fields to update.' }, { status: 400 })
  }

  if (updates.day_number !== undefined) {
    const err = validateDayNumber(updates.day_number)
    if (err) return NextResponse.json({ error: err.error }, { status: err.status })
  }
  if (updates.order_in_day !== undefined) {
    const err = validateOrderInDay(updates.order_in_day)
    if (err) return NextResponse.json({ error: err.error }, { status: err.status })
  }
  if (updates.time !== undefined && (typeof updates.time !== 'string' || updates.time.length > 20)) {
    return NextResponse.json({ error: 'time must be a short string.' }, { status: 400 })
  }

  // Ownership check: only the owner of the itinerary may modify its items
  let owned
  try {
    owned = await findOwnedItinerary(supabase, user.id, id)
  } catch (error) {
    console.error('Ownership check failed:', error)
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 })
  }
  if (!owned) return NextResponse.json({ error: 'Itinerary not found.' }, { status: 404 })

  const { data, error } = await supabase
    .from('itinerary_item')
    .update(updates)
    .eq('itinerary_id', id)
    .select()

  if (error) {
    console.error('Failed to update itinerary items:', error)
    return NextResponse.json({ error: 'Failed to update itinerary items.' }, { status: 500 })
  }
  return NextResponse.json({ data })
}

export async function DELETE(request, { params }) {
  const supabase = await createClient()
  const user = await getAuthUser(supabase)
  if (!user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const { id } = await params

  // Ownership check: only the owner of the itinerary may delete its items
  let owned
  try {
    owned = await findOwnedItinerary(supabase, user.id, id)
  } catch (error) {
    console.error('Ownership check failed:', error)
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 })
  }
  if (!owned) return NextResponse.json({ error: 'Itinerary not found.' }, { status: 404 })

  const { error } = await supabase
    .from('itinerary_item')
    .delete()
    .eq('itinerary_id', id)

  if (error) {
    console.error('Failed to delete itinerary items:', error)
    return NextResponse.json({ error: 'Failed to delete itinerary items.' }, { status: 500 })
  }
  return NextResponse.json({ message: 'Deleted' })
}

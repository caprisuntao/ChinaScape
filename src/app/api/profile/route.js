import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'
import { validateDisplayName } from '@/lib/validation'

/**
 * @swagger
 * /api/profile:
 *   get:
 *     summary: Get the user's profile
 *     description: Returns the profile row of the logged-in user.
 *     responses:
 *       200:
 *         description: Profile returned successfully
 *       401:
 *         description: Unauthorised - user not logged in
 *       500:
 *         description: Server error
 *   patch:
 *     summary: Update the user's profile
 *     description: Updates the display name of the logged-in user (profile row and auth metadata).
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               display_name:
 *                 type: string
 *                 example: Explorer
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       400:
 *         description: Invalid request body
 *       401:
 *         description: Unauthorised - user not logged in
 *       500:
 *         description: Server error
 */

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const { data, error } = await supabase
    .from('profile')
    .select('user_id, display_name, created_at')
    .eq('user_id', user.id)
    .maybeSingle()

  if (error) {
    console.error('Failed to fetch profile:', error)
    return NextResponse.json({ error: 'Failed to fetch profile.' }, { status: 500 })
  }
  return NextResponse.json({ data })
}

export async function PATCH(request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const body = await request.json().catch(() => null)
  const displayName = typeof body?.display_name === 'string' ? body.display_name.trim() : undefined

  const validationError = validateDisplayName(displayName)
  if (validationError) {
    return NextResponse.json({ error: validationError.error }, { status: validationError.status })
  }

  // Keep auth metadata in sync with the profile row
  const { error: authError } = await supabase.auth.updateUser({
    data: { display_name: displayName }
  })
  if (authError) {
    console.error('Failed to update auth metadata:', authError)
    return NextResponse.json({ error: 'Failed to update profile.' }, { status: 500 })
  }

  // Update the profile row if it exists, otherwise create it
  const { data: existing } = await supabase
    .from('profile')
    .select('user_id')
    .eq('user_id', user.id)
    .maybeSingle()
  if (existing) {
    const { data, error } = await supabase
      .from('profile')
      .update({ display_name: displayName })
      .eq('user_id', user.id)
      .select()
      .single()
    if (error) {
      console.error('Failed to update profile:', error)
      return NextResponse.json({ error: 'Failed to update profile.' }, { status: 500 })
    }
    return NextResponse.json({ data })
  }

  const { data, error } = await supabase
    .from('profile')
    .insert({ user_id: user.id, display_name: displayName })
    .select()
    .single()
  if (error) {
    console.error('Failed to create profile:', error)
    return NextResponse.json({ error: 'Failed to update profile.' }, { status: 500 })
  }
  return NextResponse.json({ data })
}

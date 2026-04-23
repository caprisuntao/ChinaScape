import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'
/**
 * @swagger
 * /api/favourites/{id}:
 *   delete:
 *     summary: Remove a favourite
 *     description: Removes an attraction from the logged-in user's favourites.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The favourite UUID
 *     responses:
 *       200:
 *         description: Favourite removed successfully
 *       401:
 *         description: Unauthorised - user not logged in
 */
export async function DELETE(request, { params }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const { error } = await supabase
    .from('favourite')
    .delete()
    .eq('favourite_id', params.id)
    .eq('user_id', user.id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ message: 'Deleted' })
}
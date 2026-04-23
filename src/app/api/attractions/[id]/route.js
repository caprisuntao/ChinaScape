import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'
/**
 * @swagger
 * /api/attractions/{id}:
 *   get:
 *     summary: Get a single attraction
 *     description: Returns full details of one attraction including city, category and flashcard.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The attraction UUID
 *     responses:
 *       200:
 *         description: Attraction returned successfully
 *       404:
 *         description: Attraction not found
 */
export async function GET(request, { params }) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('attraction')
    .select('*, city(*), category(*), flashcard(*)')
    .eq('attraction_id', params.id)
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 404 })
  return NextResponse.json({ data })
}
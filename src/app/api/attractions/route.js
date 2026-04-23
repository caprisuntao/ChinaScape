import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

/**
 * @swagger
 * /api/attractions:
 *   get:
 *     summary: Get all attractions
 *     description: Returns a list of all attractions. Supports search and category filtering.
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search attractions by name
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by category (e.g. Nature, History, Food)
 *     responses:
 *       200:
 *         description: List of attractions returned successfully
 *       500:
 *         description: Server error
 */

export async function GET(request) {
  const supabase = await createClient()
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
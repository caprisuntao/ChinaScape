/**
 * Ownership helpers for user-scoped resources.
 * Every query against a user-owned table must be constrained to the
 * authenticated user's id — never trust ids from the request alone.
 */

/**
 * Returns the itinerary row only if it belongs to `userId`.
 * Resolves to `null` when the itinerary does not exist or is owned by
 * someone else. Throws on unexpected database errors.
 */
export async function findOwnedItinerary(supabase, userId, itineraryId) {
  const { data, error } = await supabase
    .from('itinerary')
    .select('itinerary_id, title')
    .eq('itinerary_id', itineraryId)
    .eq('user_id', userId)
    .maybeSingle()

  if (error) throw error
  return data
}

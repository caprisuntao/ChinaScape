/**
 * Validates itinerary creation input. Returns an error object or null.
 */
export function validateItinerary(body) {
  if (!body?.title || body.title.trim() === '') {
    return { error: 'Title is required.', status: 400 }
  }
  if (body.title.trim().length > 100) {
    return { error: 'Title must be under 100 characters.', status: 400 }
  }
  if (!body.duration_days || body.duration_days < 1) {
    return { error: 'Duration must be at least 1 day.', status: 400 }
  }
  if (body.duration_days > 30) {
    return { error: 'Duration cannot exceed 30 days.', status: 400 }
  }
  return null
}

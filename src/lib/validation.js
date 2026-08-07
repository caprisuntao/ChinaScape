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

/**
 * Validates itinerary item input (POST /api/itineraries/{id}/items).
 * Returns an error object or null.
 */
export function validateItineraryItem(body) {
  if (!body || typeof body !== 'object') {
    return { error: 'Invalid request body.', status: 400 }
  }
  if (!body.attraction_id || typeof body.attraction_id !== 'string') {
    return { error: 'attraction_id is required.', status: 400 }
  }
  if (!Number.isInteger(body.day_number) || body.day_number < 1) {
    return { error: 'day_number must be a positive integer.', status: 400 }
  }
  if (!Number.isInteger(body.order_in_day) || body.order_in_day < 0) {
    return { error: 'order_in_day must be a non-negative integer.', status: 400 }
  }
  return null
}

/**
 * Validates a day_number for itinerary item updates.
 * Returns an error object or null.
 */
export function validateDayNumber(value) {
  if (!Number.isInteger(value) || value < 1) {
    return { error: 'day_number must be a positive integer.', status: 400 }
  }
  return null
}

/**
 * Validates an order_in_day for itinerary item updates.
 * Returns an error object or null.
 */
export function validateOrderInDay(value) {
  if (!Number.isInteger(value) || value < 0) {
    return { error: 'order_in_day must be a non-negative integer.', status: 400 }
  }
  return null
}

/**
 * Validates a profile display name. Returns an error object or null.
 */
export function validateDisplayName(name) {
  if (typeof name !== 'string' || name.trim() === '') {
    return { error: 'display_name is required.', status: 400 }
  }
  if (name.trim().length > 50) {
    return { error: 'display_name must be under 50 characters.', status: 400 }
  }
  return null
}

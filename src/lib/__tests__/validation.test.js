import { describe, it, expect } from 'vitest'
import { validateItinerary, validateItineraryItem, validateDayNumber, validateOrderInDay, validateDisplayName } from '../validation'

describe('validateItinerary', () => {
  // Valid inputs
  it('returns null for valid input', () => {
    expect(validateItinerary({ title: 'Beijing Trip', duration_days: 3 })).toBeNull()
  })

  it('accepts a single day trip', () => {
    expect(validateItinerary({ title: 'Quick Visit', duration_days: 1 })).toBeNull()
  })

  it('accepts a 30 day trip', () => {
    expect(validateItinerary({ title: 'Grand Tour', duration_days: 30 })).toBeNull()
  })

  // Title validation
  it('rejects missing title', () => {
    const result = validateItinerary({ duration_days: 3 })
    expect(result).toEqual({ error: 'Title is required.', status: 400 })
  })

  it('rejects empty title', () => {
    const result = validateItinerary({ title: '', duration_days: 3 })
    expect(result).toEqual({ error: 'Title is required.', status: 400 })
  })

  it('rejects whitespace-only title', () => {
    const result = validateItinerary({ title: '   ', duration_days: 3 })
    expect(result).toEqual({ error: 'Title is required.', status: 400 })
  })

  it('rejects title over 100 characters', () => {
    const result = validateItinerary({ title: 'A'.repeat(101), duration_days: 3 })
    expect(result).toEqual({ error: 'Title must be under 100 characters.', status: 400 })
  })

  it('accepts title exactly 100 characters', () => {
    expect(validateItinerary({ title: 'A'.repeat(100), duration_days: 3 })).toBeNull()
  })

  // Duration validation
  it('rejects missing duration_days', () => {
    const result = validateItinerary({ title: 'Trip' })
    expect(result).toEqual({ error: 'Duration must be at least 1 day.', status: 400 })
  })

  it('rejects zero duration', () => {
    const result = validateItinerary({ title: 'Trip', duration_days: 0 })
    expect(result).toEqual({ error: 'Duration must be at least 1 day.', status: 400 })
  })

  it('rejects negative duration', () => {
    const result = validateItinerary({ title: 'Trip', duration_days: -1 })
    expect(result).toEqual({ error: 'Duration must be at least 1 day.', status: 400 })
  })

  it('rejects duration over 30 days', () => {
    const result = validateItinerary({ title: 'Trip', duration_days: 31 })
    expect(result).toEqual({ error: 'Duration cannot exceed 30 days.', status: 400 })
  })

  // Edge cases
  it('handles null input', () => {
    const result = validateItinerary(null)
    expect(result).toEqual({ error: 'Title is required.', status: 400 })
  })

  it('handles undefined input', () => {
    const result = validateItinerary(undefined)
    expect(result).toEqual({ error: 'Title is required.', status: 400 })
  })

  it('handles empty object', () => {
    const result = validateItinerary({})
    expect(result).toEqual({ error: 'Title is required.', status: 400 })
  })

  it('trims whitespace from title before length check', () => {
    expect(validateItinerary({ title: '  Beijing  ', duration_days: 3 })).toBeNull()
  })
})

describe('validateItineraryItem', () => {
  it('returns null for valid input', () => {
    expect(validateItineraryItem({ attraction_id: 'abc', day_number: 1, order_in_day: 0 })).toBeNull()
  })

  it('accepts order_in_day 0', () => {
    expect(validateItineraryItem({ attraction_id: 'abc', day_number: 2, order_in_day: 0 })).toBeNull()
  })

  it('rejects missing attraction_id', () => {
    const result = validateItineraryItem({ day_number: 1, order_in_day: 0 })
    expect(result).toEqual({ error: 'attraction_id is required.', status: 400 })
  })

  it('rejects non-integer day_number', () => {
    const result = validateItineraryItem({ attraction_id: 'abc', day_number: 1.5, order_in_day: 0 })
    expect(result).toEqual({ error: 'day_number must be a positive integer.', status: 400 })
  })

  it('rejects day_number below 1', () => {
    const result = validateItineraryItem({ attraction_id: 'abc', day_number: 0, order_in_day: 0 })
    expect(result).toEqual({ error: 'day_number must be a positive integer.', status: 400 })
  })

  it('rejects negative order_in_day', () => {
    const result = validateItineraryItem({ attraction_id: 'abc', day_number: 1, order_in_day: -1 })
    expect(result).toEqual({ error: 'order_in_day must be a non-negative integer.', status: 400 })
  })

  it('rejects non-integer order_in_day', () => {
    const result = validateItineraryItem({ attraction_id: 'abc', day_number: 1, order_in_day: '2' })
    expect(result).toEqual({ error: 'order_in_day must be a non-negative integer.', status: 400 })
  })

  it('rejects null input', () => {
    expect(validateItineraryItem(null)).toEqual({ error: 'Invalid request body.', status: 400 })
  })
})

describe('validateDayNumber', () => {
  it('accepts valid day numbers', () => {
    expect(validateDayNumber(1)).toBeNull()
    expect(validateDayNumber(7)).toBeNull()
  })
  it('rejects invalid day numbers', () => {
    expect(validateDayNumber(0)).toEqual({ error: 'day_number must be a positive integer.', status: 400 })
    expect(validateDayNumber(-2)).toEqual({ error: 'day_number must be a positive integer.', status: 400 })
    expect(validateDayNumber(2.5)).toEqual({ error: 'day_number must be a positive integer.', status: 400 })
  })
})

describe('validateOrderInDay', () => {
  it('accepts valid orders', () => {
    expect(validateOrderInDay(0)).toBeNull()
    expect(validateOrderInDay(3)).toBeNull()
  })
  it('rejects invalid orders', () => {
    expect(validateOrderInDay(-1)).toEqual({ error: 'order_in_day must be a non-negative integer.', status: 400 })
    expect(validateOrderInDay(1.5)).toEqual({ error: 'order_in_day must be a non-negative integer.', status: 400 })
  })
})

describe('validateDisplayName', () => {
  it('returns null for valid name', () => {
    expect(validateDisplayName('Alice')).toBeNull()
  })
  it('accepts exactly 50 characters', () => {
    expect(validateDisplayName('A'.repeat(50))).toBeNull()
  })
  it('rejects empty or missing name', () => {
    expect(validateDisplayName('')).toEqual({ error: 'display_name is required.', status: 400 })
    expect(validateDisplayName('   ')).toEqual({ error: 'display_name is required.', status: 400 })
    expect(validateDisplayName(undefined)).toEqual({ error: 'display_name is required.', status: 400 })
  })
  it('rejects names over 50 characters', () => {
    expect(validateDisplayName('A'.repeat(51))).toEqual({ error: 'display_name must be under 50 characters.', status: 400 })
  })
})

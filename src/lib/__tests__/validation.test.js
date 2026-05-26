import { describe, it, expect } from 'vitest'
import { validateItinerary } from '../validation'

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

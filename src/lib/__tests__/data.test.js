import { describe, it, expect } from 'vitest'
import { attractionsData } from '../data'

const VALID_CATEGORIES = ['Historical', 'Wildlife', 'Nature']

describe('attractionsData', () => {
  it('contains at least one attraction', () => {
    expect(attractionsData.length).toBeGreaterThan(0)
  })

  it('every attraction has all required fields', () => {
    const required = ['id', 'name', 'cn', 'cat', 'hrs', 'addr', 'img', 'nearby', 'nbTxt', 'desc']

    for (const a of attractionsData) {
      for (const field of required) {
        expect(a).toHaveProperty(field)
        expect(a[field] != null && a[field] !== '').toBe(true)
      }
    }
  })

  it('every attraction has a valid category', () => {
    for (const a of attractionsData) {
      expect(VALID_CATEGORIES).toContain(a.cat)
    }
  })

  it('has no duplicate ids', () => {
    const ids = attractionsData.map((a) => a.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('every img and nearby URL uses HTTPS', () => {
    for (const a of attractionsData) {
      expect(a.img).toMatch(/^https:\/\//)
      expect(a.nearby).toMatch(/^https:\/\//)
    }
  })

  it('every cn field contains Chinese characters', () => {
    for (const a of attractionsData) {
      expect(a.cn).toMatch(/[一-鿿]/)
    }
  })

  it('opening hours contain AM or PM or "Open 24 hours"', () => {
    for (const a of attractionsData) {
      expect(a.hrs).toMatch(/(AM|PM|Open 24 hours)/)
    }
  })

  it('desc field is at least 40 characters', () => {
    for (const a of attractionsData) {
      expect(a.desc.length).toBeGreaterThanOrEqual(40)
    }
  })
})

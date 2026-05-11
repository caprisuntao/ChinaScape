'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

export default function AttractionsPage() {
  const supabase = createClient()
  const searchParams = useSearchParams()
  const initialQuery = searchParams.get('query') || '' // Get term from URL
  const [attractions, setAttractions] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState('All')
  const [search, setSearch] = useState(initialQuery)

  useEffect(() => {
    setSearch(initialQuery)
    fetchCategories()
    fetchAttractions('All', initialQuery)
  }, [initialQuery])

  async function fetchCategories() {
    const { data } = await supabase.from('category').select('*')
    setCategories(data || [])
  }

  async function fetchAttractions(categoryFilter = null, searchFilter = '') {
    setLoading(true)
    let query = supabase
      .from('attraction')
      .select('*, city(*), category!inner(*)')

    if (searchFilter) query = query.or(`name_en.ilike.%${searchFilter}%,name_zh.ilike.%${searchFilter}%`)
    if (categoryFilter && categoryFilter !== 'All') {
      query = query.eq('category.name', categoryFilter)
    }

    const { data } = await query
    setAttractions(data || [])
    setLoading(false)
  }

  function handleCategoryClick(cat) {
    setActiveCategory(cat)
    fetchAttractions(cat, search)
  }

  function handleSearch(e) {
    e.preventDefault()
    fetchAttractions(activeCategory, search)
  }

  return (
    <div className="attractions-page">
      {/* Search bar */}
      <form onSubmit={handleSearch} style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
        <input
          type="text"
          placeholder="Search attractions..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ flex: 1, padding: '10px 16px', border: '1px solid #E8E0D4', borderRadius: 24, fontSize: 14, outline: 'none', fontFamily: 'inherit' }}
        />
        <button
          type="submit"
          style={{ background: '#B5271A', color: '#fff', border: 'none', borderRadius: 24, padding: '10px 24px', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}
        >
          Search
        </button>
      </form>

      {/* Category filter chips */}
      <div className="filter-bar">
        {['All', ...categories.map(c => c.name)].map(cat => (
          <button
            key={cat}
            className={`filter-chip ${activeCategory === cat ? 'active' : ''}`}
            onClick={() => handleCategoryClick(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Results count */}
      <p style={{ fontSize: 13, color: '#7A6A58', marginBottom: 16 }}>
        {loading ? 'Loading...' : `${attractions.length} attraction${attractions.length !== 1 ? 's' : ''} found`}
      </p>

      {/* Attractions grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: '#7A6A58' }}>Loading attractions...</div>
      ) : attractions.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: '#7A6A58' }}>
          No attractions found. Try a different search or category.
        </div>
      ) : (
        <div className="attractions-grid">
          {attractions.map(attraction => (
            <Link key={attraction.attraction_id} href={`/attractions/${attraction.attraction_id}`} className="acard">
              <div className="acard-img">
                <img
                  src={attraction.image_url || 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=400'}
                  alt={attraction.name_en}
                  onError={e => e.target.src = 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=400'}
                />
              </div>
              <div className="acard-body">
                <div className="acard-name">{attraction.name_en}</div>
                <div className="acard-name" style={{ fontSize: 12, color: '#7A6A58', fontWeight: 400 }}>{attraction.name_zh}</div>
                <div className="acard-loc">📍 {attraction.city?.name_en}</div>
                <div style={{ display: 'flex', gap: 6, marginTop: 7, flexWrap: 'wrap' }}>
                  <span className="acard-tag">{attraction.category?.name}</span>
                  {attraction.entrance_fee === 0
                    ? <span className="acard-tag" style={{ background: '#EDFDF4', color: '#1A6B2E' }}>Free</span>
                    : <span className="acard-tag" style={{ background: '#FEF9E7', color: '#7B6000' }}>¥{attraction.entrance_fee}</span>
                  }
                  {attraction.passport_required && (
                    <span className="acard-tag" style={{ background: '#F2EDE4', color: '#3D2E1E' }}>ID Required</span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
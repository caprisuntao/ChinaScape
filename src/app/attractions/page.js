'use client'
import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import Link from 'next/link'

const PAGE_SIZE = 8
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes in milliseconds

function getCacheKey(category, search, page) {
  return `chinascape_attractions_${category}_${search}_${page}`
}

function getCachedData(key) {
  try {
    const cached = sessionStorage.getItem(key)
    if (!cached) return null
    const { data, count, timestamp } = JSON.parse(cached)
    if (Date.now() - timestamp > CACHE_DURATION) {
      sessionStorage.removeItem(key)
      return null
    }
    return { data, count }
  } catch {
    return null
  }
}

function setCachedData(key, data, count) {
  try {
    sessionStorage.setItem(key, JSON.stringify({ data, count, timestamp: Date.now() }))
  } catch {
    // silently fail
  }
}

function AttractionsContent() {
  const supabase = createClient()
  const searchParams = useSearchParams()
  const initialQuery = searchParams.get('query') || ''
  const [cacheStatus, setCacheStatus] = useState('') 
  const [attractions, setAttractions] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState('All')
  const [search, setSearch] = useState(initialQuery)
  
  // --- Pagination State ---
  const [currentPage, setCurrentPage] = useState(1)
  const [totalCount, setTotalCount] = useState(0)

  useEffect(() => {
    setSearch(initialQuery)
    fetchCategories()
    // Reset to page 1 when a new search comes from the top bar
    setCurrentPage(1)
    fetchAttractions('All', initialQuery, 1)
  }, [initialQuery])

  async function fetchCategories() {
    const CATEGORY_KEY = 'chinascape_categories'
    const cachedCategories = getCachedData(CATEGORY_KEY)
    if (cachedCategories) {
      setCategories(cachedCategories.data || [])
      return
    }
    const { data } = await supabase.from('category').select('*')
    setCategories(data || [])
  }

  async function fetchAttractions(categoryFilter = activeCategory, searchFilter = search, page = 1) {
    setLoading(true)

    // Check cache first
    const cacheKey = getCacheKey(categoryFilter, searchFilter, page)
    const cached = getCachedData(cacheKey)
    if (cached) {
      setAttractions(cached.data || [])
      setTotalCount(cached.count || 0)
      setLoading(false)
      setCacheStatus('served from cache')
      return
    }
    
    // Calculate range for Supabase
    const from = (page - 1) * PAGE_SIZE
    const to = from + PAGE_SIZE - 1

    // Added { count: 'exact' } to get total number of results for pagination
    let query = supabase
      .from('attraction')
      .select('*, city(*), category!inner(*)', { count: 'exact' }) 

    if (searchFilter) {
      query = query.or(`name_en.ilike.%${searchFilter}%,name_zh.ilike.%${searchFilter}%,address_en.ilike.%${searchFilter}%,address_zh.ilike.%${searchFilter}%`)
    }
    
    if (categoryFilter && categoryFilter !== 'All') {
      query = query.eq('category.name', categoryFilter)
    }

    // Apply the range (pagination)
    const { data, count, error } = await query
      .order('name_en', { ascending: true }) // Good practice to order when paginating
      .range(from, to)

    if (!error) {
      setAttractions(data || [])
      setTotalCount(count || 0)
      setCachedData(cacheKey, data || [], count || 0) // save to cache
      setCacheStatus('fetched from database')
    }
    setLoading(false)
  }

  // Handle category changes
  function handleCategoryClick(cat) {
    setActiveCategory(cat)
    setCurrentPage(1) // Always reset to page 1 on new filter
    fetchAttractions(cat, search, 1)
  }

  // Handle manual search
  function handleSearch(e) {
    e.preventDefault()
    setCurrentPage(1) // Always reset to page 1 on new search
    fetchAttractions(activeCategory, search, 1)
  }

  // Handle page changes
  function handlePageChange(newPage) {
    setCurrentPage(newPage)
    fetchAttractions(activeCategory, search, newPage)
    window.scrollTo({ top: 0, behavior: 'smooth' }) // Scroll up to see new results
  }

  const totalPages = Math.ceil(totalCount / PAGE_SIZE)

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
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <p style={{ fontSize: 13, color: '#7A6A58' }}>
          {loading ? 'Loading...' : `${totalCount} attraction${totalCount !== 1 ? 's' : ''} found`}
        </p>
        {/* Cache status indicator — remove before final submission */}
        {cacheStatus && (
          <p style={{ fontSize: 11, color: '#7A6A58', fontStyle: 'italic' }}>⚡ {cacheStatus}</p>
        )}
      </div>

      {/* Attractions grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: '#7A6A58' }}>Loading attractions...</div>
      ) : attractions.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: '#7A6A58' }}>
          No attractions found. Try a different search or category.
        </div>
      ) : (
        <>
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
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* --- Pagination Controls --- */}
          {totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 15, marginTop: 40, paddingBottom: 40 }}>
              <button 
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
                style={{ 
                   padding: '8px 16px', borderRadius: 20, border: '1px solid #E8E0D4', 
                   background: currentPage === 1 ? '#F5F5F5' : '#FFF',
                   cursor: currentPage === 1 ? 'not-allowed' : 'pointer' 
                }}
              >
                Previous
              </button>

              <span style={{ fontSize: 14, color: '#7A6A58' }}>
                Page <strong>{currentPage}</strong> of {totalPages}
              </span>

              <button 
                disabled={currentPage === totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
                style={{ 
                   padding: '8px 16px', borderRadius: 20, border: '1px solid #E8E0D4', 
                   background: currentPage === totalPages ? '#F5F5F5' : '#FFF',
                   cursor: currentPage === totalPages ? 'not-allowed' : 'pointer' 
                }}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default function AttractionsPage() {
  return (
    <Suspense fallback={<div style={{ textAlign: 'center', padding: '60px 0', color: '#7A6A58' }}>Loading page data...</div>}>
      <AttractionsContent />
    </Suspense>
  )
}
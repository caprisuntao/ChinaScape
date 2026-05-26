'use client'
import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import Link from 'next/link'
import Image from 'next/image'

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
      <form onSubmit={handleSearch} className="attr-search-form">
        <input
          type="text"
          placeholder="Search attractions..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="attr-search-input"
        />
        <button type="submit" className="attr-search-btn">Search</button>
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
      <div className="attr-meta-bar">
        <p className="attr-meta-text">
          {loading ? 'Loading...' : `${totalCount} attraction${totalCount !== 1 ? 's' : ''} found`}
        </p>
        {cacheStatus && <p className="cache-status">⚡ {cacheStatus}</p>}
      </div>

      {/* Attractions grid */}
      {loading ? (
        <div className="empty-state">Loading attractions...</div>
      ) : attractions.length === 0 ? (
        <div className="empty-state">
          No attractions found. Try a different search or category.
        </div>
      ) : (
        <>
          <div className="attractions-grid">
            {attractions.map(attraction => (
              <Link key={attraction.attraction_id} href={`/attractions/${attraction.attraction_id}`} className="acard">
                <div className="acard-img">
                  <Image
                    src={attraction.image_url || 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=400'}
                    alt={attraction.name_en}
                    width={400}
                    height={300}
                    unoptimized
                    onError={e => e.target.src = 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=400'}
                  />
                </div>
                <div className="acard-body">
                  <div className="acard-name">{attraction.name_en}</div>
                  <div className="attr-card-zh">{attraction.name_zh}</div>
                  <div className="acard-loc">📍 {attraction.city?.name_en}</div>
                  <div className="attr-card-tags">
                    <span className="acard-tag">{attraction.category?.name}</span>
                    {attraction.entrance_fee === 0
                      ? <span className={`acard-tag attr-card-free`}>Free</span>
                      : <span className={`acard-tag attr-card-fee`}>¥{attraction.entrance_fee}</span>
                    }
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* --- Pagination Controls --- */}
          {totalPages > 1 && (
            <div className="pagination" style={{ paddingBottom: 40 }}>
              <button
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
                className="pagination-btn-round"
              >
                Previous
              </button>
              <span className="pagination-info">
                Page <strong>{currentPage}</strong> of {totalPages}
              </span>
              <button
                disabled={currentPage === totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
                className="pagination-btn-round"
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
    <Suspense fallback={<div className="empty-state">Loading page data...</div>}>
      <AttractionsContent />
    </Suspense>
  )
}
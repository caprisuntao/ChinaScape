'use client'
import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import Link from 'next/link'
import Image from 'next/image'
import Reveal from '@/components/Reveal'

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
    async function syncFromQuery() {
      setSearch(initialQuery)
      setCurrentPage(1)

      const CATEGORY_KEY = 'chinascape_categories'
      const cachedCategories = getCachedData(CATEGORY_KEY)
      if (cachedCategories) {
        setCategories(cachedCategories.data || [])
      } else {
        const { data } = await supabase.from('category').select('*')
        setCategories(data || [])
      }

      fetchAttractions('All', initialQuery, 1)
    }
    syncFromQuery()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialQuery])

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
    <>
      {/* Hero band */}
      <section className="bg-red">
        <div className="max-w-[1200px] mx-auto px-4 md:px-[60px] py-8 md:py-10">
          <h1 className="font-display text-[26px] md:text-[32px] font-bold text-white">Explore Attractions</h1>
          <p className="mt-2 text-sm text-white/75">Search and filter China&rsquo;s most iconic sights.</p>
        </div>
      </section>

      <div className="max-w-[1200px] mx-auto px-4 md:px-[60px] py-5 md:py-[32px]">
      {/* Search bar */}
      <form onSubmit={handleSearch} className="flex gap-[10px] mb-5">
        <input
          type="text"
          placeholder="Search attractions..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1 px-4 py-[10px] border border-paper-dkr rounded-full text-sm outline-none focus:border-red transition-colors"
        />
        <button type="submit" className="bg-red text-white rounded-full px-6 py-[10px] text-sm font-semibold cursor-pointer hover:bg-red-dk transition-colors">Search</button>
      </form>

      {/* Category filter chips */}
      <div className="flex gap-[10px] mb-[28px] flex-wrap">
        {['All', ...categories.map(c => c.name)].map(cat => (
          <button
            key={cat}
            className={`px-[18px] py-[7px] rounded-full text-[13px] font-medium border cursor-pointer transition-all duration-200 ${
              activeCategory === cat ? 'bg-red text-white border-red' : 'bg-white text-ink-md border-paper-dkr hover:border-red hover:text-red'
            }`}
            onClick={() => handleCategoryClick(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Results count */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-[13px] text-ink-lt">
          {loading ? 'Loading...' : `${totalCount} attraction${totalCount !== 1 ? 's' : ''} found`}
        </p>
        {cacheStatus && <p className="text-[11px] text-ink-lt italic">{cacheStatus}</p>}
      </div>

      {/* Attractions grid */}
      {loading ? (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-5 w-full">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-white border border-paper-dkr rounded-card overflow-hidden">
              <div className="w-full h-[140px] bg-paper-dk animate-pulse" />
              <div className="px-3.5 py-3 space-y-2">
                <div className="h-3.5 w-2/3 bg-paper-dk rounded animate-pulse" />
                <div className="h-3 w-1/2 bg-paper-dk rounded animate-pulse" />
                <div className="h-5 w-1/3 bg-paper-dk rounded-full animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      ) : attractions.length === 0 ? (
        <div className="text-center py-[60px] text-ink-lt">
          No attractions found. Try a different search or category.
        </div>
      ) : (
        <>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-5 w-full">
            {attractions.map((attraction, i) => (
              <Reveal key={attraction.attraction_id} delay={Math.min(i, 7) * 50}>
                <Link href={`/attractions/${attraction.attraction_id}`} className="block bg-white border border-paper-dkr rounded-card overflow-hidden cursor-pointer transition-all duration-200 hover:border-red hover:-translate-y-[3px] hover:shadow-card group">
                <div className="w-full h-[140px] overflow-hidden">
                  <Image
                    src={attraction.image_url || 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=400'}
                    alt={attraction.name_en}
                    width={400}
                    height={300}
                    unoptimized
                    onError={e => e.target.src = 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=400'}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="px-3.5 py-3">
                  <div className="text-sm font-semibold text-ink">{attraction.name_en}</div>
                  <div className="text-xs text-ink-lt font-normal">{attraction.name_zh}</div>
                  <div className="text-xs text-ink-lt mt-[3px]">{attraction.city?.name_en}</div>
                  <div className="flex gap-1.5 mt-[7px] flex-wrap">
                    <span className="inline-block text-[11px] px-2.5 py-[2px] rounded-[10px] font-medium bg-red-xlt text-red-dk">{attraction.category?.name}</span>
                    {attraction.entrance_fee === 0
                      ? <span className="inline-block text-[11px] px-2.5 py-[2px] rounded-[10px] font-medium bg-green-lt text-green-dk">Free</span>
                      : <span className="inline-block text-[11px] px-2.5 py-[2px] rounded-[10px] font-medium bg-gold-lt text-gold-dk">¥{attraction.entrance_fee}</span>
                    }
                  </div>
                </div>
                </Link>
              </Reveal>
            ))}
          </div>

          {/* --- Pagination Controls --- */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-10 pb-10">
              <button
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
                className="px-4 py-2 rounded-full border border-paper-dkr bg-white text-ink-md cursor-pointer text-sm font-semibold hover:border-red hover:text-red transition-colors disabled:bg-disabled-bg disabled:text-disabled-text disabled:cursor-not-allowed"
              >
                ← Prev
              </button>
              {Array.from({ length: totalPages }, (_, idx) => {
                const pageNum = idx + 1
                const isActive = currentPage === pageNum
                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`w-9 h-9 rounded-full border cursor-pointer text-sm font-semibold flex items-center justify-center transition-colors ${isActive ? 'bg-red text-white border-red' : 'bg-white text-ink-md border-paper-dkr hover:border-red hover:text-red'}`}
                  >
                    {pageNum}
                  </button>
                )
              })}
              <button
                disabled={currentPage === totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
                className="px-4 py-2 rounded-full border border-paper-dkr bg-white text-ink-md cursor-pointer text-sm font-semibold hover:border-red hover:text-red transition-colors disabled:bg-disabled-bg disabled:text-disabled-text disabled:cursor-not-allowed"
              >
                Next →
              </button>
            </div>
          )}
        </>
      )}
      </div>
    </>
  )
}

export default function AttractionsPage() {
  return (
    <Suspense fallback={<div className="text-center py-[60px] text-ink-lt">Loading page data...</div>}>
      <AttractionsContent />
    </Suspense>
  )
}

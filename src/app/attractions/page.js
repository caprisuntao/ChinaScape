'use client'
import { useState, useEffect, Suspense, useCallback } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
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

/** Windowed page list with ellipsis, e.g. [1, '…', 4, 5, 6, '…', 13] */
function getPageList(current, total) {
  const nums = new Set([1, total])
  for (let p = current - 2; p <= current + 2; p++) {
    if (p >= 1 && p <= total) nums.add(p)
  }
  const sorted = [...nums].sort((a, b) => a - b)
  const out = []
  let prev = 0
  for (const n of sorted) {
    if (n - prev > 1) out.push('…')
    out.push(n)
    prev = n
  }
  return out
}

function AttractionsContent() {
  const supabase = createClient()
  const searchParams = useSearchParams()
  const router = useRouter()

  // Search / filter / page state is derived from the URL so results are
  // shareable and survive refresh and Back/Forward navigation.
  const query = searchParams.get('query') || ''
  const activeCategory = searchParams.get('category') || 'All'
  const currentPage = Math.max(1, parseInt(searchParams.get('page') || '1', 10) || 1)

  const [searchInput, setSearchInput] = useState(query)
  const [attractions, setAttractions] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [totalCount, setTotalCount] = useState(0)

  // Keep the input box in sync when the URL changes (e.g. Back/Forward)
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSearchInput(query)
  }, [query])

  // Load categories once (cached for the session)
  useEffect(() => {
    async function loadCategories() {
      const CATEGORY_KEY = 'chinascape_categories'
      const cached = getCachedData(CATEGORY_KEY)
      if (cached) {
        setCategories(cached.data || [])
        return
      }
      const { data } = await supabase.from('category').select('*')
      setCategories(data || [])
    }
    loadCategories()
  }, [supabase])

  const fetchAttractions = useCallback(async (categoryFilter, searchFilter, page) => {
    setLoading(true)

    // Check cache first
    const cacheKey = getCacheKey(categoryFilter, searchFilter, page)
    const cached = getCachedData(cacheKey)
    if (cached) {
      setAttractions(cached.data || [])
      setTotalCount(cached.count || 0)
      setLoading(false)
      return
    }

    // Calculate range for Supabase
    const from = (page - 1) * PAGE_SIZE
    const to = from + PAGE_SIZE - 1

    // { count: 'exact' } gives the total result count for pagination
    let query = supabase
      .from('attraction')
      .select('*, city(*), category!inner(*)', { count: 'exact' })

    if (searchFilter) {
      query = query.or(`name_en.ilike.%${searchFilter}%,name_zh.ilike.%${searchFilter}%,address_en.ilike.%${searchFilter}%,address_zh.ilike.%${searchFilter}%`)
    }

    if (categoryFilter && categoryFilter !== 'All') {
      query = query.eq('category.name', categoryFilter)
    }

    const { data, count, error } = await query
      .order('name_en', { ascending: true }) // Ordering is required for stable pagination
      .range(from, to)

    if (!error) {
      setAttractions(data || [])
      setTotalCount(count || 0)
      setCachedData(cacheKey, data || [], count || 0)
    }
    setLoading(false)
  }, [supabase])

  useEffect(() => {
    // Loading state is set synchronously on URL change on purpose
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchAttractions(activeCategory, query, currentPage)
  }, [activeCategory, query, currentPage, fetchAttractions])

  // Write state to the URL (empty params collapse to /attractions)
  function navigate({ query: q, category: cat, page }) {
    const sp = new URLSearchParams()
    if (q) sp.set('query', q)
    if (cat && cat !== 'All') sp.set('category', cat)
    if (page > 1) sp.set('page', String(page))
    const qs = sp.toString()
    router.replace(qs ? `/attractions?${qs}` : '/attractions')
  }

  function handleCategoryClick(cat) {
    navigate({ query, category: cat, page: 1 }) // Always reset to page 1 on new filter
  }

  function handleSearch(e) {
    e.preventDefault()
    navigate({ query: searchInput.trim(), category: activeCategory, page: 1 })
  }

  function handlePageChange(newPage) {
    navigate({ query, category: activeCategory, page: newPage })
    window.scrollTo({ top: 0, behavior: 'smooth' }) // Scroll up to see new results
  }

  function handleClearFilters() {
    setSearchInput('')
    navigate({ query: '', category: 'All', page: 1 })
  }

  const totalPages = Math.ceil(totalCount / PAGE_SIZE)
  const pageList = getPageList(currentPage, totalPages)
  const hasFilters = Boolean(query) || activeCategory !== 'All'

  return (
    <>
      {/* Hero band */}
      <section className="bg-red">
        <div className="max-w-[1200px] mx-auto px-4 md:px-12 py-12 md:py-14">
          <h1 className="font-display text-page-title md:text-hero font-bold text-white">Explore Attractions</h1>
          <p className="mt-2 text-sm text-white/85">Search and filter China&rsquo;s most iconic sights.</p>
        </div>
      </section>

      <div className="max-w-[1200px] mx-auto px-4 md:px-12 py-5 md:py-8">
      {/* Search bar */}
      <form onSubmit={handleSearch} role="search" className="flex gap-2 mb-5">
        <input
          type="text"
          placeholder="Search attractions..."
          aria-label="Search attractions"
          value={searchInput}
          onChange={e => setSearchInput(e.target.value)}
          className="flex-1 min-w-0 px-4 py-2 border border-paper-dkr rounded-full text-sm outline-none focus:border-red focus-visible:ring-2 focus-visible:ring-red/40 transition-colors"
        />
        <button type="submit" className="bg-red text-white rounded-full px-6 py-2 text-sm font-semibold cursor-pointer hover:bg-red-dk transition-colors">Search</button>
      </form>

      {/* Category filter chips */}
      <div className="flex gap-2 mb-6 flex-wrap" role="group" aria-label="Filter by category">
        {['All', ...categories.map(c => c.name)].map(cat => (
          <button
            key={cat}
            className={`px-4 py-2 rounded-full text-[13px] font-medium border cursor-pointer transition-all duration-200 focus-visible:ring-2 focus-visible:ring-red/40 ${
              activeCategory === cat ? 'bg-red text-white border-red' : 'bg-white text-ink-md border-paper-dkr hover:border-red hover:text-red'
            }`}
            onClick={() => handleCategoryClick(cat)}
            aria-pressed={activeCategory === cat}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Results count */}
      <div className="flex items-center justify-between mb-4">
        <p role="status" aria-live="polite" className="text-[13px] text-ink-lt">
          {loading ? 'Loading...' : `${totalCount} attraction${totalCount !== 1 ? 's' : ''} found`}
        </p>
      </div>

      {/* Attractions grid */}
      {loading ? (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-5 w-full">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-white border border-paper-dkr rounded-card overflow-hidden">
              <div className="w-full h-[140px] bg-paper-dk animate-pulse" />
              <div className="px-4 py-3 space-y-2">
                <div className="h-3.5 w-2/3 bg-paper-dk rounded animate-pulse" />
                <div className="h-3 w-1/2 bg-paper-dk rounded animate-pulse" />
                <div className="h-5 w-1/3 bg-paper-dk rounded-full animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      ) : attractions.length === 0 ? (
        <div className="text-center py-16 text-ink-lt">
          <p>
            No attractions match{' '}
            {query ? (
              <>your search for <span className="font-semibold text-ink-md">&ldquo;{query}&rdquo;</span></>
            ) : activeCategory !== 'All' ? (
              <>the <span className="font-semibold text-ink-md">{activeCategory}</span> category</>
            ) : (
              'your criteria'
            )}
            . Try a different search or category.
          </p>
          {hasFilters && (
            <button
              onClick={handleClearFilters}
              className="mt-4 inline-flex items-center bg-red text-white rounded-full px-6 py-2 text-sm font-semibold cursor-pointer hover:bg-red-dk transition-colors"
            >
              Clear filters
            </button>
          )}
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
                    alt=""
                    width={400}
                    height={300}
                    unoptimized
                    onError={e => e.target.src = 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=400'}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="px-4 py-3">
                  <div className="text-sm font-semibold text-ink">{attraction.name_en}</div>
                  <div className="text-xs text-ink-lt font-normal">{attraction.name_zh}</div>
                  <div className="text-xs text-ink-lt mt-1">{attraction.city?.name_en}</div>
                  <div className="flex gap-1.5 mt-2 flex-wrap">
                    <span className="inline-block text-[11px] px-2 py-0.5 rounded-full font-medium bg-red-xlt text-red-dk">{attraction.category?.name}</span>
                    {attraction.entrance_fee === 0
                      ? <span className="inline-block text-[11px] px-2 py-0.5 rounded-full font-medium bg-green-lt text-green-dk">Free</span>
                      : <span className="inline-block text-[11px] px-2 py-0.5 rounded-full font-medium bg-gold-lt text-gold-dk">¥{attraction.entrance_fee}</span>
                    }
                  </div>
                </div>
                </Link>
              </Reveal>
            ))}
          </div>

          {/* --- Pagination Controls --- */}
          {totalPages > 1 && (
            <nav aria-label="Pagination" className="flex justify-center items-center gap-2 mt-10 pb-10">
              <button
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
                aria-label="Previous page"
                className="px-4 py-2 rounded-full border border-paper-dkr bg-white text-ink-md cursor-pointer text-sm font-semibold hover:border-red hover:text-red transition-colors disabled:bg-disabled-bg disabled:text-disabled-text disabled:cursor-not-allowed"
              >
                ← Prev
              </button>
              {pageList.map((item, idx) =>
                item === '…' ? (
                  <span key={`ellipsis-${idx}`} aria-hidden="true" className="px-1 text-ink-lt">…</span>
                ) : (
                  <button
                    key={item}
                    onClick={() => handlePageChange(item)}
                    aria-label={`Go to page ${item}`}
                    aria-current={item === currentPage ? 'page' : undefined}
                    className={`w-9 h-9 rounded-full border cursor-pointer text-sm font-semibold flex items-center justify-center transition-colors focus-visible:ring-2 focus-visible:ring-red/40 ${item === currentPage ? 'bg-red text-white border-red' : 'bg-white text-ink-md border-paper-dkr hover:border-red hover:text-red'}`}
                  >
                    {item}
                  </button>
                )
              )}
              <button
                disabled={currentPage === totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
                aria-label="Next page"
                className="px-4 py-2 rounded-full border border-paper-dkr bg-white text-ink-md cursor-pointer text-sm font-semibold hover:border-red hover:text-red transition-colors disabled:bg-disabled-bg disabled:text-disabled-text disabled:cursor-not-allowed"
              >
                Next →
              </button>
            </nav>
          )}
        </>
      )}
      </div>
    </>
  )
}

export default function AttractionsPage() {
  return (
    <Suspense fallback={<div role="status" className="text-center py-16 text-ink-lt">Loading page data...</div>}>
      <AttractionsContent />
    </Suspense>
  )
}

'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import Link from 'next/link'
import Image from 'next/image'
import Reveal from '@/components/Reveal'

// Cache the featured attractions in the browser for 5 minutes
const CACHE_KEY = 'chinascape_featured_attractions'
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes in milliseconds

function getCachedData() {
  try {
    const cached = sessionStorage.getItem(CACHE_KEY)
    if (!cached) return null

    const { data, timestamp } = JSON.parse(cached)
    const isExpired = Date.now() - timestamp > CACHE_DURATION

    if (isExpired) {
      sessionStorage.removeItem(CACHE_KEY)
      return null
    }

    return data
  } catch {
    return null
  }
}

function setCachedData(data) {
  try {
    sessionStorage.setItem(CACHE_KEY, JSON.stringify({
      data,
      timestamp: Date.now()
    }))
  } catch {
    // silently fail if sessionStorage is unavailable
  }
}

const FALLBACK_IMG = 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=600&q=75'

const CITIES = ['Beijing', 'Shanghai', "Xi'an", 'Guilin', 'Chengdu']

const DESTINATIONS = [
  { name: 'Beijing', cn: '北京', tag: 'The Great Wall', img: 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=600&q=75' },
  { name: 'Shanghai', cn: '上海', tag: 'The Bund skyline', img: 'https://images.unsplash.com/photo-1548919973-5cef591cdbc9?w=600&q=75' },
  { name: "Xi'an", cn: '西安', tag: 'Terracotta Warriors', img: 'https://images.unsplash.com/photo-1590392751596-8bfc4bcd9df8?w=600&q=75' },
  { name: 'Chengdu', cn: '成都', tag: 'Pandas & hot pot', img: 'https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?w=600&q=75' },
  { name: 'Guilin', cn: '桂林', tag: 'Karst peaks', img: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=600&q=75' },
]

export default function Home() {
  const supabase = createClient()
  const [featured, setFeatured] = useState([])
  const [loading, setLoading] = useState(true)


  useEffect(() => {
    async function loadFeatured() {
      setLoading(true)

      const cached = getCachedData()
      if (cached) {
        setFeatured(cached)
        setLoading(false)
        return
      }

      const { data, error } = await supabase
        .from('attraction')
        .select('*, city(name_en), category(name)')
        .limit(6)

      if (!error) {
        setFeatured(data || [])
        setCachedData(data || [])
      }
      setLoading(false)
    }
    loadFeatured()
  }, [supabase])

  return (
    <>
      {/* ── HERO ── */}
      <section className="bg-red">

        <div className="relative max-w-[1200px] mx-auto px-5 md:px-[60px] py-14 md:py-16 flex flex-col md:flex-row items-center gap-12 md:gap-[64px]">
          {/* Text */}
          <div className="flex-1 text-white text-center md:text-left">
            <h1 className="font-display text-[36px] md:text-[54px] font-bold leading-[1.08] tracking-[-1.5px]">
              <span className="block animate-fade-up">Discover China,</span>
              <span className="block animate-fade-up text-gold-lt [animation-delay:140ms]">Your Way</span>
            </h1>
            <p className="mt-5 text-[15px] md:text-base text-white/80 leading-relaxed max-w-[440px] mx-auto md:mx-0 animate-fade-up [animation-delay:280ms]">
              From the Great Wall to misty karst mountains — plan your perfect journey through China&rsquo;s most iconic destinations.
            </p>

            <div className="flex gap-3 mt-6 flex-wrap justify-center md:justify-start animate-fade-up [animation-delay:420ms]">
              {CITIES.map(city => (
                <span
                  key={city}
                  className="px-4 py-2 rounded-full text-xs font-medium bg-white/10 border border-white/25 text-white cursor-pointer transition-colors duration-200 hover:bg-white/20"
                >
                  {city}
                </span>
              ))}
            </div>

            <div className="mt-8 animate-fade-up [animation-delay:560ms]">
              <Link
                href="/itinerary"
                className="group inline-flex items-center gap-2 bg-white text-red font-semibold rounded-full px-7 py-3.5 text-sm shadow-lg hover:shadow-xl hover:-translate-y-0.5 hover:bg-gold-lt transition-all duration-300"
              >
                Start planning your trip
                <span className="transition-transform duration-300 group-hover:translate-x-1" aria-hidden>→</span>
              </Link>
            </div>
          </div>

          {/* Image with offset frame */}
          <div className="hidden md:block shrink-0 animate-fade-up [animation-delay:200ms]">
            <div className="relative w-[460px] h-[300px]">
              <div aria-hidden className="absolute inset-0 translate-x-3 translate-y-3 rounded-hero border-2 border-gold/50" />
              <div className="relative w-full h-full rounded-hero overflow-hidden shadow-2xl">
                <Image
                  src="https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=760&q=80"
                  alt="Great Wall of China"
                  width={760}
                  height={500}
                  priority
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CONTENT ── */}
      <div className="max-w-[1200px] mx-auto px-4 md:px-[60px] py-8 md:py-12">

        {/* Quick links */}
        <Reveal>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link href="/itinerary" className="group flex items-center gap-4 bg-white border border-paper-dkr rounded-card p-5 cursor-pointer transition-all duration-300 hover:border-red hover:-translate-y-1 hover:shadow-card">
              <div className="w-[52px] h-[52px] rounded-thumb overflow-hidden shrink-0">
                <Image src="https://images.unsplash.com/photo-1547981609-4b6bfe67ca0b?w=200&q=80" alt="Itinerary" width={200} height={150} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-semibold text-ink flex items-center gap-2">
                  Itinerary Planner
                  <span className="text-red transition-transform duration-300 group-hover:translate-x-1" aria-hidden>→</span>
                </div>
                <div className="text-xs text-ink-lt mt-[3px]">Build your day-by-day journey</div>
              </div>
            </Link>
            <Link href="/cultural" className="group flex items-center gap-4 bg-white border border-paper-dkr rounded-card p-5 cursor-pointer transition-all duration-300 hover:border-red hover:-translate-y-1 hover:shadow-card">
              <div className="w-[52px] h-[52px] rounded-thumb overflow-hidden shrink-0">
                <Image src="https://images.unsplash.com/photo-1537819191377-d3305ffddce4?w=200&q=80" alt="Cultural" width={200} height={150} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-semibold text-ink flex items-center gap-2">
                  Cultural Guide
                  <span className="text-red transition-transform duration-300 group-hover:translate-x-1" aria-hidden>→</span>
                </div>
                <div className="text-xs text-ink-lt mt-[3px]">Etiquette, food & language</div>
              </div>
            </Link>
          </div>
        </Reveal>

        {/* Destinations strip */}
        <Reveal>
          <div className="flex items-center justify-between mt-10 mb-5">
            <h2 className="font-display text-2xl font-bold text-ink">Top Destinations</h2>
            <Link href="/attractions" className="group inline-flex items-center gap-1.5 text-[13px] text-red font-medium transition-all duration-300 hover:gap-3">
              Explore all <span aria-hidden>→</span>
            </Link>
          </div>
        </Reveal>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {DESTINATIONS.map((d, i) => (
            <Reveal key={d.name} delay={i * 60}>
              <Link
                href={`/attractions?query=${encodeURIComponent(d.name)}`}
                className="group relative block h-40 rounded-card overflow-hidden"
              >
                <Image
                  src={d.img}
                  alt={d.name}
                  width={600}
                  height={400}
                  unoptimized
                  onError={e => e.target.src = FALLBACK_IMG}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-linear-to-t from-ink/80 via-ink/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-3.5 text-white">
                  <div className="font-display text-base font-bold">{d.name}</div>
                  <div className="text-[11px] text-white/70">{d.cn} · {d.tag}</div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>

        {/* Featured header */}
        <Reveal>
          <div className="flex items-center justify-between mt-10 mb-5">
            <h2 className="font-display text-2xl font-bold text-ink">Featured Attractions</h2>
            <Link href="/attractions" className="group inline-flex items-center gap-1.5 text-[13px] text-red font-medium transition-all duration-300 hover:gap-3">
              View all <span aria-hidden>→</span>
            </Link>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-[1fr_300px] gap-8 items-start">
          {/* Featured grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {loading ? (
              <p className="text-ink-lt">Loading attractions...</p>
            ) : featured.length === 0 ? (
              <p className="text-ink-lt">No attractions found.</p>
            ) : (
              featured.map((a, i) => (
                <Reveal key={a.attraction_id} delay={Math.min(i, 5) * 70}>
                  <Link href={`/attractions/${a.attraction_id}`} className="block bg-white border border-paper-dkr rounded-card overflow-hidden cursor-pointer transition-all duration-300 hover:border-red hover:-translate-y-[3px] hover:shadow-card group">
                    <div className="w-full h-[140px] overflow-hidden">
                      <Image src={a.image_url || 'https://via.placeholder.com/400'} alt={a.name_en} width={400} height={300} unoptimized className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    </div>
                    <div className="px-3.5 py-3">
                      <div className="text-sm font-semibold text-ink">{a.name_en}</div>
                      <div className="text-xs text-ink-lt mt-[3px]">{a.city?.name_en}</div>
                      <div className="inline-block mt-[7px] text-[11px] px-2.5 py-[2px] rounded-[10px] bg-red-xlt text-red-dk font-medium">{a.category?.name}</div>
                    </div>
                  </Link>
                </Reveal>
              ))
            )}
          </div>

          {/* Trending sidebar */}
          <Reveal delay={120}>
            <div className="bg-white border border-paper-dkr rounded-card overflow-hidden">
              <div className="px-[18px] py-[14px] font-display text-[15px] font-bold text-ink border-b border-paper-dk">Trending This Season</div>
              <Link href="/attractions/bf085b9c-6ba5-4602-8916-f7034df25796" className="flex items-center gap-3 px-[18px] py-3 border-b border-paper-dk cursor-pointer transition-colors duration-150 hover:bg-paper">
                <div className="w-11 h-11 rounded-thumb overflow-hidden shrink-0">
                  <Image src="https://images.unsplash.com/photo-1640100385267-4b935d8ef86c?w=120&q=70" alt="West Lake" width={120} height={90} className="w-full h-full object-cover" />
                </div>
                <div>
                  <div className="text-[13px] font-medium text-ink flex-1">West Lake</div>
                  <div className="text-[11px] text-ink-lt">Hangzhou — Spring blossoms</div>
                </div>
              </Link>
              <Link href="/attractions/f195b1dc-3c74-4719-bf71-5ea729dfd6a4" className="flex items-center gap-3 px-[18px] py-3 border-b border-paper-dk cursor-pointer transition-colors duration-150 hover:bg-paper">
                <div className="w-11 h-11 rounded-thumb overflow-hidden shrink-0">
                  <Image src="https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=120&q=70" alt="Great Wall" width={120} height={90} className="w-full h-full object-cover" />
                </div>
                <div>
                  <div className="text-[13px] font-medium text-ink flex-1">Great Wall</div>
                  <div className="text-[11px] text-ink-lt">Beijing — Best in autumn</div>
                </div>
              </Link>
            </div>
          </Reveal>
        </div>
      </div>

      {/* ── CTA BANNER ── */}
      <section className="bg-red">
        <div className="max-w-[1200px] mx-auto px-4 md:px-[60px] py-12 md:py-16 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div>
            <h2 className="font-display text-2xl md:text-3xl font-bold text-white">Ready to plan your trip?</h2>
            <p className="mt-2 text-sm md:text-base text-white/75">Build a day-by-day itinerary or explore our cultural guides.</p>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/itinerary" className="inline-flex items-center bg-white text-red font-semibold rounded-full px-7 py-3.5 text-sm shadow-lg hover:bg-gold-lt hover:-translate-y-0.5 transition-all duration-300">
              Plan an itinerary
            </Link>
            <Link href="/attractions" className="inline-flex items-center border border-white/50 text-white font-semibold rounded-full px-7 py-3.5 text-sm hover:bg-white/10 transition-colors duration-300">
              Browse attractions
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

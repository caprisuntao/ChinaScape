'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import Reveal from '@/components/Reveal'

// --- Caching Configuration ---
const CACHE_PREFIX = 'chinascape_detail_'
const CACHE_DURATION = 5 * 60 * 1000 // 10 minutes

function getCachedAttraction(id) {
  try {
    const key = CACHE_PREFIX + id
    const cached = sessionStorage.getItem(key)
    if (!cached) return null

    const { data, timestamp } = JSON.parse(cached)
    const isExpired = Date.now() - timestamp > CACHE_DURATION

    if (isExpired) {
      sessionStorage.removeItem(key)
      return null
    }
    return data
  } catch {
    return null
  }
}

function setCachedAttraction(id, data) {
  try {
    const key = CACHE_PREFIX + id
    sessionStorage.setItem(key, JSON.stringify({
      data,
      timestamp: Date.now()
    }))
  } catch {
    // Fail silently
  }
}

export default function AttractionDetailPage() {
  const supabase = createClient()
  const { id } = useParams()
  const router = useRouter()

  const [attraction, setAttraction] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saved, setSaved] = useState(false)
  const [user, setUser] = useState(null)
  const [toast, setToast] = useState('')


  useEffect(() => {
    async function load() {
      setLoading(true)

      const cached = getCachedAttraction(id)
      if (cached) {
        setAttraction(cached)
        setLoading(false)
      } else {
        const { data, error } = await supabase
          .from('attraction')
          .select('*, city(*), category(*)')
          .eq('attraction_id', id)
          .single()

        if (error) {
          router.push('/attractions')
          return
        }

        setAttraction(data)
        setCachedAttraction(id, data)
        setLoading(false)
      }

      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)

      if (user) {
        const { data } = await supabase
          .from('favourite')
          .select('favourite_id')
          .eq('attraction_id', id)
          .eq('user_id', user.id)
          .maybeSingle()

        setSaved(!!data)
      }
    }
    load()
  }, [id, supabase, router])

  async function handleSave() {
    if (!user) {
      router.push('/login')
      return
    }

    if (saved) {
      const { error } = await supabase
        .from('favourite')
        .delete()
        .eq('attraction_id', id)
        .eq('user_id', user.id)

      if (!error) {
        setSaved(false)
        showToast('Removed from favourites')
      }
    } else {
      const { error } = await supabase
        .from('favourite')
        .insert({ user_id: user.id, attraction_id: id })

      if (!error) {
        setSaved(true)
        showToast('Saved to favourites!')
      }
    }
  }

  function showToast(msg) {
    setToast(msg)
    setTimeout(() => setToast(''), 2500)
  }

  if (loading) return <div className="text-center py-[60px] text-ink-lt">Loading...</div>
  if (!attraction) return null

  return (
    <div>
      {/* Hero section */}
      <div className="w-full h-[220px] md:h-[340px] relative overflow-hidden">
        <Image
          src={attraction.image_url || 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=1200'}
          alt={attraction.name_en}
          width={1200}
          height={600}
          unoptimized
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-t from-ink/70 via-transparent to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 px-4 md:px-[48px] py-[28px] text-white">
          <div className="font-display text-[24px] md:text-[36px] font-bold leading-tight">{attraction.name_en}</div>
          <div className="text-sm text-white/80 mt-1">{attraction.name_zh}</div>
        </div>
      </div>

      <div className="flex items-center bg-white border-b border-paper-dkr px-4 md:px-8 overflow-x-auto">
        <Link href="/attractions" className="px-5 py-4 text-[13px] font-medium text-ink-md cursor-pointer border-b-2 border-transparent transition-all duration-200 hover:text-red whitespace-nowrap">← Back to Attractions</Link>
        <button className={`ml-auto bg-red text-white border-0 rounded-full px-5 py-2 text-[13px] font-semibold cursor-pointer transition-colors duration-200 ${saved ? 'bg-ink-md hover:bg-ink-md' : 'hover:bg-red-dk'}`} onClick={handleSave}>
          {saved ? '✓ Saved' : '+ Save'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[1fr_320px] gap-[32px] px-4 md:px-[48px] py-5 md:py-[32px]">
        <div>
          <div className="flex gap-2 flex-wrap mb-[18px]">
            <span className="text-xs px-3.5 py-1.5 rounded-full font-medium bg-red-xlt text-red-dk">{attraction.category?.name}</span>
            <span className="text-xs px-3.5 py-1.5 rounded-full font-medium bg-gold-lt text-gold-dk">{attraction.opening_hours}</span>
            {attraction.passport_required && (
              <span className="text-xs px-3.5 py-1.5 rounded-full font-medium bg-paper-dkr text-ink-md">ID / Passport Required</span>
            )}
          </div>

          <Reveal>
            <p className="text-[15px] leading-[1.85] text-ink-md">{attraction.description_en}</p>

            {attraction.booking_notes && (
              <div className="mt-5 bg-gold-lt border border-gold rounded-card px-[18px] py-[14px]">
                <div className="text-xs font-bold text-gold-dk mb-[5px]">BEFORE YOU GO</div>
                <p className="text-[13px] text-ink-md leading-[1.7]">{attraction.booking_notes}</p>
              </div>
            )}

            <div className="text-[13px] text-ink-lt mt-4 pt-4 border-t border-paper-dkr">
              <div className="text-xs font-semibold text-ink-md mb-1">ADDRESS</div>
              <div>{attraction.address_en}</div>
              <div>{attraction.address_zh}</div>
            </div>
          </Reveal>
        </div>

        <div className="md:sticky md:top-[72px]">
          <Reveal>
          <div className="bg-white border border-paper-dkr rounded-card overflow-hidden mb-[14px]">
            <div className="px-4 py-3 text-[13px] font-semibold text-ink bg-paper border-b border-paper-dkr">Visitor Info</div>
            <div className="flex justify-between px-4 py-[10px] border-b border-paper-dk text-[13px]">
              <span className="text-ink-lt">Opening Hours</span>
              <span className="text-ink font-medium">{attraction.opening_hours}</span>
            </div>
            <div className="flex justify-between px-4 py-[10px] border-b border-paper-dk text-[13px]">
              <span className="text-ink-lt">Entrance Fee</span>
              <span className="text-ink font-medium">
                {attraction.entrance_fee === 0 ? 'Free' : `¥${attraction.entrance_fee}`}
              </span>
            </div>
            <div className="flex justify-between px-4 py-[10px] border-b border-paper-dk text-[13px]">
              <span className="text-ink-lt">City</span>
              <span className="text-ink font-medium">{attraction.city?.name_en}</span>
            </div>
            <div className="flex justify-between px-4 py-[10px] border-b border-paper-dk text-[13px]">
              <span className="text-ink-lt">Category</span>
              <span className="text-ink font-medium">{attraction.category?.name}</span>
            </div>
          </div>

          {attraction.ticket_url && (
            <a
              href={attraction.ticket_url}
              target="_blank"
              rel="noopener noreferrer"
              className="block bg-red text-white rounded-full py-3 text-center text-sm font-semibold mb-3 hover:bg-red-dk transition-colors"
            >
              Book Tickets
            </a>
          )}

          <button
            onClick={handleSave}
            className={`w-full bg-paper text-ink-md border border-paper-dkr rounded-full py-3 text-sm font-semibold cursor-pointer ${saved ? 'bg-ink-md text-white' : ''}`}
          >
            {saved ? '✓ Saved to Favourites' : '+ Save to Favourites'}
          </button>
          </Reveal>
        </div>
      </div>

      <div className={`fixed bottom-[28px] left-1/2 -translate-x-1/2 bg-ink text-white px-[22px] py-[11px] rounded-full text-[13px] font-medium transition-transform duration-300 z-[999] whitespace-nowrap ${toast ? 'translate-y-0' : 'translate-y-[80px]'}`}>{toast}</div>
    </div>
  )
}

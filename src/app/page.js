'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import Link from 'next/link'

export default function Home() {
  const supabase = createClient()
  const [featured, setFeatured] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchFeaturedAttractions()
  }, [])

  async function fetchFeaturedAttractions() {
    setLoading(true)
    // Fetching the top 6 attractions and joining city/category info
    const { data, error } = await supabase
      .from('attraction')
      .select('*, city(name_en), category(name)')
      .limit(6)

    if (!error) {
      setFeatured(data || [])
    }
    setLoading(false)
  }

  return (
    <div className="screen active">
      <div className="hero-band">
        <div className="hero-text">
          <div className="hero-title">Discover China,<br/>Your Way</div>
          <div className="hero-sub">From the Great Wall to misty karst mountains — plan your perfect journey through China's most iconic destinations.</div>
          <div className="hero-badges">
            <div className="hero-badge">Beijing</div>
            <div className="hero-badge">Shanghai</div>
            <div className="hero-badge">Xi'an</div>
            <div className="hero-badge">Guilin</div>
            <div className="hero-badge">Chengdu</div>
          </div>
        </div>
        <div className="hero-img">
          <img src="https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=760&q=80" alt="Great Wall of China" />
        </div>
      </div>

      <div className="home-body">
        <div className="home-main">
          <div className="qa-grid">
            <Link href="/itinerary" className="qa-card" style={{ textDecoration: 'none' }}>
              <div className="qa-img"><img src="https://images.unsplash.com/photo-1547981609-4b6bfe67ca0b?w=200&q=80" alt="Itinerary" /></div>
              <div>
                <div className="qa-label">Itinerary Planner</div>
                <div className="qa-sub">Build your day-by-day journey</div>
              </div>
            </Link>
            <Link href="/cultural" className="qa-card" style={{ textDecoration: 'none' }}>
              <div className="qa-img"><img src="https://images.unsplash.com/photo-1537819191377-d3305ffddce4?w=200&q=80" alt="Cultural" /></div>
              <div>
                <div className="qa-label">Cultural Guide</div>
                <div className="qa-sub">Etiquette, food & language</div>
              </div>
            </Link>
          </div>

          <div className="sec-head">
            <div className="sec-title">Featured Attractions</div>
            <Link href="/attractions" className="sec-more">View all →</Link>
          </div>
          
          <div className="attractions-grid">
            {loading ? (
              <p>Loading attractions...</p>
            ) : featured.length === 0 ? (
              <p>No attractions found.</p>
            ) : (
              featured.map(a => (
                // Use attraction_id as defined in your schema
                <Link href={`/attractions/${a.attraction_id}`} key={a.attraction_id} className="acard">
                  <div className="acard-img">
                    <img src={a.image_url || 'https://via.placeholder.com/400'} alt={a.name_en} />
                  </div>
                  <div className="acard-body">
                    <div className="acard-name">{a.name_en}</div>
                    {/* Accessing joined city data */}
                    <div className="acard-loc">{a.city?.name_en}</div>
                    {/* Accessing joined category data */}
                    <div className="acard-tag">{a.category?.name}</div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>

        <div className="home-side">
          <div className="side-card">
            <div className="side-card-head">Trending This Season</div>
            {/* You can also fetch these or keep them static for now */}
            <Link href="/attractions/5" className="side-item">
              <div className="side-item-img"><img src="https://images.unsplash.com/photo-1640100385267-4b935d8ef86c?w=120&q=70" alt="West Lake" /></div>
              <div><div className="side-item-name">West Lake</div><div className="side-item-meta">Hangzhou — Spring blossoms</div></div>
            </Link>
            <Link href="/attractions/f195b1dc-3c74-4719-bf71-5ea729dfd6a4" className="side-item">
              <div className="side-item-img"><img src="https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=120&q=70" alt="Great Wall" /></div>
              <div><div className="side-item-name">Great Wall</div><div className="side-item-meta">Beijing — Best in autumn</div></div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
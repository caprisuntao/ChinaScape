import Link from 'next/link';
import { attractionsData } from '@/lib/data';

export default function Home() {
  const featured = attractionsData.slice(0, 6);

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
            {featured.map(a => (
              <Link href={`/attractions/${a.id}`} key={a.id} className="acard">
                <div className="acard-img"><img src={a.img} alt={a.name} /></div>
                <div className="acard-body">
                  <div className="acard-name">{a.name}</div>
                  <div className="acard-loc">{a.addr.split(',')[0]}</div>
                  <div className="acard-tag">{a.cat}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="home-side">
          <div className="side-card">
            <div className="side-card-head">Trending This Season</div>
            <Link href="/attractions/5" className="side-item">
              <div className="side-item-img"><img src="https://images.unsplash.com/photo-1640100385267-4b935d8ef86c?w=120&q=70" alt="West Lake" /></div>
              <div><div className="side-item-name">West Lake</div><div className="side-item-meta">Hangzhou — Spring blossoms</div></div>
            </Link>
            <Link href="/attractions/0" className="side-item">
              <div className="side-item-img"><img src="https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=120&q=70" alt="Great Wall" /></div>
              <div><div className="side-item-name">Great Wall</div><div className="side-item-meta">Beijing — Best in autumn</div></div>
            </Link>
            
          </div>
          
          
        </div>
      </div>
    </div>
  );
}
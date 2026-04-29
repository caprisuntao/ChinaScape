import Link from 'next/link';

export default function Itinerary() {
  return (
    <div className="screen active">
      <div className="detail-bar" style={{padding: '0 32px'}}>
        <Link href="/" className="detail-action">← Back</Link>
        <div style={{padding: '14px 0', fontFamily: "'Noto Serif SC', serif", fontSize: 17, fontWeight: 700}}>My Itinerary</div>
        <button className="detail-save">Save</button>
      </div>
      
      <div className="itin-page">
        <div className="itin-main">
          <div className="day-card">
            <div className="day-head"><h3>Day 1 — Beijing</h3><div className="day-add">+</div></div>
            <div className="act-row"><span className="act-drag">☰</span><div className="act-img"><img src="https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=120&q=70" alt="" /></div><span className="act-name">Great Wall (Badaling)</span><span className="act-time">8:00 AM</span></div>
            <div className="act-row"><span className="act-drag">☰</span><div className="act-img"><img src="https://images.unsplash.com/photo-1577706881850-bf7c7d8906a5?w=120&q=70" alt="" /></div><span className="act-name">Forbidden City</span><span className="act-time">1:30 PM</span></div>
          </div>
          
          <div className="day-card">
            <div className="day-head"><h3>Day 2 — Xi'an</h3><div className="day-add">+</div></div>
            <div className="act-row"><span className="act-drag">☰</span><div className="act-img"><img src="https://images.unsplash.com/photo-1552598442-d8a9fe79eb11?w=120&q=70" alt="" /></div><span className="act-name">Terracotta Army</span><span className="act-time">9:00 AM</span></div>
            <div className="act-row"><span className="act-drag">☰</span><div className="act-img"><img src="https://images.unsplash.com/photo-1537819191377-d3305ffddce4?w=120&q=70" alt="" /></div><span className="act-name">Muslim Quarter</span><span className="act-time">2:00 PM</span></div>
          </div>
        </div>
        
        <div className="itin-side">
          <div className="cost-card">
            <div className="cost-title">Cost Estimator</div>
            <div className="cost-row"><span className="cost-label">Transport</span><span>¥420</span></div>
            <div className="cost-row"><span className="cost-label">Tickets</span><span>¥310</span></div>
            <div className="cost-row"><span className="cost-label">Food (est.)</span><span>¥200</span></div>
            <div className="cost-row"><span className="cost-label">Total</span><span>¥930</span></div>
          </div>
          <div className="itin-btn"><span>1-Day Itinerary</span><span>›</span></div>
          <div className="itin-btn"><span>2-Day Itinerary</span><span>›</span></div>
          <button className="map-btn">Map View</button>
        </div>
      </div>
    </div>
  );
}
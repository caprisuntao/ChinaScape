"use client";
import Link from 'next/link';
import { useState, use } from 'react';
import { attractionsData } from '@/lib/data';

export default function AttractionDetail({ params }) {
  const resolvedParams = use(params); 
  const id = resolvedParams.id;
  const [isSaved, setIsSaved] = useState(false);
  const attraction = attractionsData.find(a => a.id.toString() === id);

  if (!attraction) return <div style={{padding: 60}}>Attraction not found.</div>;

  return (
    <div className="screen active">
      <div className="detail-hero">
        <img src={attraction.img} alt={attraction.name} />
        <div className="detail-hero-overlay"></div>
        <div className="detail-hero-text">
          <div className="detail-hero-name">{attraction.name}</div>
          <div className="detail-hero-cn">{attraction.cn} · {attraction.addr.split(',')[0]}</div>
        </div>
      </div>
      
      <div className="detail-bar">
        <Link href="/attractions" className="detail-action">← Back</Link>
        <div className="detail-action">Gallery</div>
        <div className="detail-action">Ticketing</div>
        <button 
          className={`detail-save ${isSaved ? 'saved' : ''}`} 
          onClick={() => setIsSaved(!isSaved)}
        >
          {isSaved ? 'Saved' : 'Save to Profile'}
        </button>
      </div>

      <div className="detail-body">
        <div>
          <div className="detail-tags">
            <span className="dtag dtag-cat">{attraction.cat}</span>
            <span className="dtag dtag-hrs">Hours: {attraction.hrs}</span>
            <span className="dtag dtag-pass">Passport required for entry</span>
          </div>
          <div className="detail-desc">{attraction.desc}</div>
          <div className="detail-addr">{attraction.cn} · {attraction.addr}</div>
        </div>
        <div>
          <div className="info-card">
            <div className="info-card-head">Visit Info</div>
            <div className="info-row"><span className="info-label">Category</span><span className="info-val">{attraction.cat}</span></div>
            <div className="info-row"><span className="info-label">Hours</span><span className="info-val">{attraction.hrs}</span></div>
            <div className="info-row"><span className="info-label">Entry</span><span className="info-val">ID/Passport required</span></div>
            <div className="info-row"><span className="info-label">Best season</span><span className="info-val">Spring & Autumn</span></div>
          </div>
          <div className="info-card">
            <div className="info-card-head">Nearby</div>
            <div className="nearby-img"><img src={attraction.nearby} alt="nearby" /></div>
            <div style={{padding: '0 16px 14px', fontSize: '13px', color: 'var(--ink-lt)'}}>{attraction.nbTxt}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
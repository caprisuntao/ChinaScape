import Link from 'next/link';

export default function Profile() {
  return (
    <div className="screen active">
      <div className="detail-bar" style={{padding: '0 32px'}}>
        <Link href="/" className="detail-action">← Back</Link>
        <div style={{padding: '14px 0', fontFamily: "'Noto Serif SC', serif", fontSize: 17, fontWeight: 700}}>My Profile</div>
      </div>
      
      <div className="profile-page">
        <div className="profile-sidebar">
          <div className="profile-av-lg">旅</div>
          <div className="profile-name">Explorer</div>
          <div className="profile-sub">China travel enthusiast</div>
          <div className="profile-stats">
            <div className="pstat"><div className="pstat-n">2</div><div className="pstat-l">Itineraries</div></div>
            <div className="pstat"><div className="pstat-n">2</div><div className="pstat-l">Saved</div></div>
          </div>
        </div>
        
        <div className="profile-main">
          <div className="prof-card">
            <div className="prof-card-head">Saved Itineraries <span>Edit</span></div>
            <div className="saved-row">
              <div className="saved-img"><img src="https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=120&q=70" alt="" /></div>
              <div style={{flex: 1}}><div className="saved-name">Beijing 2-Day Trip</div><div className="saved-meta">3 stops · ¥930 est.</div></div>
              <button className="saved-dl">⬇</button>
            </div>
          </div>
          
          <div className="prof-card">
            <div className="prof-card-head">Saved Spots <span>Edit</span></div>
            <Link href="/attractions/0" className="saved-row">
              <div className="saved-img"><img src="https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=120&q=70" alt="" /></div>
              <div><div className="saved-name">Great Wall of China</div><div className="saved-meta">Badaling, Beijing</div></div>
            </Link>
            <Link href="/attractions/1" className="saved-row">
              <div className="saved-img"><img src="https://images.unsplash.com/photo-1577706881850-bf7c7d8906a5?w=120&q=70" alt="" /></div>
              <div><div className="saved-name">Forbidden City</div><div className="saved-meta">Dongcheng, Beijing</div></div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
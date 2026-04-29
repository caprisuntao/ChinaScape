import Link from 'next/link';
import { attractionsData } from '@/lib/data';

export default function AttractionsList() {
  return (
    <div className="attractions-page screen active">
      <div className="sec-head">
        <div className="sec-title">All Attractions</div>
      </div>
      <div className="filter-bar">
        <div className="filter-chip active">All</div>
        <div className="filter-chip">Historical</div>
        <div className="filter-chip">Nature</div>
        <div className="filter-chip">Wildlife</div>
      </div>
      <div className="attractions-grid">
        {attractionsData.map(a => (
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
  );
}
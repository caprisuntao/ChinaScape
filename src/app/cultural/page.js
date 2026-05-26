import Link from 'next/link';
import Image from 'next/image';

export default function CulturalPage() {
  return (
    <div className="screen active">
      <div className="detail-bar">
        <Link href="/" className="detail-action">← Back</Link>
        <div className="detail-bar-title">Cultural Guide</div>
      </div>

      <div className="cultural-page">
        <div className="page-header-center">
          <h1>Know Before You Go</h1>
          <p>Essential cultural knowledge for your China journey</p>
        </div>

        <div className="cultural-grid">

          <Link href="/cultural/manners" className="guide-card">
            <div className="guide-img">
              <Image src="https://images.unsplash.com/photo-1547981609-4b6bfe67ca0b?w=240&q=80" alt="Etiquette" width={240} height={160} />
            </div>
            <div className="guide-text">
              <div className="guide-name">Etiquette Tips</div>
              <div className="guide-sub">Customs, manners, and what to avoid when visiting China</div>
            </div>
            <div className="guide-arrow">›</div>
          </Link>

          <Link href="/cultural/food" className="guide-card">
            <div className="guide-img">
              <Image src="https://images.unsplash.com/photo-1563245372-f21724e3856d?w=240&q=80" alt="Food" width={240} height={160} />
            </div>
            <div className="guide-text">
              <div className="guide-name">Must-Try Food</div>
              <div className="guide-sub">Local dishes and the best nearby restaurants to try</div>
            </div>
            <div className="guide-arrow">›</div>
            </Link>

          <Link href="/cultural/language" className="guide-card">
            <div className="guide-img">
              <Image src="https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=240&q=80" alt="Language" width={240} height={160} />
            </div>
            <div className="guide-text">
              <div className="guide-name">Language Flashcards</div>
              <div className="guide-sub">Common Mandarin phrases for everyday travel use</div>
            </div>
            <div className="guide-arrow">›</div>
          </Link>
        </div>
      </div>
    </div>
  );
}
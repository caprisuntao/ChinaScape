import Link from 'next/link';

export default function FoodPage() {
  return (
    <div className="screen active">
      <div className="detail-bar" style={{ padding: '0 32px' }}>
        <Link href="/cultural" className="detail-action">← Back to Cultural Guide</Link>
        <div style={{ padding: '14px 0', fontFamily: "'Noto Serif SC', serif", fontSize: 17, fontWeight: 700 }}>
          Must-Try Foods
        </div>
      </div>
      <div style={{ padding: '40px 60px' }}>
         <h1>Local Chinese Delicacies</h1>
         <p>Content for food recommendations goes here...</p>
      </div>
    </div>
  );
}
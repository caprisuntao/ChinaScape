'use client'
import { useState } from 'react';
import Link from 'next/link';

const dishes = [
  {
    name: 'Peking Duck',
    name_zh: '北京烤鸭',
    origin: 'Beijing',
    description: 'A world-famous dish featuring crispy, lacquered duck skin carved tableside and wrapped in thin pancakes with scallions, cucumber, and sweet bean sauce.',
    mustTry: 'Quanjude (全聚德) or Dadong (大董) — the two most iconic roast duck restaurants in Beijing.',
  },
  {
    name: 'Xiaolongbao (Soup Dumplings)',
    name_zh: '小笼包',
    origin: 'Shanghai / Jiangsu',
    description: 'Delicate steamed dumplings filled with pork and a rich, hot broth that bursts in your mouth. Bite a small hole first to let the steam escape!',
    mustTry: 'Din Tai Fung (鼎泰丰) for consistently perfect xiaolongbao worldwide, or local shops in Shanghai.',
  },
  {
    name: 'Hot Pot',
    name_zh: '火锅',
    origin: 'Chongqing / Sichuan',
    description: 'A bubbling, spicy broth (or dual broth for the faint-hearted) where you cook your own meats, vegetables, and tofu. A deeply social dining experience.',
    mustTry: 'Haidilao (海底捞) — famous for incredible service and a wide broth selection. For authentic Chongqing-style, seek out a local hot pot alley.',
  },
  {
    name: 'Mapo Tofu',
    name_zh: '麻婆豆腐',
    origin: 'Sichuan',
    description: 'Silky soft tofu in a fiery, numbing sauce made with doubanjiang (fermented bean paste), Sichuan peppercorns, and minced pork. The "má" (numbing) sensation is signature.',
    mustTry: 'Chen Mapo Tofu (陈麻婆豆腐) in Chengdu — the original since 1862.',
  },
  {
    name: 'Kung Pao Chicken',
    name_zh: '宫保鸡丁',
    origin: 'Sichuan',
    description: 'Diced chicken stir-fried with peanuts, dried chilies, and Sichuan peppercorns in a savory-sweet sauce. A perfect balance of spicy, sour, and sweet.',
    mustTry: 'Almost any Sichuan restaurant serves a great version. Look for places packed with locals.',
  },
  {
    name: 'Dim Sum',
    name_zh: '点心',
    origin: 'Hong Kong / Guangdong',
    description: 'A wide array of small, bite-sized dishes served in bamboo steamers — from har gow (shrimp dumplings) to siu mai (pork dumplings) to char siu bao (BBQ pork buns).',
    mustTry: 'In Hong Kong: Tim Ho Wan (添好运) — the world\'s cheapest Michelin-starred restaurant. In Guangzhou: Guangzhou Restaurant (广州酒家).',
  },
  {
    name: 'Lanzhou Pulled Noodles',
    name_zh: '兰州拉面',
    origin: 'Lanzhou (Gansu)',
    description: 'Hand-pulled noodles served in a clear, aromatic beef broth with slices of beef, radish, cilantro, and chili oil. Watching the chef pull the noodles is a show in itself.',
    mustTry: 'Any halal Lanzhou noodle shop — look for the hand-pulling window at the front.',
  },
  {
    name: 'Jianbing',
    name_zh: '煎饼果子',
    origin: 'Tianjin',
    description: 'China\'s ultimate street breakfast: a thin crepe spread with egg, brushed with hoisin and chili sauce, sprinkled with scallions and cilantro, folded around a crispy cracker.',
    mustTry: 'Street stalls everywhere in the morning. Follow the line of locals!',
  },
  {
    name: 'Char Siu (BBQ Pork)',
    name_zh: '叉烧',
    origin: 'Hong Kong / Guangdong',
    description: 'Honey-glazed, roasted pork belly with a signature red exterior. Sweet, savory, caramelized — often served over rice or inside fluffy steamed buns.',
    mustTry: 'Look for cha siu hanging in the window of any Cantonese BBQ shop (烧腊店).',
  },
  {
    name: 'Sichuan Dan Dan Noodles',
    name_zh: '担担面',
    origin: 'Sichuan',
    description: 'Chewy noodles topped with minced pork, crushed peanuts, scallions, and a spicy, tangy sauce made from sesame paste, chili oil, and Sichuan peppercorns.',
    mustTry: 'Local Chengdu street vendors or specialty noodle shops.',
  },
  {
    name: 'Cong You Bing (Scallion Pancake)',
    name_zh: '葱油饼',
    origin: 'Shanghai / Northern China',
    description: 'A flaky, pan-fried flatbread stuffed with scallions and oil. Crispy on the outside, chewy on the inside — perfect as a snack or side.',
    mustTry: 'Street food stalls and breakfast shops across Shanghai and Beijing.',
  },
  {
    name: 'Chuan\'r (Grilled Skewers)',
    name_zh: '串儿',
    origin: 'Xinjiang / Northern China',
    description: 'Spicy lamb skewers grilled over charcoal, seasoned with cumin, chili powder, and salt. The quintessential Chinese street food enjoyed with a cold beer.',
    mustTry: 'Night markets (夜市) — Wangfujing in Beijing or Muslim Quarter in Xi\'an.',
  },
];

export default function FoodPage() {
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // ── Filter dishes by name or origin ──────────────────────────────────────
  const filtered = dishes.filter(dish =>
    dish.name.toLowerCase().includes(search.toLowerCase()) ||
    dish.name_zh.includes(search) ||
    dish.origin.toLowerCase().includes(search.toLowerCase())
  );

  // ── Pagination ───────────────────────────────────────────────────────────
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentItems = filtered.slice(indexOfFirst, indexOfLast);

  function handlePageChange(page) {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Reset to page 1 when search changes
  function handleSearch(val) {
    setSearch(val);
    setCurrentPage(1);
  }

  return (
    <div className="screen active">
      {/* Navigation Top Bar */}
      <div className="detail-bar" style={{ padding: '0 32px' }}>
        <Link href="/cultural" className="detail-action">← Back to Cultural Guide</Link>
        <div style={{ padding: '14px 0', fontFamily: "'Noto Serif SC', serif", fontSize: 17, fontWeight: 700 }}>
          Must-Try Foods
        </div>
      </div>

      {/* Main Content Area */}
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 32px' }}>
        <div style={{ marginBottom: '40px' }}>
          <h1 style={{ fontFamily: "'Noto Serif SC', serif", fontSize: '32px', color: '#3D2E1E', marginBottom: '8px' }}>
             Local Chinese Delicacies
          </h1>
          <p style={{ fontSize: '16px', color: '#7A6A58' }}>
            China&apos;s culinary landscape is vast and deeply regional. Here are the must-try dishes
            every traveler should seek out — from street stalls to legendary restaurants.
          </p>
        </div>

        {/* ── Search Bar ─────────────────────────────────────────────────── */}
        <div style={{ marginBottom: '28px' }}>
          <input
            autoFocus
            value={search}
            onChange={e => handleSearch(e.target.value)}
            placeholder="Search by dish name or city…"
            style={{
              width: '100%',
              padding: '12px 18px',
              border: '1px solid #E8E0D4',
              borderRadius: '24px',
              fontSize: '14px',
              outline: 'none',
              fontFamily: 'inherit',
              color: '#3D2E1E',
              background: '#fff',
              boxSizing: 'border-box',
            }}
          />
        </div>

        {/* ── Dish Cards ─────────────────────────────────────────────────── */}
        {currentItems.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#7A6A58', fontSize: '14px' }}>
            No dishes found matching &ldquo;{search}&rdquo;
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {currentItems.map((dish, i) => (
              <div
                key={i}
                style={{
                  background: '#FAF7F2',
                  borderRadius: '12px',
                  padding: '24px',
                  border: '1px solid #E8E0D4',
                  transition: 'box-shadow 0.2s',
                }}
              >
                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', marginBottom: '8px' }}>
                  <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#B5271A', margin: 0 }}>
                    {dish.name}
                  </h2>
                  <span style={{ fontSize: '15px', color: '#7A6A58', fontFamily: "'Noto Serif SC', serif" }}>
                    {dish.name_zh}
                  </span>
                  <span style={{
                    fontSize: '11px',
                    background: '#E8E0D4',
                    color: '#3D2E1E',
                    borderRadius: '10px',
                    padding: '2px 10px',
                    marginLeft: 'auto',
                    whiteSpace: 'nowrap',
                  }}>
                    {dish.origin}
                  </span>
                </div>

                {/* Description */}
                <p style={{ fontSize: '14px', color: '#3D2E1E', lineHeight: '1.7', margin: '0 0 12px 0' }}>
                  {dish.description}
                </p>

                {/* Must-try tip */}
                <div style={{
                  background: '#fff',
                  borderRadius: '8px',
                  padding: '10px 14px',
                  borderLeft: '3px solid #B5271A',
                  fontSize: '13px',
                  color: '#3D2E1E',
                  lineHeight: '1.5',
                }}>
                  <span style={{ fontWeight: 600, color: '#B5271A' }}> Where to try:</span>{' '}
                  {dish.mustTry}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Pagination Controls ────────────────────────────────────────── */}
        {totalPages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', marginTop: '40px' }}>
            {/* Prev */}
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              style={{
                padding: '8px 16px',
                borderRadius: '6px',
                border: '1px solid #E8E0D4',
                background: currentPage === 1 ? '#F5F5F5' : '#FAF7F2',
                color: currentPage === 1 ? '#A0A0A0' : '#3D2E1E',
                cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                fontSize: '14px',
                fontWeight: 600,
                fontFamily: 'inherit',
                transition: 'all 0.2s',
              }}
            >
              ← Prev
            </button>

            {/* Page numbers */}
            {Array.from({ length: totalPages }, (_, idx) => {
              const pageNum = idx + 1;
              const isActive = currentPage === pageNum;
              return (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '6px',
                    border: isActive ? '1px solid #B5271A' : '1px solid #E8E0D4',
                    background: isActive ? '#B5271A' : '#FAF7F2',
                    color: isActive ? '#FFFFFF' : '#3D2E1E',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: 600,
                    fontFamily: 'inherit',
                    transition: 'all 0.2s',
                  }}
                >
                  {pageNum}
                </button>
              );
            })}

            {/* Next */}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              style={{
                padding: '8px 16px',
                borderRadius: '6px',
                border: '1px solid #E8E0D4',
                background: currentPage === totalPages ? '#F5F5F5' : '#FAF7F2',
                color: currentPage === totalPages ? '#A0A0A0' : '#3D2E1E',
                cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                fontSize: '14px',
                fontWeight: 600,
                fontFamily: 'inherit',
                transition: 'all 0.2s',
              }}
            >
              Next →
            </button>
          </div>
        )}

        {/* Footer note */}
        <div style={{
          marginTop: '40px',
          padding: '16px 20px',
          background: '#F2EDE4',
          borderRadius: '12px',
          fontSize: '13px',
          color: '#7A6A58',
          lineHeight: '1.6',
          textAlign: 'center',
        }}>
          <strong> Pro Tip:</strong> When in China, look for restaurants that are busy with locals —
          it&apos;s the best sign of quality food. Don&apos;t be afraid to point at the menu
          (or at what other tables are having)!
        </div>
      </div>
    </div>
  );
}
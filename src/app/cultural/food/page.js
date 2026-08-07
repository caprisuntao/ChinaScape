'use client'
import { useState } from 'react';
import Link from 'next/link';
import Reveal from '@/components/Reveal';

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
    <>
      {/* Hero band */}
      <section className="bg-red">
        <div className="max-w-[1200px] mx-auto px-4 md:px-12 py-12 md:py-14">
          <Link href="/cultural" className="text-[12px] text-white/85 hover:text-white transition-colors duration-200">← Back to Cultural Guide</Link>
          <h1 className="font-display text-page-title md:text-hero font-bold text-white mt-3">Must-Try Foods</h1>
          <p className="mt-2 text-sm text-white/85">Local Chinese delicacies — from street stalls to legendary restaurants.</p>
        </div>
      </section>

      <div className="max-w-[900px] mx-auto px-4 md:px-[32px] py-8 md:py-12">
        <div className="mb-6">
          <input
            value={search}
            onChange={e => handleSearch(e.target.value)}
            placeholder="Search by dish name or city…"
            aria-label="Search dishes"
            className="w-full px-4 py-3 border border-paper-dkr rounded-full text-sm outline-none text-ink-md bg-white focus:border-red focus-visible:ring-2 focus-visible:ring-red/40 transition-colors"
          />
        </div>

        {currentItems.length === 0 ? (
          <div className="text-center py-16 text-ink-lt text-sm">
            No dishes found matching &ldquo;{search}&rdquo;
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {currentItems.map((dish, i) => (
              <Reveal key={i} delay={Math.min(i, 5) * 60}>
                <div className="bg-white rounded-card p-6 border border-paper-dkr">
                  <div className="flex items-baseline gap-2 mb-2 flex-wrap">
                    <h2 className="text-xl font-bold text-red">{dish.name}</h2>
                    <span className="text-[15px] text-ink-lt font-display">{dish.name_zh}</span>
                    <span className="text-[11px] bg-paper-dkr text-ink-md rounded-full px-2.5 py-0.5 ml-auto whitespace-normal sm:whitespace-nowrap">{dish.origin}</span>
                  </div>
                  <p className="text-sm text-ink-md leading-[1.7] mb-3">{dish.description}</p>
                  <div className="bg-paper rounded-card px-4 py-3 border-l-[3px] border-red text-[13px] text-ink-md leading-relaxed">
                    <span className="font-semibold text-red">Where to try:</span>{' '}
                    {dish.mustTry}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        )}

        {/* ── Pagination Controls ────────────────────────────────────────── */}
        {totalPages > 1 && (
          <nav aria-label="Pagination" className="flex justify-center items-center gap-2 mt-10">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              aria-label="Previous page"
              className="px-4 py-2 rounded-full border border-paper-dkr bg-white text-ink-md cursor-pointer text-sm font-semibold hover:border-red hover:text-red transition-colors disabled:bg-disabled-bg disabled:text-disabled-text disabled:cursor-not-allowed"
            >
              ← Prev
            </button>
            {Array.from({ length: totalPages }, (_, idx) => {
              const pageNum = idx + 1;
              const isActive = currentPage === pageNum;
              return (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  aria-label={`Go to page ${pageNum}`}
                  aria-current={isActive ? 'page' : undefined}
                  className={`w-9 h-9 rounded-full border cursor-pointer text-sm font-semibold flex items-center justify-center transition-colors ${isActive ? 'bg-red text-white border-red' : 'bg-white text-ink-md border-paper-dkr hover:border-red hover:text-red'}`}
                >
                  {pageNum}
                </button>
              );
            })}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              aria-label="Next page"
              className="px-4 py-2 rounded-full border border-paper-dkr bg-white text-ink-md cursor-pointer text-sm font-semibold hover:border-red hover:text-red transition-colors disabled:bg-disabled-bg disabled:text-disabled-text disabled:cursor-not-allowed"
            >
              Next →
            </button>
          </nav>
        )}

        <div className="mt-10 px-6 py-5 bg-gold-lt border border-gold rounded-card text-[13px] text-ink-md leading-[1.7] text-center">
          <strong className="text-gold-dk">Pro Tip:</strong> When in China, look for restaurants that are busy with locals —
          it&apos;s the best sign of quality food. Don&apos;t be afraid to point at the menu
          (or at what other tables are having)!
        </div>
      </div>
    </>
  );
}

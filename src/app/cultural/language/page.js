'use client'
import { useState } from 'react';
import Link from 'next/link';
import Reveal from '@/components/Reveal';

// Essential travel phrases
const phrases = [
  { id: 1, category: 'Greetings', en: 'Hello', pinyin: 'Nǐ hǎo', zh: '你好' },
  { id: 2, category: 'Greetings', en: 'Thank you', pinyin: 'Xièxiè', zh: '谢谢' },
  { id: 3, category: 'Greetings', en: 'Excuse me / Sorry', pinyin: 'Duìbùqǐ', zh: '对不起' },
  { id: 4, category: 'Navigation', en: 'Where is the restroom?', pinyin: 'Xǐshǒujiān zài nǎlǐ?', zh: '洗手间在哪里？' },
  { id: 5, category: 'Navigation', en: 'I want to go to...', pinyin: 'Wǒ xiǎng qù...', zh: '我想去...' },
  { id: 6, category: 'Navigation', en: 'Turn left / Turn right', pinyin: 'Zuǒ zhuǎn / Yòu zhuǎn', zh: '左转 / 右转' },
  { id: 7, category: 'Dining & Shopping', en: 'How much is this?', pinyin: 'Zhège duōshǎo qián?', zh: '这个多少钱？' },
  { id: 8, category: 'Dining & Shopping', en: 'Too expensive!', pinyin: 'Tài guì le!', zh: '太贵了！' },
  { id: 9, category: 'Dining & Shopping', en: 'The bill, please', pinyin: 'Mǎidān', zh: '买单' },

  // --- NEW GREETINGS & ESSENTIALS ---
  { id: 10, category: 'Greetings', en: 'Good morning', pinyin: 'Zǎoshang hǎo', zh: '早上好' },
  { id: 11, category: 'Greetings', en: 'Goodbye', pinyin: 'Zàijiàn', zh: '再见' },
  { id: 12, category: 'Greetings', en: 'Yes / No', pinyin: 'Shì de / Bú shì', zh: '是的 / 不是' },
  { id: 13, category: 'Greetings', en: 'Do you speak English?', pinyin: 'Nǐ huì shuō Yīngyǔ ma?', zh: '你会说英语吗？' },
  { id: 14, category: 'Greetings', en: 'I don’t understand', pinyin: 'Wǒ tīng bù dǒng', zh: '我听不懂' },

  // --- NEW NAVIGATION & TRANSPORT ---
  { id: 15, category: 'Navigation', en: 'Where is the subway station?', pinyin: 'Dìtiězhàn zài nǎlǐ?', zh: '地铁站在哪里？' },
  { id: 16, category: 'Navigation', en: 'Please drive faster / slower', pinyin: 'Qǐng kuài diǎn / màn diǎn', zh: '请快点 / 慢点' },
  { id: 17, category: 'Navigation', en: 'Please turn on the meter', pinyin: 'Qǐng dǎ biǎo', zh: '请打表' },
  { id: 18, category: 'Navigation', en: 'Stop here, please', pinyin: 'Qǐng zài zhèlǐ tíngchē', zh: '请在这里停车' },
  { id: 19, category: 'Navigation', en: 'Where can I buy a ticket?', pinyin: 'Zài nǎlǐ mǎi piào?', zh: '在哪里买票？' },

  // --- NEW DINING & SHOPPING ---
  { id: 20, category: 'Dining & Shopping', en: 'Menu, please', pinyin: 'Qǐng gěi wǒ càidān', zh: '请给我菜单' },
  { id: 21, category: 'Dining & Shopping', en: 'Not spicy, please', pinyin: 'Qǐng búyào fàng là', zh: '请不要放辣' },
  { id: 22, category: 'Dining & Shopping', en: 'Can I pay with Alipay / WeChat Pay?', pinyin: 'Kěyǐ yòng Zhīfùbǎo / Wēixìn zhīfù ma?', zh: '可以用支付宝/微信支付吗？' },
  { id: 23, category: 'Dining & Shopping', en: 'I am a vegetarian', pinyin: 'Wǒ chī sù', zh: '我吃素' },
  { id: 24, category: 'Dining & Shopping', en: 'Check / Receipt, please', pinyin: 'Qǐng gěi wǒ fāpiào', zh: '请给我发票' },

  // --- NEW: HOTEL & LODGING ---
  { id: 25, category: 'Hotel', en: 'I want to check in', pinyin: 'Wǒ yào rùzhù', zh: '我要入住' },
  { id: 26, category: 'Hotel', en: 'What is the Wi-Fi password?', pinyin: 'WIFI mìmǎ shi shénme?', zh: '无线网络密码是什么？' },
  { id: 27, category: 'Hotel', en: 'Please clean my room', pinyin: 'Qǐng dǎsǎo yīxià fángjiān', zh: '请打扫一下房间' },
  { id: 28, category: 'Hotel', en: 'I want to check out', pinyin: 'Wǒ yào tuì fáng', zh: '我要退房' },

  // --- NEW: EMERGENCIES & HELP ---
  { id: 29, category: 'Emergencies', en: 'Help!', pinyin: 'Jiùmìng ā!', zh: '救命啊！' },
  { id: 30, category: 'Emergencies', en: 'I need a doctor', pinyin: 'Wǒ xūyào kàn yīshēng', zh: '我们需要看医生' },
  { id: 31, category: 'Emergencies', en: 'I lost my passport', pinyin: 'Wǒ de hùzhào diū le', zh: '我的护照丢了' },
  { id: 32, category: 'Emergencies', en: 'Call the police', pinyin: 'Bàojǐng', zh: '报警' }
];

export default function LanguagePage() {
  const [flippedCards, setFlippedCards] = useState({});

  // --- Pagination State & Logic ---
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  const totalPages = Math.ceil(phrases.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = phrases.slice(indexOfFirstItem, indexOfLastItem);

  const toggleCard = (id) => {
    setFlippedCards(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    // Optional: Smooth scroll back up to the top of the grid when changing pages
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* Hero band */}
      <section className="bg-red">
        <div className="max-w-[1200px] mx-auto px-4 md:px-12 py-12 md:py-14">
          <Link href="/cultural" className="text-[12px] text-white/85 hover:text-white transition-colors duration-200">← Back to Cultural Guide</Link>
          <h1 className="font-display text-page-title md:text-hero font-bold text-white mt-3">Language Flashcards</h1>
          <p className="mt-2 text-sm text-white/85">Common Mandarin phrases for everyday travel use — click a card to reveal the translation.</p>
        </div>
      </section>

      <div className="max-w-[900px] mx-auto px-4 md:px-[32px] py-8 md:py-12">
        <div className="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-5 min-h-[340px]">
          {currentItems.map((phrase, i) => {
            const isFlipped = flippedCards[phrase.id];
            return (
              <Reveal key={phrase.id} delay={Math.min(i, 8) * 40}>
                <button
                  onClick={() => toggleCard(phrase.id)}
                  aria-pressed={isFlipped}
                  className={`w-full rounded-card px-5 py-8 min-h-[160px] flex flex-col justify-center items-center text-center cursor-pointer transition-all duration-300 shadow-subtle relative hover:-translate-y-[3px] hover:shadow-card-sm ${isFlipped ? 'bg-red border-red text-white' : 'bg-white border border-paper-dkr text-ink-md'}`}
                >
                  <div className={`absolute top-3 left-3 text-[11px] font-semibold uppercase tracking-[0.05em] ${isFlipped ? 'text-white/90' : 'text-ink-lt'}`}>{phrase.category}</div>
                  <div aria-live="polite">
                    {isFlipped ? (
                      <div className="fade-in">
                        <div className="text-[32px] font-display font-bold mb-2">{phrase.zh}</div>
                        <div className="text-base opacity-90">{phrase.pinyin}</div>
                      </div>
                    ) : (
                      <div className="text-lg font-semibold fade-in">{phrase.en}</div>
                    )}
                  </div>
                </button>
              </Reveal>
            );
          })}
        </div>

        {/* --- Pagination UI Controls --- */}
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
            {Array.from({ length: totalPages }, (_, index) => {
              const pageNum = index + 1;
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
      </div>
    </>
  );
}

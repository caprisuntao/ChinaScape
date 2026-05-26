'use client'
import { useState } from 'react';
import Link from 'next/link';

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
    <div className="screen active">
      {/* Navigation Top Bar */}
      <div className="detail-bar">
        <Link href="/cultural" className="detail-action">← Back to Cultural Guide</Link>
        <div className="detail-bar-title">Language Flashcards</div>
      </div>

      <div className="page-header">
        <div style={{ marginBottom: '40px' }}>
          <h1 className="page-heading">Language Flashcards</h1>
          <p className="page-subheading">
            Common Mandarin phrases for everyday travel use. Click a card to reveal the translation.
          </p>
        </div>

        <div className="flash-grid">
          {currentItems.map((phrase) => {
            const isFlipped = flippedCards[phrase.id];
            return (
              <div
                key={phrase.id}
                onClick={() => toggleCard(phrase.id)}
                className={`flash-card${isFlipped ? ' flipped' : ''}`}
              >
                <div className="flash-card-cat">{phrase.category}</div>
                {isFlipped ? (
                  <div className="fade-in">
                    <div className="flash-card-zh">{phrase.zh}</div>
                    <div className="flash-card-pinyin">{phrase.pinyin}</div>
                  </div>
                ) : (
                  <div className="flash-card-en fade-in">{phrase.en}</div>
                )}
              </div>
            );
          })}
        </div>

        {/* --- Pagination UI Controls --- */}
        {totalPages > 1 && (
          <div className="pagination">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="pagination-btn"
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
                  className={`pagination-num${isActive ? ' active' : ''}`}
                >
                  {pageNum}
                </button>
              );
            })}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="pagination-btn"
            >
              Next →
            </button>
          </div>
        )}
      </div>
      </div>
    </div>
  );
}
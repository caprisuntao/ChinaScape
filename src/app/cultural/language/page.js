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
      <div className="detail-bar" style={{ padding: '0 32px' }}>
        <Link href="/cultural" className="detail-action">← Back to Cultural Guide</Link>
        <div style={{ padding: '14px 0', fontFamily: "'Noto Serif SC', serif", fontSize: 17, fontWeight: 700 }}>
          Language Flashcards
        </div>
      </div>

      {/* Main Content Area */}
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 32px' }}>
        <div style={{ marginBottom: '40px' }}>
          <h1 style={{ fontFamily: "'Noto Serif SC', serif", fontSize: '32px', color: '#3D2E1E', marginBottom: '8px' }}>
            Language Flashcards
          </h1>
          <p style={{ fontSize: '16px', color: '#7A6A58' }}>
            Common Mandarin phrases for everyday travel use. Click a card to reveal the translation.
          </p>
        </div>

        {/* Flashcard Grid (renders partitioned current items) */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', 
          gap: '20px',
          minHeight: '340px' // Keeps height relatively stable across page switches
        }}>
          {currentItems.map((phrase) => {
            const isFlipped = flippedCards[phrase.id];

            return (
              <div 
                key={phrase.id}
                onClick={() => toggleCard(phrase.id)}
                style={{
                  background: isFlipped ? '#B5271A' : '#FAF7F2',
                  border: isFlipped ? '1px solid #B5271A' : '1px solid #E8E0D4',
                  color: isFlipped ? '#FFFFFF' : '#3D2E1E',
                  borderRadius: '12px',
                  padding: '30px 20px',
                  minHeight: '160px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
                  position: 'relative'
                }}
              >
                {/* Category Label */}
                <div style={{
                  position: 'absolute',
                  top: '12px',
                  left: '12px',
                  fontSize: '11px',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  opacity: 0.6
                }}>
                  {phrase.category}
                </div>

                {isFlipped ? (
                  // Back of card (Chinese)
                  <div style={{ animation: 'fadeIn 0.3s' }}>
                    <div style={{ fontSize: '32px', fontFamily: "'Noto Serif SC', serif", fontWeight: 700, marginBottom: '8px' }}>
                      {phrase.zh}
                    </div>
                    <div style={{ fontSize: '16px', opacity: 0.9 }}>
                      {phrase.pinyin}
                    </div>
                  </div>
                ) : (
                  // Front of card (English)
                  <div style={{ fontSize: '18px', fontWeight: 600, animation: 'fadeIn 0.3s' }}>
                    {phrase.en}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* --- Pagination UI Controls --- */}
        {totalPages > 1 && (
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            gap: '8px', 
            marginTop: '40px' 
          }}>
            {/* Previous Button */}
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
                transition: 'all 0.2s'
              }}
            >
              ← Prev
            </button>

            {/* Page Numbers */}
            {Array.from({ length: totalPages }, (_, index) => {
              const pageNum = index + 1;
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
                    transition: 'all 0.2s'
                  }}
                >
                  {pageNum}
                </button>
              );
            })}

            {/* Next Button */}
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
                transition: 'all 0.2s'
              }}
            >
              Next →
            </button>
          </div>
        )}

        {/* CSS for the fade-in animation when flipping */}
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes fadeIn {
            from { opacity: 0; transform: scale(0.95); }
            to { opacity: 1; transform: scale(1); }
          }
        `}} />
      </div>
    </div>
  );
}
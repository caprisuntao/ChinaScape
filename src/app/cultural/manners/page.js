import Link from 'next/link';

export default function MannersPage() {
  return (
    <div className="screen active">
      {/* Navigation Top Bar */}
      <div className="detail-bar" style={{ padding: '0 32px' }}>
        <Link href="/cultural" className="detail-action">← Back to Cultural Guide</Link>
        <div style={{ padding: '14px 0', fontFamily: "'Noto Serif SC', serif", fontSize: 17, fontWeight: 700 }}>
          Etiquette Tips
        </div>
      </div>

      {/* Main Content Area */}
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 32px' }}>
        <div style={{ marginBottom: '40px' }}>
          <h1 style={{ fontFamily: "'Noto Serif SC', serif", fontSize: '32px', color: '#3D2E1E', marginBottom: '8px' }}>
            Etiquette Tips
          </h1>
          <p style={{ fontSize: '16px', color: '#7A6A58' }}>
            Customs, manners, and critical things to avoid when visiting China.
          </p>
        </div>

        {/* Content Layout Grid */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
          
          {/* Section 1: Dining */}
          <div style={{ background: '#FAF7F2', borderRadius: '12px', padding: '24px', border: '1px solid #E8E0D4' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#B5271A', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              🥢 Dining & Table Manners
            </h2>
            <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '12px', color: '#3D2E1E', lineHeight: '1.6' }}>
              <li>
                <strong>The Chopstick Taboo:</strong> Never stick your chopsticks vertically down into a bowl of rice. This mimics incense sticks used at funerals and is considered a terrible omen associated with death.
              </li>
              <li>
                <strong>Respecting Elders:</strong> When dining in a group, always wait for the oldest person or the host to pick up their utensils and start eating before you begin.
              </li>
              <li>
                <strong>Pouring Tea:</strong> If someone fills your tea cup, show appreciation by lightly tapping your index and middle fingers twice on the table near the cup. This is a traditional silent gesture of thanks.
              </li>
              <li>
                <strong>The Last Piece:</strong> It is polite to leave a tiny bit of food on the communal plates at the end of a meal. Clearing every single scrap can unintentionally imply that your host didn't provide enough food to fill you up.
              </li>
            </ul>
          </div>

          {/* Section 2: Drinking & Banquets */}
          <div style={{ background: '#FAF7F2', borderRadius: '12px', padding: '24px', border: '1px solid #E8E0D4' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#B5271A', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              🍻 Toasting & Drinking Culture
            </h2>
            <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '12px', color: '#3D2E1E', lineHeight: '1.6' }}>
              <li>
                <strong>Humility in Clinking:</strong> When clinking glasses for a toast, try to ensure the rim of your glass is physically *lower* than the rim of your host's or elder's glass. This is a deeply respected sign of modesty.
              </li>
              <li>
                <strong>Meaning of "Ganbei":</strong> When someone says *Gānbēi* (干杯), it literally translates to "dry glass." While you don't always have to chug your drink, it is expected that you take a generous sip after clinking.
              </li>
              <li>
                <strong>Reciprocal Toasting:</strong> If someone goes out of their way to toast you individually, make sure to find an opportunity later in the evening to return the favor by raising a glass to them.
              </li>
            </ul>
          </div>

          {/* Section 3: Social Customs */}
          <div style={{ background: '#FAF7F2', borderRadius: '12px', padding: '24px', border: '1px solid #E8E0D4' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#B5271A', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              🤝 Social Interactions & "Face"
            </h2>
            <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '12px', color: '#3D2E1E', lineHeight: '1.6' }}>
              <li>
                <strong>Understanding "Mianzi" (Face):</strong> Causing someone public embarrassment or aggressively arguing with service workers will cause them to "lose face." Always resolve misunderstandings calmly and politely.
              </li>
              <li>
                <strong>Two-Handed Respect:</strong> When handing over or receiving an object of value—such as your mobile phone, a business card, cash, or a gift—always use both hands.
              </li>
              <li>
                <strong>Greetings:</strong> A nod and a polite smile are standard greetings. Handshakes are common but tend to be gentler than western styles.
              </li>
              <li>
                <strong>Visiting Someone's Home:</strong> Always remove your shoes at the front doorway. Most hosts will immediately hand you a fresh pair of indoor slippers (*tuōxié*) to wear.
              </li>
            </ul>
          </div>

          {/* Section 4: Public Spaces & Technology */}
          <div style={{ background: '#FAF7F2', borderRadius: '12px', padding: '24px', border: '1px solid #E8E0D4' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#B5271A', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              📱 Public Spaces & Digital Culture
            </h2>
            <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '12px', color: '#3D2E1E', lineHeight: '1.6' }}>
              <li>
                <strong>Personal Space Expectations:</strong> China's cities are incredibly populous. In subway lines, train stations, and popular markets, pushing and bumping are common and not considered malicious. Don't take tight quarters or bustling crowds as personal offenses.
              </li>
              <li>
                <strong>Cashless Patience:</strong> While cash is legally required to be accepted, mobile apps (Alipay and WeChat Pay) dominate daily transactions. Be patient if vendors take a moment to look for change, as physical currency is rarely used by locals.
              </li>
              <li>
                <strong>Escalator Flow:</strong> When riding escalators in large hubs like Shanghai or Beijing, stand on the right side to let commuters who are in a rush walk past you on the left.
              </li>
            </ul>
          </div>

          {/* Section 5: Absolute Taboos */}
          <div style={{ background: '#FEF9E7', borderRadius: '12px', padding: '24px', border: '1px solid #C9960A' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#7B6000', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              ⚠️ What NOT to Do (Taboos)
            </h2>
            <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '12px', color: '#3D2E1E', lineHeight: '1.6' }}>
              <li>
                <strong>Do Not Tip:</strong> Tipping is not expected or customary in mainland China. In casual restaurants or taxis, leaving extra money might confuse staff or lead them to chase you down to return it.
              </li>
              <li>
                <strong>Gift Taboos:</strong> Avoid gifting clocks or umbrellas. The word for giving a clock (*sòng zhōng*) sounds identical to attending a funeral service, and umbrellas symbolize separation (*sǎn*).
              </li>
              <li>
                <strong>Temples & Thresholds:</strong> When visiting historical Buddhist or Taoist temples, do not step directly *on* the wooden raised thresholds of doorways. Always step cleanly over them.
              </li>
              <li>
                <strong>Sensitive Photography:</strong> Never take photos of military structures, police checkpoints, border areas, or government buildings. Inside temples, look out for "No Photography" signs, as taking pictures of specific sacred Buddha statues is strictly forbidden.
              </li>
            </ul>
          </div>

        </div>
      </div>
    </div>
  );
}
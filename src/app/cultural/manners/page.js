import Link from 'next/link';
import Reveal from '@/components/Reveal';

export default function MannersPage() {
  return (
    <>
      {/* Hero band */}
      <section className="bg-red">
        <div className="max-w-[1200px] mx-auto px-4 md:px-[60px] py-8 md:py-10">
          <Link href="/cultural" className="text-[12px] text-white/70 hover:text-white transition-colors duration-200">← Back to Cultural Guide</Link>
          <h1 className="font-display text-[26px] md:text-[32px] font-bold text-white mt-3">Etiquette Tips</h1>
          <p className="mt-2 text-sm text-white/75">Customs, manners, and critical things to avoid when visiting China.</p>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-[900px] mx-auto px-4 md:px-[32px] py-8 md:py-12">
        <div className="flex flex-col gap-[28px]">

          {/* Section 1: Dining */}
          <Reveal>
          <div className="bg-paper rounded-card p-6 border border-paper-dkr border-l-[3px] border-l-red">
            <h2 className="text-lg font-bold text-red mb-[14px]">Dining & Table Manners</h2>
            <ul className="pl-5 flex flex-col gap-3 text-ink-md leading-[1.6]">
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
                <strong>The Last Piece:</strong> It is polite to leave a tiny bit of food on the communal plates at the end of a meal. Clearing every single scrap can unintentionally imply that your host didn&rsquo;t provide enough food to fill you up.
              </li>
            </ul>
          </div>
          </Reveal>

          {/* Section 2: Drinking & Banquets */}
          <Reveal delay={80}>
          <div className="bg-paper rounded-card p-6 border border-paper-dkr border-l-[3px] border-l-red">
            <h2 className="text-lg font-bold text-red mb-[14px]">Toasting & Drinking Culture</h2>
            <ul className="pl-5 flex flex-col gap-3 text-ink-md leading-[1.6]">
              <li>
                <strong>Humility in Clinking:</strong> When clinking glasses for a toast, try to ensure the rim of your glass is physically *lower* than the rim of your host&rsquo;s or elder&rsquo;s glass. This is a deeply respected sign of modesty.
              </li>
              <li>
                <strong>Meaning of &ldquo;Ganbei&rdquo;:</strong> When someone says *Gānbēi* (干杯), it literally translates to &ldquo;dry glass.&rdquo; While you don&rsquo;t always have to chug your drink, it is expected that you take a generous sip after clinking.
              </li>
              <li>
                <strong>Reciprocal Toasting:</strong> If someone goes out of their way to toast you individually, make sure to find an opportunity later in the evening to return the favor by raising a glass to them.
              </li>
            </ul>
          </div>
          </Reveal>

          {/* Section 3: Social Customs */}
          <Reveal delay={160}>
          <div className="bg-paper rounded-card p-6 border border-paper-dkr border-l-[3px] border-l-red">
            <h2 className="text-lg font-bold text-red mb-[14px]">Social Interactions & &ldquo;Face&rdquo;</h2>
            <ul className="pl-5 flex flex-col gap-3 text-ink-md leading-[1.6]">
              <li>
                <strong>Understanding &ldquo;Mianzi&rdquo; (Face):</strong> Causing someone public embarrassment or aggressively arguing with service workers will cause them to &ldquo;lose face.&rdquo; Always resolve misunderstandings calmly and politely.
              </li>
              <li>
                <strong>Two-Handed Respect:</strong> When handing over or receiving an object of value—such as your mobile phone, a business card, cash, or a gift—always use both hands.
              </li>
              <li>
                <strong>Greetings:</strong> A nod and a polite smile are standard greetings. Handshakes are common but tend to be gentler than western styles.
              </li>
              <li>
                <strong>Visiting Someone&rsquo;s Home:</strong> Always remove your shoes at the front doorway. Most hosts will immediately hand you a fresh pair of indoor slippers (*tuōxié*) to wear.
              </li>
            </ul>
          </div>
          </Reveal>

          {/* Section 4: Public Spaces & Technology */}
          <Reveal delay={240}>
          <div className="bg-paper rounded-card p-6 border border-paper-dkr border-l-[3px] border-l-red">
            <h2 className="text-lg font-bold text-red mb-[14px]">Public Spaces & Digital Culture</h2>
            <ul className="pl-5 flex flex-col gap-3 text-ink-md leading-[1.6]">
              <li>
                <strong>Personal Space Expectations:</strong> China&rsquo;s cities are incredibly populous. In subway lines, train stations, and popular markets, pushing and bumping are common and not considered malicious. Don&rsquo;t take tight quarters or bustling crowds as personal offenses.
              </li>
              <li>
                <strong>Cashless Patience:</strong> While cash is legally required to be accepted, mobile apps (Alipay and WeChat Pay) dominate daily transactions. Be patient if vendors take a moment to look for change, as physical currency is rarely used by locals.
              </li>
              <li>
                <strong>Escalator Flow:</strong> When riding escalators in large hubs like Shanghai or Beijing, stand on the right side to let commuters who are in a rush walk past you on the left.
              </li>
            </ul>
          </div>
          </Reveal>

          {/* Section 5: Absolute Taboos */}
          <Reveal delay={320}>
          <div className="bg-gold-lt rounded-card p-6 border border-gold border-l-[3px] border-l-gold">
            <h2 className="text-lg font-bold text-gold-dk mb-[14px]">What NOT to Do (Taboos)</h2>
            <ul className="pl-5 flex flex-col gap-3 text-ink-md leading-[1.6]">
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
                <strong>Sensitive Photography:</strong> Never take photos of military structures, police checkpoints, border areas, or government buildings. Inside temples, look out for &ldquo;No Photography&rdquo; signs, as taking pictures of specific sacred Buddha statues is strictly forbidden.
              </li>
            </ul>
          </div>
          </Reveal>

        </div>
      </div>
    </>
  );
}

import Link from 'next/link';
import Image from 'next/image';
import Reveal from '@/components/Reveal';

export const metadata = {
  title: 'Cultural Guide | ChinaScape',
  description: 'Know before you go — etiquette, food, and language essentials for travelling in China.',
};

const cards = [
  {
    href: '/cultural/manners',
    title: 'Etiquette Tips',
    blurb: 'Customs, manners, and what to avoid when visiting China',
    img: 'https://images.unsplash.com/photo-1547981609-4b6bfe67ca0b?w=240&q=80',
    alt: '',
  },
  {
    href: '/cultural/food',
    title: 'Must-Try Food',
    blurb: 'Local dishes and the best nearby restaurants to try',
    img: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=240&q=80',
    alt: '',
  },
  {
    href: '/cultural/language',
    title: 'Language Flashcards',
    blurb: 'Common Mandarin phrases for everyday travel use',
    img: 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=240&q=80',
    alt: '',
  },
];

export default function CulturalPage() {
  return (
    <>
      {/* Hero band */}
      <section className="bg-red">
        <div className="max-w-[1200px] mx-auto px-4 md:px-12 py-12 md:py-14">
          <Link href="/" className="text-[12px] text-white/85 hover:text-white transition-colors duration-200">← Back to Home</Link>
          <h1 className="font-display text-page-title md:text-hero font-bold text-white mt-3">Cultural Guide</h1>
          <p className="mt-2 text-sm text-white/85">Know before you go — etiquette, food, and language essentials.</p>
        </div>
      </section>

      <div className="max-w-[1200px] mx-auto px-4 md:px-12 py-8 md:py-12">
        <div className="flex flex-col gap-4 max-w-[860px] mx-auto">

          {cards.map((card, i) => (
            <Reveal key={card.href} delay={i * 70}>
              <Link
                href={card.href}
                className="bg-white border border-paper-dkr rounded-card overflow-hidden cursor-pointer flex flex-col sm:flex-row sm:items-stretch transition-all duration-200 hover:border-red hover:-translate-y-[2px] hover:shadow-card-sm group"
              >
                <div className="w-full h-[140px] sm:h-auto sm:w-[160px] shrink-0 overflow-hidden">
                  <Image src={card.img} alt={card.alt} width={240} height={160} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                </div>
                <div className="px-4 py-5 flex-1 flex flex-col justify-center">
                  <div className="text-base font-bold text-ink tracking-[0.3px]">{card.title}</div>
                  <div className="text-[13px] text-ink-lt mt-1 leading-relaxed">{card.blurb}</div>
                </div>
                <div className="flex items-center px-4 text-ink-lt text-xl font-bold group-hover:text-red transition-colors" aria-hidden="true">›</div>
              </Link>
            </Reveal>
          ))}

        </div>
      </div>
    </>
  );
}

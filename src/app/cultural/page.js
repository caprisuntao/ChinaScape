import Link from 'next/link';
import Image from 'next/image';
import Reveal from '@/components/Reveal';

export default function CulturalPage() {
  return (
    <>
      {/* Hero band */}
      <section className="bg-red">
        <div className="max-w-[1200px] mx-auto px-4 md:px-[60px] py-8 md:py-10">
          <Link href="/" className="text-[12px] text-white/70 hover:text-white transition-colors duration-200">← Back to Home</Link>
          <h1 className="font-display text-[26px] md:text-[32px] font-bold text-white mt-3">Cultural Guide</h1>
          <p className="mt-2 text-sm text-white/75">Know before you go — etiquette, food, and language essentials.</p>
        </div>
      </section>

      <div className="max-w-[1200px] mx-auto px-4 md:px-[60px] py-8 md:py-12">
        <div className="flex flex-col gap-4 max-w-[860px] mx-auto">

          <Reveal>
            <Link href="/cultural/manners" className="bg-white border border-paper-dkr rounded-card overflow-hidden cursor-pointer flex items-stretch transition-all duration-200 hover:border-red hover:-translate-y-[2px] hover:shadow-card-sm group">
              <div className="w-[160px] shrink-0 overflow-hidden">
                <Image src="https://images.unsplash.com/photo-1547981609-4b6bfe67ca0b?w=240&q=80" alt="Etiquette" width={240} height={160} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
              </div>
              <div className="px-[22px] py-5 flex-1 flex flex-col justify-center">
                <div className="text-base font-bold text-ink tracking-[0.3px]">Etiquette Tips</div>
                <div className="text-[13px] text-ink-lt mt-[5px] leading-relaxed">Customs, manners, and what to avoid when visiting China</div>
              </div>
              <div className="flex items-center px-4 text-ink-xlt text-xl font-bold group-hover:text-red transition-colors">›</div>
            </Link>
          </Reveal>

          <Reveal delay={70}>
            <Link href="/cultural/food" className="bg-white border border-paper-dkr rounded-card overflow-hidden cursor-pointer flex items-stretch transition-all duration-200 hover:border-red hover:-translate-y-[2px] hover:shadow-card-sm group">
              <div className="w-[160px] shrink-0 overflow-hidden">
                <Image src="https://images.unsplash.com/photo-1563245372-f21724e3856d?w=240&q=80" alt="Food" width={240} height={160} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
              </div>
              <div className="px-[22px] py-5 flex-1 flex flex-col justify-center">
                <div className="text-base font-bold text-ink tracking-[0.3px]">Must-Try Food</div>
                <div className="text-[13px] text-ink-lt mt-[5px] leading-relaxed">Local dishes and the best nearby restaurants to try</div>
              </div>
              <div className="flex items-center px-4 text-ink-xlt text-xl font-bold group-hover:text-red transition-colors">›</div>
            </Link>
          </Reveal>

          <Reveal delay={140}>
            <Link href="/cultural/language" className="bg-white border border-paper-dkr rounded-card overflow-hidden cursor-pointer flex items-stretch transition-all duration-200 hover:border-red hover:-translate-y-[2px] hover:shadow-card-sm group">
              <div className="w-[160px] shrink-0 overflow-hidden">
                <Image src="https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=240&q=80" alt="Language" width={240} height={160} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
              </div>
              <div className="px-[22px] py-5 flex-1 flex flex-col justify-center">
                <div className="text-base font-bold text-ink tracking-[0.3px]">Language Flashcards</div>
                <div className="text-[13px] text-ink-lt mt-[5px] leading-relaxed">Common Mandarin phrases for everyday travel use</div>
              </div>
              <div className="flex items-center px-4 text-ink-xlt text-xl font-bold group-hover:text-red transition-colors">›</div>
            </Link>
          </Reveal>

        </div>
      </div>
    </>
  );
}

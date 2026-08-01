'use client'
import Image from 'next/image'
import { FALLBACK_IMG } from './constants'

export default function AttractionPicker({ dayNumber, attractions, search, onSearch, onSelect, onClose }) {
  const q = search.toLowerCase()
  const filtered = attractions.filter(a =>
    (a.name_en || '').toLowerCase().includes(q) ||
    (a.city?.name_en || '').toLowerCase().includes(q)
  )

  return (
    <div
      className="fixed inset-0 bg-ink/50 z-[200] flex items-center justify-center p-4"
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="bg-white rounded-[16px] w-full max-w-[620px] max-h-[85vh] sm:max-h-[75vh] flex flex-col overflow-hidden shadow-modal">
        {/* Header */}
        <div className="px-5 py-[18px] border-b border-paper-dk flex items-center justify-between">
          <span className="font-display text-[15px] font-bold">Add to Day {dayNumber}</span>
          <button onClick={onClose} className="bg-transparent border-0 text-xl text-ink-lt hover:text-red cursor-pointer transition-colors">×</button>
        </div>

        {/* Search */}
        <div className="px-5 py-3 border-b border-paper-dk">
          <input
            autoFocus
            value={search}
            onChange={e => onSearch(e.target.value)}
            placeholder="Search by name or city..."
            className="w-full px-4 py-2.5 border border-paper-dkr rounded-full text-[13px] outline-none focus:border-red transition-colors"
          />
        </div>

        {/* Grid body */}
        <div className="overflow-y-auto flex-1 px-5 py-4">
          {filtered.length === 0 ? (
            <div className="py-10 text-center text-ink-lt text-[13px]">No attractions match your search</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {filtered.map(a => (
                <button
                  key={a.attraction_id}
                  onClick={() => onSelect(a)}
                  className="flex items-center gap-3 bg-white border border-paper-dkr rounded-card p-3 text-left cursor-pointer transition-all duration-200 hover:border-red hover:-translate-y-[2px] hover:shadow-card-sm group"
                >
                  <div className="w-[60px] h-[60px] rounded-thumb overflow-hidden shrink-0">
                    <Image src={a.image_url || FALLBACK_IMG} alt={a.name_en} width={120} height={120} unoptimized onError={e => e.target.src = FALLBACK_IMG} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[13px] font-semibold text-ink group-hover:text-red transition-colors truncate">{a.name_en}</div>
                    <div className="text-[11px] text-ink-lt mt-[2px]">{a.name_zh}</div>
                    <div className="flex items-center gap-1.5 mt-[4px]">
                      <span className="text-[10px] text-ink-xlt">{a.city?.name_en}</span>
                      <span className="text-[10px] font-medium text-ink-md">· ¥{a.entrance_fee || 0}</span>
                    </div>
                  </div>
                  <span className="text-red font-bold text-lg group-hover:scale-110 transition-transform shrink-0">+</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

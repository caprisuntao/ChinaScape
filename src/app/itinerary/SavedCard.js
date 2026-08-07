'use client'
import Image from 'next/image'
import { FALLBACK_IMG } from './constants'

export default function SavedCard({ itinerary, onLoad, onDelete }) {
  const firstDayItems = itinerary.metadata?.days?.[0]?.items || []
  const previewImages = firstDayItems.slice(0, 3)
  const totalAttractions = itinerary.metadata?.days?.flatMap(d => d.items).length || 0
  const cities = [...new Set((itinerary.metadata?.days || []).map(d => d.city).filter(Boolean))]

  return (
    <div className="bg-white border border-paper-dkr rounded-card overflow-hidden transition-all duration-300 hover:border-red hover:-translate-y-1 hover:shadow-card">
      {/* Thumbnail strip */}
      <div className="flex h-[100px]">
        {previewImages.length > 0 ? (
          previewImages.map((item, i) => (
            <div key={i} className={`${i === 0 ? 'flex-[2]' : 'flex-1'} overflow-hidden ${i > 0 ? 'border-l-2 border-white' : ''}`}>
              <Image src={item.image || FALLBACK_IMG} alt={item.name} width={200} height={140} unoptimized onError={e => e.target.src = FALLBACK_IMG} className="w-full h-full object-cover" />
            </div>
          ))
        ) : (
          <div className="w-full h-full bg-paper-dk flex items-center justify-center">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 text-ink-xlt" aria-hidden="true">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="px-4 py-4">
        <div className="font-display text-h3 font-bold text-ink truncate">{itinerary.title}</div>
        <div className="flex items-center gap-3 mt-1.5 text-[11px] text-ink-lt flex-wrap">
          <span>{itinerary.duration_days} day{itinerary.duration_days !== 1 ? 's' : ''}</span>
          <span>·</span>
          <span>{totalAttractions} stop{totalAttractions !== 1 ? 's' : ''}</span>
          {cities.length > 0 && (<><span>·</span><span>{cities.join(', ')}</span></>)}
        </div>
        <div className="text-[11px] text-ink-lt mt-1.5">
          Saved {new Date(itinerary.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
        </div>

        <div className="flex gap-2 mt-4">
          <button
            onClick={() => onLoad(itinerary)}
            className="flex-1 bg-red text-white rounded-full py-2 text-xs font-semibold cursor-pointer border-0 hover:bg-red-dk transition-colors duration-200"
          >
            Load into Builder
          </button>
          <button
            onClick={() => onDelete(itinerary.itinerary_id)}
            aria-label={`Delete ${itinerary.title}`}
            className="bg-transparent border border-paper-dkr rounded-full px-3.5 py-2 text-xs text-ink-lt cursor-pointer hover:border-red hover:text-red transition-colors duration-200"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}

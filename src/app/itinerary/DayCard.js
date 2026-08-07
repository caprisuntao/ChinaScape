'use client'
import Image from 'next/image'
import { FALLBACK_IMG, toTimeInputValue } from './constants'

function ChevronIcon({ dir }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3" aria-hidden="true">
      {dir === 'up'
        ? <polyline points="6 15 12 9 18 15" />
        : <polyline points="6 9 12 15 18 9" />}
    </svg>
  )
}

export default function DayCard({
  day,
  dayIndex,
  canRemove,
  onRemoveDay,
  onAddAttraction,
  onRemoveItem,
  onUpdateTime,
  onUpdateCity,
  onMoveItem,
  onDragStart,
  onDragEnter,
  onDrop,
  onDragEnd,
  dragInfo,
  dragOverInfo,
}) {
  return (
    <div className="bg-white border border-paper-dkr rounded-card overflow-hidden shadow-subtle transition-shadow duration-300 hover:shadow-card-sm">
      {/* Header bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-red text-white">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <h3 className="font-display text-h3 font-bold text-white shrink-0">Day {day.day}</h3>
          <input
            value={day.city}
            onChange={e => onUpdateCity(dayIndex, e.target.value)}
            placeholder="City name"
            aria-label={`City for Day ${day.day}`}
            className="bg-white/15 border border-white/35 rounded-thumb px-2.5 py-1 text-white text-[12px] outline-none w-full max-w-[130px] min-w-0 placeholder:text-white/50 focus:bg-white/25 focus-visible:ring-2 focus-visible:ring-white/60 transition-colors"
          />
        </div>
        <div className="flex gap-1.5 shrink-0">
          <button
            onClick={() => onAddAttraction(dayIndex)}
            aria-label={`Add attraction to Day ${day.day}`}
            className="w-[34px] h-[34px] rounded-full border-2 border-white/60 flex items-center justify-center text-lg text-white bg-transparent hover:bg-white/20 transition-colors duration-200 cursor-pointer"
          >+</button>
          {canRemove && (
            <button
              onClick={() => onRemoveDay(dayIndex)}
              aria-label={`Remove Day ${day.day}`}
              className="w-[34px] h-[34px] rounded-full border-2 border-white/40 bg-transparent text-white text-base flex items-center justify-center hover:bg-white/20 transition-colors duration-200 cursor-pointer"
            >×</button>
          )}
        </div>
      </div>

      {/* Empty state */}
      {day.items.length === 0 ? (
        <div className="px-4 py-10 text-center">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-9 h-9 text-ink-xlt mb-3" aria-hidden="true">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          <p className="text-[13px] text-ink-lt mb-4">No attractions added yet</p>
          <button
            onClick={() => onAddAttraction(dayIndex)}
            className="inline-flex items-center gap-1.5 bg-red-xlt text-red-dk border border-red-lt rounded-full px-5 py-2 text-[12px] font-semibold hover:bg-red-lt transition-colors duration-200 cursor-pointer"
          >
            + Add your first stop
          </button>
        </div>
      ) : (
        day.items.map((item, itemIdx) => {
          const isDragging = dragInfo?.dayIdx === dayIndex && dragInfo?.itemIdx === itemIdx
          const isTarget = dragOverInfo?.dayIdx === dayIndex && dragOverInfo?.itemIdx === itemIdx
          return (
            <div
              key={item.id + itemIdx}
              draggable
              onDragStart={() => onDragStart(dayIndex, itemIdx)}
              onDragEnter={() => onDragEnter(dayIndex, itemIdx)}
              onDragOver={e => e.preventDefault()}
              onDrop={e => { e.preventDefault(); onDrop(dayIndex, itemIdx) }}
              onDragEnd={onDragEnd}
              className={`flex items-center gap-2 px-4 py-3 border-b border-paper-dk last:border-b-0 transition-colors duration-150 hover:bg-paper ${isDragging ? 'opacity-30 scale-[0.98]' : 'opacity-100'} ${isTarget ? 'ring-2 ring-red/50 ring-inset bg-red-xlt/40' : ''}`}
            >
              <span className="text-ink-xlt cursor-grab select-none p-1 min-w-[28px] flex justify-center" aria-hidden="true" title="Drag to reorder">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                  <circle cx="9" cy="5" r="1.4" />
                  <circle cx="15" cy="5" r="1.4" />
                  <circle cx="9" cy="12" r="1.4" />
                  <circle cx="15" cy="12" r="1.4" />
                  <circle cx="9" cy="19" r="1.4" />
                  <circle cx="15" cy="19" r="1.4" />
                </svg>
              </span>
              <div className="flex flex-col shrink-0">
                <button
                  onClick={() => onMoveItem(dayIndex, itemIdx, -1)}
                  disabled={itemIdx === 0}
                  aria-label={`Move ${item.name} up`}
                  className="w-6 h-5 flex items-center justify-center text-ink-lt hover:text-red disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer bg-transparent border-0 p-0 transition-colors"
                >
                  <ChevronIcon dir="up" />
                </button>
                <button
                  onClick={() => onMoveItem(dayIndex, itemIdx, 1)}
                  disabled={itemIdx === day.items.length - 1}
                  aria-label={`Move ${item.name} down`}
                  className="w-6 h-5 flex items-center justify-center text-ink-lt hover:text-red disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer bg-transparent border-0 p-0 transition-colors"
                >
                  <ChevronIcon dir="down" />
                </button>
              </div>
              <div className="w-11 h-11 rounded-thumb overflow-hidden shrink-0">
                <Image src={item.image} alt="" width={120} height={90} unoptimized onError={e => e.target.src = FALLBACK_IMG} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[13px] font-semibold text-ink truncate">{item.name}</div>
                <div className="text-[11px] text-ink-lt">{item.name_zh} · ¥{item.fee}</div>
              </div>
              <input
                type="time"
                value={toTimeInputValue(item.time)}
                onChange={e => onUpdateTime(dayIndex, itemIdx, e.target.value)}
                aria-label={`Time for ${item.name}`}
                className="border border-paper-dkr rounded-thumb px-2 py-1.5 text-[12px] text-ink-md outline-none bg-paper w-[95px] focus:border-red focus-visible:ring-2 focus-visible:ring-red/40 transition-colors"
              />
              <button
                onClick={() => onRemoveItem(dayIndex, itemIdx)}
                aria-label={`Remove ${item.name}`}
                className="bg-transparent border-0 text-ink-xlt hover:text-red cursor-pointer text-lg p-1 leading-none transition-colors duration-150"
              >×</button>
            </div>
          )
        })
      )}
    </div>
  )
}

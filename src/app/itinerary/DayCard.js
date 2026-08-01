'use client'
import Image from 'next/image'
import { FALLBACK_IMG, toTimeInputValue } from './constants'

export default function DayCard({
  day,
  dayIndex,
  canRemove,
  onRemoveDay,
  onAddAttraction,
  onRemoveItem,
  onUpdateTime,
  onUpdateCity,
  onDragStart,
  onDragOver,
  onDragEnd,
  dragInfo,
}) {
  return (
    <div className="bg-white border border-paper-dkr rounded-card overflow-hidden shadow-subtle transition-shadow duration-300 hover:shadow-card-sm">
      {/* Header bar */}
      <div className="flex items-center justify-between px-[18px] py-[14px] bg-red text-white">
        <div className="flex items-center gap-[10px] flex-1">
          <h3 className="font-display text-[15px] font-bold text-white">Day {day.day}</h3>
          <input
            value={day.city}
            onChange={e => onUpdateCity(dayIndex, e.target.value)}
            placeholder="City name"
            className="bg-white/15 border border-white/35 rounded-md px-[10px] py-[4px] text-white text-[12px] outline-none w-[130px] placeholder:text-white/50 focus:bg-white/25 transition-colors"
          />
        </div>
        <div className="flex gap-1.5">
          <button
            onClick={() => onAddAttraction(dayIndex)}
            className="w-[34px] h-[34px] rounded-full border-2 border-white/60 flex items-center justify-center text-lg text-white bg-transparent hover:bg-white/20 transition-colors duration-200 cursor-pointer"
            title="Add attraction"
          >+</button>
          {canRemove && (
            <button
              onClick={() => onRemoveDay(dayIndex)}
              className="w-[34px] h-[34px] rounded-full border-2 border-white/40 bg-transparent text-white text-base flex items-center justify-center hover:bg-white/20 transition-colors duration-200 cursor-pointer"
              title="Remove day"
            >×</button>
          )}
        </div>
      </div>

      {/* Empty state */}
      {day.items.length === 0 ? (
        <div className="px-[18px] py-10 text-center">
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
        day.items.map((item, itemIdx) => (
          <div
            key={item.id + itemIdx}
            draggable
            onDragStart={() => onDragStart(dayIndex, itemIdx)}
            onDragOver={e => onDragOver(e, dayIndex, itemIdx)}
            onDragEnd={onDragEnd}
            className={`flex items-center gap-3 px-[18px] py-[15px] border-b border-paper-dk last:border-b-0 transition-colors duration-150 hover:bg-paper cursor-grab active:cursor-grabbing ${dragInfo?.dayIdx === dayIndex && dragInfo?.itemIdx === itemIdx ? 'opacity-30 scale-[0.98]' : 'opacity-100'}`}
          >
            <span className="text-ink-xlt cursor-grab select-none p-1 min-w-[28px] flex justify-center" title="Drag to reorder">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4" aria-hidden="true">
                <circle cx="9" cy="5" r="1.4" />
                <circle cx="15" cy="5" r="1.4" />
                <circle cx="9" cy="12" r="1.4" />
                <circle cx="15" cy="12" r="1.4" />
                <circle cx="9" cy="19" r="1.4" />
                <circle cx="15" cy="19" r="1.4" />
              </svg>
            </span>
            <div className="w-11 h-11 rounded-thumb overflow-hidden shrink-0">
              <Image src={item.image} alt={item.name} width={120} height={90} unoptimized onError={e => e.target.src = FALLBACK_IMG} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[13px] font-semibold text-ink truncate">{item.name}</div>
              <div className="text-[11px] text-ink-lt">{item.name_zh} · ¥{item.fee}</div>
            </div>
            <input
              type="time"
              value={toTimeInputValue(item.time)}
              onChange={e => onUpdateTime(dayIndex, itemIdx, e.target.value)}
              className="border border-paper-dkr rounded-md px-2 py-[5px] text-[12px] text-ink-md outline-none bg-paper w-[95px] focus:border-red transition-colors"
            />
            <button
              onClick={() => onRemoveItem(dayIndex, itemIdx)}
              className="bg-transparent border-0 text-ink-xlt hover:text-red cursor-pointer text-lg p-1 leading-none transition-colors duration-150"
              title="Remove"
            >×</button>
          </div>
        ))
      )}
    </div>
  )
}

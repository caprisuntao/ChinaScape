export const FALLBACK_IMG = 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=120&q=70'

// Convert any time format to HH:MM for <input type="time">
export function toTimeInputValue(time) {
  if (!time) return '09:00'
  // Already in HH:MM 24-hour format
  if (/^\d{1,2}:\d{2}$/.test(time)) {
    return time.padStart(5, '0')
  }
  // Parse 12-hour format like "7:00 AM" or "1:30 PM"
  const match = time.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i)
  if (match) {
    let h = parseInt(match[1])
    const m = match[2]
    if (match[3].toUpperCase() === 'PM' && h !== 12) h += 12
    if (match[3].toUpperCase() === 'AM' && h === 12) h = 0
    return `${h.toString().padStart(2, '0')}:${m}`
  }
  return '09:00'
}

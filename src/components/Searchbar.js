'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function SearchBar({ fullWidth = false }) {
  const [term, setTerm] = useState('')
  const router = useRouter()

  const handleSearch = (e) => {
    e.preventDefault()
    if (term.trim()) {
      // Redirects to /attractions with the query in the URL
      router.push(`/attractions?query=${encodeURIComponent(term)}`)
    }
  }

  return (
    <form
      onSubmit={handleSearch}
      role="search"
      className={`flex items-center bg-paper border border-paper-dkr rounded-full overflow-hidden h-9 ${fullWidth ? 'w-full' : ''}`}
    >
      <input
        type="text"
        placeholder="Search attractions..."
        aria-label="Search attractions"
        value={term}
        onChange={(e) => setTerm(e.target.value)}
        className={`border-0 outline-none bg-transparent px-3.5 text-[13px] text-ink placeholder:text-ink-xlt focus-visible:ring-2 focus-visible:ring-red/40 ${fullWidth ? 'w-full flex-1' : 'w-[200px]'}`}
      />
      <button type="submit" className="bg-red text-white border-0 px-4 h-9 text-[13px] font-medium cursor-pointer rounded-r-full shrink-0">
        Search
      </button>
    </form>
  )
}

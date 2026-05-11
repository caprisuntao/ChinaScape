'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function SearchBar() {
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
    <form onSubmit={handleSearch} className="search-wrap">
      <input 
        type="text" 
        placeholder="Search attractions..." 
        value={term}
        onChange={(e) => setTerm(e.target.value)}
      />
      <button type="submit">Search</button>
    </form>
  )
}
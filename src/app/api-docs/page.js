'use client'
import { useEffect, useState } from 'react'
import SwaggerUI from 'swagger-ui-react'
import 'swagger-ui-react/swagger-ui.css'
import Link from 'next/link'

export default function ApiDocs() {
  const [spec, setSpec] = useState(null)

  useEffect(() => {
    fetch('/api/docs')
      .then(res => res.json())
      .then(data => setSpec(data))
  }, [])

  return (
    <>
      {/* Hero band */}
      <section className="bg-red">
        <div className="max-w-[1200px] mx-auto px-4 md:px-[60px] py-8 md:py-10">
          <Link href="/" className="text-[12px] text-white/70 hover:text-white transition-colors duration-200">← Back to Home</Link>
          <h1 className="font-display text-[26px] md:text-[32px] font-bold text-white mt-3">API Documentation</h1>
          <p className="mt-2 text-sm text-white/75">Explore the ChinaScape API — endpoints, parameters, and examples.</p>
        </div>
      </section>

      <div className="max-w-[1200px] mx-auto px-4 md:px-[60px] py-8">
        {!spec ? (
          <div className="text-center py-[60px] text-ink-lt">Loading API docs...</div>
        ) : (
          <SwaggerUI spec={spec} />
        )}
      </div>
    </>
  )
}

'use client'
import { useEffect, useState } from 'react'
import SwaggerUI from 'swagger-ui-react'
import 'swagger-ui-react/swagger-ui.css'

export default function ApiDocs() {
  const [spec, setSpec] = useState(null)

  useEffect(() => {
    fetch('/api/docs')
      .then(res => res.json())
      .then(data => setSpec(data))
  }, [])

  if (!spec) return <div style={{ padding: 40 }}>Loading API docs...</div>

  return <SwaggerUI spec={spec} />
}
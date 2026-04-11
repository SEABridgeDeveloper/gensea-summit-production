'use client'

import { useEffect } from 'react'

export default function VisitTracker() {
  useEffect(() => {
    // Only track once per session
    if (sessionStorage.getItem('visited')) return
    sessionStorage.setItem('visited', '1')

    fetch('/api/track-visit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        page: window.location.pathname,
        referrer: document.referrer,
        userAgent: navigator.userAgent,
      }),
    }).catch(() => {
      // Silently fail — never break the site for tracking
    })
  }, [])

  return null
}

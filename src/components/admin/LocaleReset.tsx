'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

/**
 * Ensures the admin always opens with the default locale (English).
 * Tok Pisin content editing can still be accessed by switching manually.
 */
export function LocaleReset() {
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const locale = searchParams.get('locale')
    if (locale && locale !== 'en') {
      const url = new URL(window.location.href)
      url.searchParams.set('locale', 'en')
      router.replace(url.pathname + url.search)
    }
  }, [])

  return null
}

'use client'

import { usePathname, useSearchParams, useRouter } from 'next/navigation'

export function LangSwitcher({ currentLocale }: { currentLocale: string }) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const router = useRouter()

  const switchTo = currentLocale === 'en' ? 'tpi' : 'en'
  const label    = currentLocale === 'en' ? 'Tok Pisin' : 'English'

  const handleSwitch = () => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('locale', switchTo)
    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <button
      onClick={handleSwitch}
      aria-label={`Switch to ${label}`}
      style={{
        fontSize: 12, fontWeight: 700, padding: '7px 14px', borderRadius: 4,
        background: '#FF9900', color: '#000716',
        border: '1px solid #CC7A00', cursor: 'pointer', whiteSpace: 'nowrap',
        transition: 'background 0.1s',
      }}
    >
      {label}
    </button>
  )
}

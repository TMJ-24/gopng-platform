'use client'

import { usePathname, useSearchParams, useRouter } from 'next/navigation'
import Button from '@mui/material/Button'

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
    <Button
      onClick={handleSwitch}
      aria-label={`Switch to ${label}`}
      disableElevation
      sx={{
        fontSize: 12, fontWeight: 700, px: 1.75, py: 0.875, borderRadius: 1,
        background: '#FF9900', color: '#000716',
        border: '1px solid #CC7A00', whiteSpace: 'nowrap',
        '&:hover': { background: '#E68A00', border: '1px solid #CC7A00' },
      }}
    >
      {label}
    </Button>
  )
}

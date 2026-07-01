'use client'

import type { ReactNode } from 'react'
import { SiteContext } from '@/context/SiteContext'
import type { Site } from '@/lib/tenant'

export function SiteProvider({ site, children }: { site: Site; children: ReactNode }) {
  return <SiteContext.Provider value={site}>{children}</SiteContext.Provider>
}

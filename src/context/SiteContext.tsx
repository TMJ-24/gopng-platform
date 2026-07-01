'use client'

import { createContext, useContext } from 'react'
import type { Site } from '@/lib/tenant'

export const SiteContext = createContext<Site | null>(null)

export function useSite(): Site | null {
  return useContext(SiteContext)
}

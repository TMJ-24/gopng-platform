'use client'

import { useSite } from '@/context/SiteContext'
import { PortalHomepage }   from '@/components/homepages/PortalHomepage'
import { MinistryHomepage } from '@/components/homepages/MinistryHomepage'

const HOMEPAGE_REGISTRY: Record<string, React.ComponentType> = {
  ministry: MinistryHomepage,
}

export default function HomePage() {
  const site = useSite()
  if (!site) return null

  const category = (site as any).template?.category as string | undefined
  const Homepage = (category && HOMEPAGE_REGISTRY[category]) || PortalHomepage

  return <Homepage />
}

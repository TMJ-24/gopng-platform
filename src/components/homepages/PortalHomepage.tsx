'use client'

import { useSite } from '@/context/SiteContext'
import { HeroSection }      from '@/components/sections/HeroSection'
import { ServicesSection }  from '@/components/sections/ServicesSection'
import { StatsSection }     from '@/components/sections/StatsSection'
import { NewsSection }      from '@/components/sections/NewsSection'
import { DirectorySection } from '@/components/sections/DirectorySection'
import { OpenDataSection }  from '@/components/sections/OpenDataSection'
import { AboutSection }     from '@/components/sections/AboutSection'
import { CTASection }       from '@/components/sections/CTASection'

type SectionType = 'hero' | 'services' | 'stats' | 'news' | 'directory' | 'opendata' | 'about' | 'cta'

const SECTION_REGISTRY: Record<SectionType, React.ComponentType> = {
  hero:      HeroSection,
  services:  ServicesSection,
  stats:     StatsSection,
  news:      NewsSection,
  directory: DirectorySection,
  opendata:  OpenDataSection,
  about:     AboutSection,
  cta:       CTASection,
}

// Default section order when no template is assigned
const DEFAULT_SECTIONS: { type: SectionType; enabled: boolean }[] = [
  { type: 'hero',      enabled: true },
  { type: 'services',  enabled: true },
  { type: 'stats',     enabled: true },
  { type: 'news',      enabled: true },
  { type: 'directory', enabled: true },
  { type: 'opendata',  enabled: true },
  { type: 'cta',       enabled: true },
]

/**
 * Shared fallback homepage — composes the generic section library from the
 * assigned template's `sections` list. Used by every agency category that
 * doesn't yet have its own bespoke homepage (see HOMEPAGE_REGISTRY).
 */
export function PortalHomepage() {
  const site = useSite()

  if (!site) return null

  // Read sections from the assigned template; fall back to defaults
  const templateSections = (site as any).template?.sections as { type: SectionType; enabled: boolean }[] | undefined
  const sections = templateSections?.length ? templateSections : DEFAULT_SECTIONS

  return (
    <>
      {sections
        .filter(s => s.enabled !== false)
        .map(s => {
          const Component = SECTION_REGISTRY[s.type]
          return Component ? <Component key={s.type} /> : null
        })}
    </>
  )
}

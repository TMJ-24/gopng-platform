'use client'

import { MinistryHero }       from './ministry/MinistryHero'
import { MinistryMandate }    from './ministry/MinistryMandate'
import { MinistryPolicyNews } from './ministry/MinistryPolicyNews'
import { MinistryDocuments }  from './ministry/MinistryDocuments'
import { MinistryCTA }        from './ministry/MinistryCTA'

/**
 * Bespoke, fixed-structure homepage for the Ministry Website template.
 * Unlike PortalHomepage, this isn't section-toggle driven — the layout
 * itself is the "standard design"; DTOs customise the content within it
 * (site name, news, documents) rather than the structure.
 */
export function MinistryHomepage() {
  return (
    <>
      <MinistryHero />
      <MinistryMandate />
      <MinistryPolicyNews />
      <MinistryDocuments />
      <MinistryCTA />
    </>
  )
}

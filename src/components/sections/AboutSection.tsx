'use client'

import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import Typography from '@mui/material/Typography'
import Stack from '@mui/material/Stack'
import { useSite } from '@/context/SiteContext'
import { BuildingIcon, MapPinIcon, PhoneIcon } from '@/components/Icons'

const AGENCY_TYPE_LABELS: Record<string, string> = {
  ministry: 'ministry',
  department: 'department',
  authority: 'statutory authority',
  commission: 'commission',
  'statutory-body': 'statutory body',
  provincial: 'provincial government',
  soe: 'state-owned enterprise',
}

function FactCard({ Icon, label, value }: { Icon: React.ComponentType<{ size?: number; style?: React.CSSProperties }>; label: string; value: string }) {
  return (
    <Stack direction="row" spacing={1.5} sx={{ alignItems: 'flex-start', background: '#F2F3F3', border: '1px solid #D5DBDB', borderRadius: 3, p: '14px 16px' }}>
      <Icon size={16} style={{ color: '#0972D3', flexShrink: 0, marginTop: 2 }} />
      <Box>
        <Typography sx={{ fontSize: 12, fontWeight: 700, color: '#000716' }}>{label}</Typography>
        <Typography sx={{ fontSize: 13, color: '#545B64', textTransform: label === 'Agency type' ? 'capitalize' : 'none' }}>{value}</Typography>
      </Box>
    </Stack>
  )
}

export function AboutSection() {
  const site = useSite()
  if (!site) return null

  const typeLabel = AGENCY_TYPE_LABELS[site.agencyType] ?? 'government agency'

  return (
    <Box component="section" sx={{ background: '#FFFFFF', borderBottom: '1px solid #D5DBDB' }}>
      <Box sx={{ maxWidth: 1280, mx: 'auto', px: 3, py: 7, display: 'flex', flexWrap: 'wrap', gap: 5 }}>

        {/* Mandate copy */}
        <Box sx={{ flex: '1 1 420px' }}>
          <Chip label="Our Mandate" size="small" sx={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#545B64', background: '#F2F3F3', border: '1px solid #D5DBDB', mb: 1.25 }} />
          <Typography component="h2" sx={{ fontSize: 'clamp(22px,3vw,30px)', fontWeight: 700, color: '#000716', mb: 2, letterSpacing: '-0.01em' }}>
            About {site.name}
          </Typography>
          <Typography sx={{ fontSize: 15, color: '#333333', lineHeight: 1.7, maxWidth: 560 }}>
            {site.name} is a {typeLabel} of the Government of Papua New Guinea, responsible for
            delivering policy, services and programmes within its mandate to the people of Papua
            New Guinea. This website is maintained as the official source of information, news and
            services for {site.name}.
          </Typography>
        </Box>

        {/* Quick facts */}
        <Box sx={{ flex: '1 1 280px', display: 'grid', gridTemplateColumns: '1fr', gap: 1.5, alignContent: 'start' }}>
          <FactCard Icon={BuildingIcon} label="Agency type" value={typeLabel} />
          {site.contactInfo?.address && <FactCard Icon={MapPinIcon} label="Address" value={site.contactInfo.address} />}
          {site.contactInfo?.phone && <FactCard Icon={PhoneIcon} label="Phone" value={site.contactInfo.phone} />}
        </Box>
      </Box>
    </Box>
  )
}

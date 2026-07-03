'use client'

import Link from 'next/link'
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import { BuildingIcon, BudgetIcon, DocumentIcon, HeartIcon, GraduationCapIcon, DatabaseIcon } from '@/components/Icons'

const OPEN_DATA = [
  { label: 'Census Data',         Icon: BuildingIcon },
  { label: 'National Budget',     Icon: BudgetIcon },
  { label: 'Economic Indicators', Icon: DatabaseIcon },
  { label: 'Health Statistics',   Icon: HeartIcon },
  { label: 'Education Data',      Icon: GraduationCapIcon },
  { label: 'Procurement Notices', Icon: DocumentIcon },
]

function DataCard({ label, Icon }: { label: string; Icon: React.ComponentType<{ size?: number; color?: string }> }) {
  return (
    <Stack
      direction="row"
      spacing={1.5}
      className="data-card"
      sx={{
        alignItems: 'center', p: '14px 16px', background: '#FFFFFF', border: '1px solid #D5DBDB', borderRadius: 1,
        boxShadow: '0 1px 2px rgba(0,28,36,0.06)', transition: 'all 0.12s',
        '&:hover': { borderColor: '#0972D3', boxShadow: '0 2px 8px rgba(9,114,211,0.12)' },
      }}
    >
      <Box className="data-card-icon" sx={{ flexShrink: 0, width: 34, height: 34, borderRadius: 1, background: '#232F3E', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.12s' }}>
        <Icon size={15} color="#FFFFFF" />
      </Box>
      <Typography className="data-card-label" sx={{ fontSize: 13, fontWeight: 600, color: '#000716', transition: 'color 0.12s' }}>
        {label}
      </Typography>
    </Stack>
  )
}

export function OpenDataSection() {
  return (
    <Box component="section" sx={{ background: '#F2F3F3', borderBottom: '1px solid #D5DBDB' }}>
      <Box sx={{ maxWidth: 1280, mx: 'auto', px: 3, py: 7 }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 6, alignItems: 'center' }}>

          {/* Left — copy */}
          <Box>
            <Chip label="Open Government" size="small" sx={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#545B64', background: '#FFFFFF', border: '1px solid #D5DBDB', mb: 1.25 }} />
            <Typography component="h2" sx={{ fontSize: 'clamp(22px,3vw,30px)', fontWeight: 700, color: '#000716', mb: 1.75, letterSpacing: '-0.01em' }}>
              Open Data &amp; Transparency
            </Typography>
            <Typography sx={{ fontSize: 14, color: '#545B64', lineHeight: 1.7, mb: 3, maxWidth: 440 }}>
              Access official government datasets — census data, national budget, economic
              indicators, health and education statistics. Supporting transparency, research,
              and informed decision-making for all Papua New Guineans.
            </Typography>
            <Stack direction="row" spacing={1.25} sx={{ flexWrap: 'wrap' }}>
              <Button component={Link} href="/publications?category=budget" disableElevation sx={{ px: 2.75, py: 1.25, background: '#0972D3', color: '#FFFFFF', fontSize: 14, fontWeight: 700, borderRadius: 1, border: '1px solid #0972D3', '&:hover': { background: '#075EA8' } }}>
                Browse Datasets →
              </Button>
              <Button component={Link} href="/publications" disableElevation sx={{ px: 2.75, py: 1.25, background: '#FFFFFF', color: '#000716', fontSize: 14, fontWeight: 700, borderRadius: 1, border: '1px solid #D5DBDB', '&:hover': { background: '#F2F3F3' } }}>
                All Publications
              </Button>
            </Stack>
          </Box>

          {/* Right — data cards grid */}
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.25 }}>
            {OPEN_DATA.map(({ label, Icon }) => (
              <DataCard key={label} label={label} Icon={Icon} />
            ))}
          </Box>
        </Box>
      </Box>
      <style>{`
        .data-card:hover .data-card-icon { background: #0972D3 !important; }
        .data-card:hover .data-card-label { color: #0972D3 !important; }
      `}</style>
    </Box>
  )
}

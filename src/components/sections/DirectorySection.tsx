'use client'

import Link from 'next/link'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardActionArea from '@mui/material/CardActionArea'
import Chip from '@mui/material/Chip'
import Typography from '@mui/material/Typography'
import Stack from '@mui/material/Stack'

const AGENCY_CATEGORIES = [
  { label: 'Ministries',            href: '/departments?type=ministry',   count: '35+', desc: 'National government ministries' },
  { label: 'Departments',           href: '/departments?type=department', count: '60+', desc: 'Government departments and offices' },
  { label: 'Provincial Govts',      href: '/departments?type=provincial', count: '22',  desc: 'All 22 provinces + AROB' },
  { label: 'Statutory Authorities', href: '/departments?type=authority',  count: '40+', desc: 'Independent statutory bodies' },
]

function AgencyCard({ label, href, count, desc }: typeof AGENCY_CATEGORIES[0]) {
  return (
    <Card
      variant="outlined"
      className="agency-card"
      sx={{
        borderRadius: 4, borderColor: '#D5DBDB', boxShadow: '0 1px 2px rgba(0,28,36,0.06)',
        transition: 'all 0.12s',
        '&:hover': { borderColor: '#0972D3', boxShadow: '0 2px 8px rgba(9,114,211,0.12)', background: '#F2F8FD' },
      }}
    >
      <CardActionArea component={Link} href={href} sx={{ p: '24px 20px' }}>
        <Typography className="agency-card-count" sx={{ fontSize: 36, fontWeight: 700, color: '#232F3E', letterSpacing: '-0.02em', lineHeight: 1, mb: 1, transition: 'color 0.12s' }}>
          {count}
        </Typography>
        <Typography sx={{ fontSize: 15, fontWeight: 700, color: '#000716', mb: 0.5 }}>{label}</Typography>
        <Typography sx={{ fontSize: 13, color: '#545B64', lineHeight: 1.5, mb: 1.75 }}>{desc}</Typography>
        <Typography className="agency-card-cta" sx={{ fontSize: 12, fontWeight: 700, color: '#8D99A8', transition: 'color 0.12s' }}>Browse →</Typography>
      </CardActionArea>
    </Card>
  )
}

export function DirectorySection() {
  return (
    <Box component="section" sx={{ background: '#F2F3F3', borderBottom: '1px solid #D5DBDB' }}>
      <Box sx={{ maxWidth: 1280, mx: 'auto', px: 3, py: 7 }}>
        <Stack direction="row" sx={{ alignItems: 'flex-end', justifyContent: 'space-between', mb: 3.5, flexWrap: 'wrap', gap: 1 }}>
          <Box>
            <Chip label="Government Directory" size="small" sx={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#545B64', background: '#FFFFFF', border: '1px solid #D5DBDB', mb: 1.25 }} />
            <Typography component="h2" sx={{ fontSize: 'clamp(22px,3vw,30px)', fontWeight: 700, color: '#000716', letterSpacing: '-0.01em' }}>Find an Agency</Typography>
          </Box>
          <Typography component={Link} href="/departments" sx={{ fontSize: 13, fontWeight: 700, color: '#0972D3', textDecoration: 'none' }}>Browse all →</Typography>
        </Stack>

        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 1.5 }}>
          {AGENCY_CATEGORIES.map(cat => <AgencyCard key={cat.href} {...cat} />)}
        </Box>
      </Box>
      <style>{`
        .agency-card:hover .agency-card-count { color: #0972D3 !important; }
        .agency-card:hover .agency-card-cta { color: #0972D3 !important; }
      `}</style>
    </Box>
  )
}

'use client'

import Link from 'next/link'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardActionArea from '@mui/material/CardActionArea'
import Chip from '@mui/material/Chip'
import Typography from '@mui/material/Typography'
import Stack from '@mui/material/Stack'
import {
  BuildingIcon, BudgetIcon, FormIcon,
  PassportIcon, GraduationCapIcon, HeartIcon, MapPinIcon, BriefcaseIcon,
} from '@/components/Icons'

const CITIZEN_SERVICES = [
  { label: 'Apply for a Passport',    href: '/services/passport',     Icon: PassportIcon,      desc: 'New applications and renewals' },
  { label: 'Register a Business',     href: '/services/business',     Icon: BuildingIcon,      desc: 'Company registration and licensing' },
  { label: 'Pay Your Taxes',          href: '/services/tax',          Icon: BudgetIcon,        desc: 'IRC tax payments and filings' },
  { label: 'Apply for Scholarships',  href: '/services/scholarships', Icon: GraduationCapIcon, desc: 'Higher education scholarships' },
  { label: 'Find Health Services',    href: '/services/health',       Icon: HeartIcon,         desc: 'Hospitals and health centres' },
  { label: 'Land Registration',       href: '/services/land',         Icon: MapPinIcon,        desc: 'Land titles and transfers' },
  { label: 'Employment',              href: '/services/employment',   Icon: BriefcaseIcon,     desc: 'Government job opportunities' },
  { label: 'Apply for Permits',       href: '/services/permits',      Icon: FormIcon,          desc: 'Licenses, permits and approvals' },
]

function ServiceCard({ label, href, Icon, desc }: typeof CITIZEN_SERVICES[0]) {
  return (
    <Card
      variant="outlined"
      className="service-card"
      sx={{
        borderRadius: 4, borderColor: '#D5DBDB', boxShadow: '0 1px 2px rgba(0,28,36,0.08)',
        transition: 'all 0.12s',
        '&:hover': { borderColor: '#0972D3', boxShadow: '0 2px 8px rgba(9,114,211,0.14)' },
      }}
    >
      <CardActionArea component={Link} href={href} sx={{ p: '20px 18px', alignItems: 'flex-start' }}>
        <Box
          className="service-card-icon"
          sx={{
            width: 40, height: 40, borderRadius: 1, mb: 1.75,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: '#F2F3F3', border: '1px solid #D5DBDB', transition: 'all 0.12s',
            'a:hover &': { background: '#0972D3', borderColor: '#0972D3' },
          }}
        >
          <Icon size={18} color="#545B64" />
        </Box>
        <Typography className="service-card-title" sx={{ fontWeight: 700, fontSize: 14, color: '#000716', mb: 0.5, lineHeight: 1.3, transition: 'color 0.12s' }}>
          {label}
        </Typography>
        <Typography sx={{ fontSize: 12, color: '#545B64', lineHeight: 1.5, mb: 1.5 }}>{desc}</Typography>
        <Typography className="service-card-cta" sx={{ fontSize: 12, fontWeight: 700, color: '#8D99A8', transition: 'color 0.12s' }}>Get started →</Typography>
      </CardActionArea>
    </Card>
  )
}

export function ServicesSection() {
  return (
    <Box component="section" sx={{ background: '#F2F3F3', borderBottom: '1px solid #D5DBDB' }}>
      <Box sx={{ maxWidth: 1280, mx: 'auto', px: 3, py: 7 }}>
        {/* Header */}
        <Stack direction="row" sx={{ alignItems: 'flex-end', justifyContent: 'space-between', mb: 3.5, flexWrap: 'wrap', gap: 1 }}>
          <Box>
            <Chip
              label="Citizen Services"
              size="small"
              sx={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#545B64', background: '#FFFFFF', border: '1px solid #D5DBDB', mb: 1.25 }}
            />
            <Typography component="h2" sx={{ fontSize: 'clamp(22px,3vw,30px)', fontWeight: 700, color: '#000716', letterSpacing: '-0.01em' }}>I Want To…</Typography>
          </Box>
          <Typography component={Link} href="/services" sx={{ fontSize: 13, fontWeight: 700, color: '#0972D3', textDecoration: 'none' }}>
            All services →
          </Typography>
        </Stack>

        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 1.5 }}>
          {CITIZEN_SERVICES.map((s) => <ServiceCard key={s.href} {...s} />)}
        </Box>
      </Box>
      <style>{`
        .service-card:hover .service-card-title { color: #0972D3 !important; }
        .service-card:hover .service-card-cta { color: #0972D3 !important; }
      `}</style>
    </Box>
  )
}

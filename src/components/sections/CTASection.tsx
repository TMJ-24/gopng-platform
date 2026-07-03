'use client'

import Link from 'next/link'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import { useSite } from '@/context/SiteContext'

export function CTASection() {
  const site = useSite()

  return (
    <Box component="section" sx={{ background: '#000000', borderTop: '1px solid #1a1a1a' }}>
      <Box sx={{ maxWidth: 1280, mx: 'auto', px: 3, py: 7 }}>
        <Stack
          direction="row"
          sx={{
            background: '#111111', border: '1px solid #2a2a2a', borderRadius: 4, p: 5,
            flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 3,
          }}
        >
          <Box sx={{ maxWidth: 520 }}>
            <Typography component="h2" sx={{ fontSize: 'clamp(20px,2.5vw,26px)', fontWeight: 700, color: '#FFFFFF', mb: 1.25, letterSpacing: '-0.01em' }}>
              Get in Touch with Government
            </Typography>
            <Typography sx={{ color: '#B0B0B0', fontSize: 14, lineHeight: 1.6 }}>
              Can&apos;t find what you need? Reach the relevant government office directly.
              {site?.contactInfo?.phone && (
                <> Call us at <Box component="a" href={`tel:${site.contactInfo.phone}`} sx={{ color: '#FF9900', fontWeight: 600 }}>{site.contactInfo.phone}</Box>.</>
              )}
            </Typography>
          </Box>

          <Stack direction="row" spacing={1.25} sx={{ flexWrap: 'wrap' }}>
            <Button
              component={Link}
              href="/contact"
              disableElevation
              sx={{ px: 2.75, py: 1.25, borderRadius: 1, background: '#FF9900', color: '#000716', fontSize: 14, fontWeight: 700, border: '1px solid #CC7A00', '&:hover': { background: '#CC7A00' } }}
            >
              Contact Government →
            </Button>
            <Button
              component={Link}
              href="/departments"
              disableElevation
              sx={{ px: 2.75, py: 1.25, borderRadius: 1, background: 'transparent', color: '#D5DBDB', fontSize: 14, fontWeight: 700, border: '1px solid #3a3a3a', '&:hover': { background: 'rgba(255,255,255,0.05)', color: '#FFFFFF', borderColor: '#666' } }}
            >
              Find an Agency
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Box>
  )
}

'use client'

import Link from 'next/link'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Stack from '@mui/material/Stack'
import IconButton from '@mui/material/IconButton'
import FacebookIcon from '@mui/icons-material/Facebook'
import XIcon from '@mui/icons-material/X'
import YouTubeIcon from '@mui/icons-material/YouTube'
import type { Site } from '@/lib/tenant'

const QUICK_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'About Us', href: '/about' },
  { label: 'News', href: '/news' },
  { label: 'Departments', href: '/departments' },
  { label: 'Publications', href: '/publications' },
  { label: 'Contact', href: '/contact' },
]

export function SiteFooter({ site }: { site: Site }) {
  const contact = site.contactInfo
  const social = site.socialLinks

  return (
    <Box component="footer" sx={{ background: '#000000', color: '#8D99A8', borderTop: '1px solid #1a1a1a' }}>
      {/* Main footer grid */}
      <Grid container spacing={4} sx={{ maxWidth: 1280, mx: 'auto', p: '48px 24px 32px' }}>

        {/* Brand */}
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Typography sx={{ fontWeight: 700, color: '#FFFFFF', fontSize: 16, mb: 1 }}>{site.name}</Typography>
          <Typography sx={{ fontSize: 13, color: '#8D99A8', lineHeight: 1.6, mb: 2 }}>
            Official government website of Papua New Guinea.
          </Typography>
          {social && (
            <Stack direction="row" spacing={1} sx={{ mt: 0.5 }}>
              {social.facebook && (
                <IconButton href={social.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook" size="small" sx={{ color: '#8D99A8', '&:hover': { color: '#FFFFFF' } }}>
                  <FacebookIcon fontSize="small" />
                </IconButton>
              )}
              {social.twitter && (
                <IconButton href={social.twitter} target="_blank" rel="noopener noreferrer" aria-label="X / Twitter" size="small" sx={{ color: '#8D99A8', '&:hover': { color: '#FFFFFF' } }}>
                  <XIcon fontSize="small" />
                </IconButton>
              )}
              {social.youtube && (
                <IconButton href={social.youtube} target="_blank" rel="noopener noreferrer" aria-label="YouTube" size="small" sx={{ color: '#8D99A8', '&:hover': { color: '#FFFFFF' } }}>
                  <YouTubeIcon fontSize="small" />
                </IconButton>
              )}
            </Stack>
          )}
        </Grid>

        {/* Quick Links */}
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Typography sx={{ fontWeight: 700, color: '#FFFFFF', fontSize: 13, mb: 1.75, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Quick Links</Typography>
          <Stack component="ul" spacing={1} sx={{ listStyle: 'none', p: 0, m: 0 }}>
            {QUICK_LINKS.map((l) => (
              <Box component="li" key={l.href}>
                <Typography component={Link} href={l.href} sx={{ color: '#8D99A8', textDecoration: 'none', fontSize: 13, transition: 'color 0.1s', '&:hover': { color: '#FFFFFF' } }}>
                  {l.label}
                </Typography>
              </Box>
            ))}
          </Stack>
        </Grid>

        {/* Contact */}
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Typography sx={{ fontWeight: 700, color: '#FFFFFF', fontSize: 13, mb: 1.75, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Contact</Typography>
          <Stack component="ul" spacing={1} sx={{ listStyle: 'none', p: 0, m: 0, fontSize: 13 }}>
            {contact?.email && (
              <Box component="li"><Typography component="a" href={`mailto:${contact.email}`} sx={{ color: '#8D99A8', textDecoration: 'none', fontSize: 13 }}>{contact.email}</Typography></Box>
            )}
            {contact?.phone && <Box component="li"><Typography sx={{ color: '#8D99A8', fontSize: 13 }}>{contact.phone}</Typography></Box>}
            {contact?.address && <Box component="li"><Typography sx={{ color: '#687078', whiteSpace: 'pre-line', lineHeight: 1.6, fontSize: 13 }}>{contact.address}</Typography></Box>}
            {contact?.poBox && <Box component="li"><Typography sx={{ color: '#8D99A8', fontSize: 13 }}>PO Box {contact.poBox}</Typography></Box>}
            {site.domain && !contact?.email && (
              <Box component="li"><Typography component="a" href={`https://${site.domain}`} sx={{ color: '#8D99A8', textDecoration: 'none', fontSize: 13 }}>{site.domain}</Typography></Box>
            )}
          </Stack>
        </Grid>
      </Grid>

      {/* Bottom bar */}
      <Box sx={{ borderTop: '1px solid #1a1a1a', p: '16px 24px', textAlign: 'center', fontSize: 12, color: '#687078', maxWidth: 1280, mx: 'auto' }}>
        © {new Date().getFullYear()} {site.name} · Government of Papua New Guinea ·{' '}
        <Typography component={Link} href="/sitemap.xml" sx={{ color: '#687078', textDecoration: 'none', fontSize: 12, display: 'inline' }}>Sitemap</Typography>
      </Box>
    </Box>
  )
}

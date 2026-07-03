'use client'

import Link from 'next/link'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import { useSite } from '@/context/SiteContext'
import { mediaUrl } from '@/lib/media'

export function HeroSection() {
  const site = useSite()

  if (!site) return null

  const heroSrc = mediaUrl(site.heroImage?.url)

  return (
    <Box component="section" sx={{ display: 'flex', minHeight: 420, overflow: 'hidden', flexDirection: { xs: 'column', md: 'row' } }}>

      {/* ── Left panel — pale hero background ────────── */}
      <Box sx={{
        flex: { xs: 'none', md: '0 0 50%' },
        width: { xs: '100%', md: 'auto' },
        background: '#F4E9F6',
        display: 'flex',
        alignItems: 'center',
        minHeight: { xs: 'auto', md: 'inherit' },
        py: { xs: '40px', md: 'clamp(40px, 6vw, 80px)' },
        pr: { xs: '20px', md: 'clamp(28px, 4vw, 56px)' },
        pl: { xs: '20px', md: 'max(24px, calc((100vw - 1280px) / 2 + 24px))' },
      }}>
        <Box sx={{ maxWidth: 480 }}>
          <Typography
            component="h1"
            sx={{
              fontSize: 'calc(1.475rem + 2.7vw)',
              fontWeight: 800,
              color: '#1a2b4a',
              lineHeight: 1.1,
              mb: 2.5,
              letterSpacing: '-0.02em',
            }}
          >
            {site.name}
          </Typography>
          <Typography sx={{ fontSize: 'clamp(1rem, 1.5vw, 1.25rem)', fontWeight: 400, color: '#555555', lineHeight: 1.6, mb: 4 }}>
            Official digital platform of the Papua New Guinea Government.
            Find news, services, publications and contact information.
          </Typography>
          <Button
            component={Link}
            href="/news"
            disableElevation
            sx={{
              display: 'inline-block', px: 3.25, py: 1.375,
              background: 'var(--color-primary, #CC0000)', color: '#ffffff',
              fontWeight: 700, fontSize: 14, borderRadius: '2px',
              border: '2px solid var(--color-primary, #CC0000)',
              '&:hover': { background: 'var(--color-primary, #CC0000)', opacity: 0.9 },
            }}
          >
            Read more
          </Button>
        </Box>
      </Box>

      {/* ── Right panel — hero photo ─────────────────── */}
      <Box sx={{
        flex: { xs: 'none', md: '0 0 50%' },
        width: { xs: '100%', md: 'auto' },
        position: 'relative',
        minHeight: { xs: 220, md: 320 },
      }}>
        {heroSrc ? (
          <>
            <Box
              component="img"
              src={heroSrc}
              alt=""
              aria-hidden="true"
              sx={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }}
            />
            <Box sx={{ position: 'absolute', inset: 0, background: 'rgba(10,20,40,0.45)' }} />
          </>
        ) : (
          <Box sx={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, var(--color-secondary, #1a3a6b) 0%, #0d2040 100%)' }}>
            <Box sx={{
              position: 'absolute', inset: 0,
              backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.06) 1px, transparent 0)',
              backgroundSize: '28px 28px',
            }} />
          </Box>
        )}
      </Box>
    </Box>
  )
}

'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import Box from '@mui/material/Box'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Drawer from '@mui/material/Drawer'
import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import Paper from '@mui/material/Paper'
import Fade from '@mui/material/Fade'
import Avatar from '@mui/material/Avatar'
import MenuIcon from '@mui/icons-material/Menu'
import CloseIcon from '@mui/icons-material/Close'
import SearchIcon from '@mui/icons-material/Search'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { LangSwitcher } from './LangSwitcher'
import { GovBanner } from './GovBanner'
import { mediaUrl } from '@/lib/media'
import type { Site } from '@/lib/tenant'

const DEFAULT_NAV = [
  { label: 'Home',         href: '/' },
  { label: 'About Us',     href: '/about' },
  { label: 'What We Do',   href: '/what-we-do' },
  { label: 'News',         href: '/news' },
  { label: 'Departments',  href: '/departments' },
  { label: 'Publications', href: '/publications' },
  { label: 'Contact',      href: '/contact' },
]

type NavChild = { label: string; href: string; description?: string; openInNewTab?: boolean }

export function SiteNav({ site, locale }: { site: Site; locale: string }) {
  const navLinks = site.navigation?.length ? site.navigation : DEFAULT_NAV
  const [menuOpen, setMenuOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const navRef = useRef<HTMLDivElement>(null)

  // Close dropdown on outside click or Escape
  useEffect(() => {
    if (!openDropdown) return
    const onClick = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) setOpenDropdown(null)
    }
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpenDropdown(null) }
    document.addEventListener('mousedown', onClick)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onClick)
      document.removeEventListener('keydown', onKey)
    }
  }, [openDropdown])

  const activeItem = navLinks.find((l) => l.href === openDropdown && (l as any).children?.length)
  const activeChildren = (activeItem as any)?.children as NavChild[] | undefined

  return (
    <Box component="header" sx={{ position: 'sticky', top: 0, zIndex: 50 }}>
      <GovBanner />

      {/* ── White nav bar ───────────────────────────── */}
      <AppBar
        ref={navRef}
        position="static"
        color="inherit"
        elevation={0}
        sx={{ background: '#ffffff', borderBottom: '1px solid #e0e0e0', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', position: 'relative' }}
      >
        <Toolbar disableGutters sx={{ maxWidth: 1280, width: '100%', mx: 'auto', px: 3, height: 64, minHeight: 64 }}>

          {/* Logo */}
          <Stack
            component={Link}
            href="/"
            direction="row"
            spacing={1.25}
            sx={{ alignItems: 'center', textDecoration: 'none', flexShrink: 0, mr: 'auto' }}
          >
            {site.logo?.url ? (
              <Box
                component="img"
                src={mediaUrl(site.logo.url)}
                alt={site.logo.alt ?? site.name}
                sx={{ width: 44, height: 44, objectFit: 'contain', borderRadius: 1, flexShrink: 0, display: 'block' }}
              />
            ) : (
              <Avatar variant="rounded" sx={{ width: 44, height: 44, borderRadius: 1, background: 'var(--color-primary, #CC0000)', fontSize: 14, fontWeight: 900 }}>
                {site.name.substring(0, 2).toUpperCase()}
              </Avatar>
            )}
            <Box>
              <Typography sx={{ fontWeight: 700, fontSize: 14, color: '#111111', lineHeight: 1.2, whiteSpace: 'nowrap' }}>{site.name}</Typography>
              {site.domain && (
                <Typography sx={{ fontSize: 10, color: '#888888', display: { xs: 'none', sm: 'block' } }}>{site.domain}</Typography>
              )}
            </Box>
          </Stack>

          {/* Nav links — desktop only, centred between logo and utilities */}
          <Box component="nav" aria-label="Main navigation" sx={{ flex: 1, display: { xs: 'none', md: 'flex' }, alignItems: 'center', justifyContent: 'center' }}>
            {navLinks.map((link) => {
              const children = (link as any).children as NavChild[] | undefined
              const hasChildren = !!children?.length
              const isOpen = openDropdown === link.href

              const linkSx = {
                fontSize: '1rem', fontWeight: 500,
                px: 1.75, height: 64, borderRadius: 0,
                whiteSpace: 'nowrap', position: 'relative',
                color: isOpen ? 'var(--color-primary, #CC0000)' : '#333333',
                '&::after': {
                  content: '""', position: 'absolute', bottom: 0, left: 14, right: 14, height: 3,
                  background: 'var(--color-primary, #CC0000)',
                  transform: isOpen ? 'scaleX(1)' : 'scaleX(0)',
                  transition: 'transform 0.15s ease',
                },
                '&:hover': { color: 'var(--color-primary, #CC0000)', background: 'none' },
                '&:hover::after': { transform: 'scaleX(1)' },
              } as const

              if (hasChildren) {
                return (
                  <Button
                    key={link.href}
                    onClick={() => setOpenDropdown(isOpen ? null : link.href)}
                    aria-expanded={isOpen}
                    endIcon={<ExpandMoreIcon sx={{ transition: 'transform 0.15s ease', transform: isOpen ? 'rotate(180deg)' : 'none' }} />}
                    sx={linkSx}
                  >
                    {link.label}
                  </Button>
                )
              }

              return (
                <Button
                  key={link.href}
                  component={Link}
                  href={link.href}
                  target={(link as any).openInNewTab ? '_blank' : undefined}
                  sx={linkSx}
                >
                  {link.label}
                </Button>
              )
            })}
          </Box>

          {/* Right utilities */}
          <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center', flexShrink: 0, ml: 2 }}>
            <IconButton component={Link} href="/search" aria-label="Search" sx={{ color: '#555555', '&:hover': { color: '#111111', background: '#f5f5f5' } }}>
              <SearchIcon fontSize="small" />
            </IconButton>
            <LangSwitcher currentLocale={locale} />

            {/* Hamburger button — mobile only */}
            <IconButton
              onClick={() => setMenuOpen(o => !o)}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
              sx={{ display: { xs: 'flex', md: 'none' }, color: '#333333' }}
            >
              {menuOpen ? <CloseIcon /> : <MenuIcon />}
            </IconButton>
          </Stack>
        </Toolbar>

        {/* Mega-menu dropdown — desktop, shown when a nav item with children is active */}
        <Fade in={!!activeItem}>
          <Paper
            square
            elevation={4}
            role="region"
            aria-label={activeItem ? `${activeItem.label} menu` : undefined}
            sx={{
              display: activeItem ? 'block' : 'none',
              position: 'absolute', top: '100%', left: 0, right: 0,
              borderTop: '1px solid #f0f0f0', zIndex: 1,
            }}
          >
            {activeItem && activeChildren && (
              <Box sx={{ maxWidth: 1280, mx: 'auto', p: '32px 24px 40px' }}>
                <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                  <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                    <Typography sx={{ fontSize: '1.25rem', fontWeight: 700, color: '#111111' }}>{activeItem.label}</Typography>
                    <ArrowForwardIcon sx={{ fontSize: 16, color: '#111111' }} />
                  </Stack>
                  <IconButton onClick={() => setOpenDropdown(null)} aria-label="Close menu" size="small" sx={{ color: '#555555' }}>
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </Stack>
                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '28px 40px' }}>
                  {activeChildren.map((child) => (
                    <Box
                      key={child.href}
                      component={Link}
                      href={child.href}
                      target={child.openInNewTab ? '_blank' : undefined}
                      onClick={() => setOpenDropdown(null)}
                      sx={{ textDecoration: 'none', display: 'block', '&:hover .dropdown-item-title': { color: 'var(--color-primary, #CC0000)' } }}
                    >
                      <Stack direction="row" spacing={0.75} className="dropdown-item-title" sx={{ alignItems: 'center', fontSize: '1rem', fontWeight: 700, color: '#111111', transition: 'color 0.1s' }}>
                        <span>{child.label}</span>
                        <ArrowForwardIcon sx={{ fontSize: 14 }} />
                      </Stack>
                      {child.description && (
                        <Typography sx={{ fontSize: '0.875rem', color: '#666666', mt: 0.75, lineHeight: 1.5 }}>
                          {child.description}
                        </Typography>
                      )}
                    </Box>
                  ))}
                </Box>
              </Box>
            )}
          </Paper>
        </Fade>
      </AppBar>

      {/* Mobile nav drawer */}
      <Drawer anchor="right" open={menuOpen} onClose={() => setMenuOpen(false)} sx={{ display: { xs: 'block', md: 'none' } }}>
        <Box sx={{ width: 300 }} role="presentation">
          <List component="nav" aria-label="Mobile navigation" disablePadding>
            {navLinks.map((link) => {
              const children = (link as any).children as NavChild[] | undefined
              return (
                <Box key={link.href}>
                  <ListItemButton
                    component={Link}
                    href={link.href}
                    target={(link as any).openInNewTab ? '_blank' : undefined}
                    onClick={() => setMenuOpen(false)}
                    sx={{
                      py: 1.75, px: 3, fontSize: '1rem', fontWeight: 500, color: '#333333',
                      borderBottom: children?.length ? 'none' : '1px solid #f0f0f0',
                      '&:hover': { color: 'var(--color-primary, #CC0000)', background: '#fafafa' },
                    }}
                  >
                    {link.label}
                  </ListItemButton>
                  {!!children?.length && (
                    <Box sx={{ borderBottom: '1px solid #f0f0f0', pb: 1 }}>
                      {children.map((child) => (
                        <ListItemButton
                          key={child.href}
                          component={Link}
                          href={child.href}
                          target={child.openInNewTab ? '_blank' : undefined}
                          onClick={() => setMenuOpen(false)}
                          sx={{
                            py: 1.25, pl: 5, pr: 3, fontSize: '0.9rem', fontWeight: 400, color: '#555555',
                            '&:hover': { color: 'var(--color-primary, #CC0000)', background: '#fafafa' },
                          }}
                        >
                          {child.label}
                        </ListItemButton>
                      ))}
                    </Box>
                  )}
                </Box>
              )
            })}
          </List>
        </Box>
      </Drawer>
    </Box>
  )
}

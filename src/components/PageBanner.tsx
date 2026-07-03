'use client'

import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import SearchIcon from '@mui/icons-material/Search'
import { Breadcrumbs } from './Breadcrumbs'

interface BreadcrumbItem { label: string; href?: string }

interface PageBannerProps {
  title: string
  subtitle?: string
  breadcrumbs?: BreadcrumbItem[]
  searchPlaceholder?: string
  aside?: React.ReactNode
}

export function PageBanner({ title, subtitle, breadcrumbs, searchPlaceholder, aside }: PageBannerProps) {
  return (
    <Box component="section" sx={{ background: '#F4E9F6', p: '40px 0 36px' }}>
      <Box sx={{ maxWidth: 1280, mx: 'auto', px: 3 }}>

        {breadcrumbs && (
          <Box sx={{ mb: 2 }}>
            <Breadcrumbs items={breadcrumbs} />
          </Box>
        )}

        <Typography
          component="h1"
          sx={{
            fontSize: 'calc(1.375rem + 1.5vw)',
            fontWeight: 800,
            color: '#1a2b4a',
            m: 0,
            mb: 1.25,
            letterSpacing: '-0.02em',
            lineHeight: 1.15,
          }}
        >
          {title}
        </Typography>

        {subtitle && (
          <Typography sx={{ fontSize: '1rem', fontWeight: 400, color: '#555555', mb: 3, lineHeight: 1.6, maxWidth: 640 }}>
            {subtitle}
          </Typography>
        )}

        {searchPlaceholder && (
          <TextField
            type="search"
            placeholder={searchPlaceholder}
            fullWidth
            sx={{
              maxWidth: 600, mt: subtitle ? 0 : 3,
              '& .MuiOutlinedInput-root': {
                background: '#ffffff', borderRadius: '6px',
                '& fieldset': { borderColor: 'var(--color-primary, #CC0000)', borderWidth: '1.5px' },
              },
            }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ fontSize: 18, color: '#888' }} />
                  </InputAdornment>
                ),
              },
            }}
          />
        )}

        {aside && (
          <Typography sx={{ fontSize: '0.875rem', color: '#777', mt: 1.5 }}>{aside}</Typography>
        )}
      </Box>
    </Box>
  )
}

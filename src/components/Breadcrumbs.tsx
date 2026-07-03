'use client'

import Link from 'next/link'
import MuiBreadcrumbs from '@mui/material/Breadcrumbs'
import Typography from '@mui/material/Typography'
import NavigateNextIcon from '@mui/icons-material/NavigateNext'

type Crumb = { label: string; href?: string }

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <MuiBreadcrumbs
      aria-label="Breadcrumb"
      separator={<NavigateNextIcon sx={{ fontSize: 14, color: '#aaa' }} />}
      sx={{ fontSize: '0.875rem' }}
    >
      {items.map((item, i) =>
        item.href ? (
          <Typography
            key={i}
            component={Link}
            href={item.href}
            sx={{ fontSize: '0.875rem', color: '#4a6fa5', textDecoration: 'none', fontWeight: 400, '&:hover': { textDecoration: 'underline' } }}
          >
            {item.label}
          </Typography>
        ) : (
          <Typography key={i} sx={{ fontSize: '0.875rem', color: '#555', fontWeight: 500 }}>
            {item.label}
          </Typography>
        ),
      )}
    </MuiBreadcrumbs>
  )
}

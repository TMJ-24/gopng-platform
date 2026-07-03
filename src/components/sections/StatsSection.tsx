'use client'

import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

const STATS = [
  { value: '9.7M+', label: 'Citizens Served' },
  { value: '22',    label: 'Provinces' },
  { value: '100+',  label: 'Government Agencies' },
  { value: '1975',  label: 'Year of Independence' },
]

export function StatsSection() {
  return (
    <Box component="section" sx={{ background: '#232F3E', borderTop: '2px solid #FF9900', borderBottom: '1px solid #1A2536' }}>
      <Box sx={{ maxWidth: 1280, mx: 'auto', px: 3, py: 6 }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }}>
          {STATS.map((s, i) => (
            <Box
              key={s.label}
              sx={{
                textAlign: 'center',
                py: 1,
                px: 3,
                borderLeft: i > 0 ? '1px solid rgba(255,255,255,0.1)' : 'none',
              }}
            >
              <Typography sx={{ fontSize: 'clamp(36px,4vw,52px)', fontWeight: 700, color: '#FF9900', letterSpacing: '-0.02em', lineHeight: 1, mb: 1 }}>
                {s.value}
              </Typography>
              <Typography sx={{ color: '#8D99A8', fontSize: 14, fontWeight: 500, letterSpacing: '0.01em' }}>{s.label}</Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  )
}

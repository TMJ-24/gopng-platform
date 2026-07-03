'use client'

import { useState } from 'react'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Collapse from '@mui/material/Collapse'
import Grid from '@mui/material/Grid'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import PublicOutlinedIcon from '@mui/icons-material/PublicOutlined'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import CloseIcon from '@mui/icons-material/Close'

const CONTAINER_SX = { maxWidth: 1280, mx: 'auto', px: 3 }

function GovIcon() {
  return (
    <Box component="svg" width={20} height={20} viewBox="0 0 20 20" fill="none" aria-hidden="true" sx={{ flexShrink: 0 }}>
      <circle cx="10" cy="10" r="9" fill="#CC0000" stroke="#CC0000" strokeWidth="0.5" />
      <circle cx="10" cy="10" r="9" fill="none" stroke="#FFD700" strokeWidth="1" />
      <path d="M10 4c0 0-2 3-2 6s2 6 2 6 2-3 2-6-2-6-2-6z" fill="#FFD700" />
      <path d="M4 10c0 0 3-2 6-2s6 2 6 2-3 2-6 2-6-2-6-2z" fill="#FFD700" />
    </Box>
  )
}

export function GovBanner() {
  const [open, setOpen] = useState(false)
  const [scamNoticeDismissed, setScamNoticeDismissed] = useState(false)

  return (
    <Box sx={{ background: '#f8f8f8', borderBottom: '1px solid #e0e0e0', fontSize: 12 }}>

      {/* ── Masthead bar ─────────────────────────────── */}
      <Stack direction="row" sx={{ ...CONTAINER_SX, py: 0.75, alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', rowGap: 0.5, columnGap: 1.5 }}>
        <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
          <GovIcon />
          <Typography sx={{ color: '#333333', fontWeight: 500, fontSize: 12 }}>
            An Official PNG Government Website
          </Typography>
        </Stack>
        <Button
          onClick={() => setOpen(o => !o)}
          aria-expanded={open}
          endIcon={<ExpandMoreIcon sx={{ transition: 'transform 0.2s', transform: open ? 'rotate(180deg)' : 'none' }} />}
          sx={{ color: '#0066cc', fontSize: 12, fontWeight: 600, textDecoration: 'underline', p: 0, minWidth: 0, '&:hover': { background: 'none', textDecoration: 'underline' } }}
        >
          How to identify
        </Button>
      </Stack>

      {/* ── Expanded info panel ───────────────────────── */}
      <Collapse in={open}>
        <Box sx={{ background: '#f0f4f8', borderTop: '1px solid #dde3ea' }}>
          <Grid container spacing={2.5} sx={{ ...CONTAINER_SX, py: 2.25 }}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Stack direction="row" spacing={1.75} sx={{ alignItems: 'flex-start' }}>
                <Box sx={{ width: 36, height: 36, borderRadius: '50%', border: '1px solid #aab4be', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <PublicOutlinedIcon sx={{ fontSize: 16, color: '#555' }} />
                </Box>
                <Box>
                  <Typography sx={{ fontWeight: 700, color: '#111', mb: 0.5, fontSize: 13, lineHeight: 1.4 }}>Official websites use .gov.pg</Typography>
                  <Typography sx={{ color: '#555', lineHeight: 1.6, fontSize: 12 }}>
                    A <Box component="strong" sx={{ color: '#111' }}>.gov.pg</Box> website belongs to an official PNG government ministry, department, or agency.
                  </Typography>
                </Box>
              </Stack>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Stack direction="row" spacing={1.75} sx={{ alignItems: 'flex-start' }}>
                <Box sx={{ width: 36, height: 36, borderRadius: '50%', border: '1px solid #2d7a2d', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <LockOutlinedIcon sx={{ fontSize: 16, color: '#2d7a2d' }} />
                </Box>
                <Box>
                  <Typography sx={{ fontWeight: 700, color: '#111', mb: 0.5, fontSize: 13, lineHeight: 1.4 }}>Secure websites use HTTPS</Typography>
                  <Typography sx={{ color: '#555', lineHeight: 1.6, fontSize: 12 }}>
                    Look for a <Box component="strong" sx={{ color: '#111' }}>lock icon</Box> or <Box component="strong" sx={{ color: '#111' }}>https://</Box> before sharing personal information.
                  </Typography>
                </Box>
              </Stack>
            </Grid>
          </Grid>
        </Box>
      </Collapse>

      {/* ── Scam warning notice ───────────────────────── */}
      <Collapse in={!scamNoticeDismissed}>
        <Box sx={{ background: '#EAF0FB', borderTop: '1px solid #D6E2F5' }}>
          <Stack direction="row" sx={{ ...CONTAINER_SX, py: 1.25, alignItems: 'flex-start', gap: 1.25 }}>
            <InfoOutlinedIcon sx={{ fontSize: 16, flexShrink: 0, color: '#333333', mt: 0.125 }} />
            <Box sx={{ flex: 1, color: '#1a1a1a', lineHeight: 1.6 }}>
              <Typography component="div" sx={{ fontSize: 12, lineHeight: 1.6 }}>Government officials will never ask you to transfer money or disclose bank log-in details over a phone call.</Typography>
              <Typography component="div" sx={{ fontSize: 12, lineHeight: 1.6 }}>Call the 24/7 ScamShield Helpline at 1799 if you are unsure if something is a scam.</Typography>
            </Box>
            <IconButton
              onClick={() => setScamNoticeDismissed(true)}
              aria-label="Dismiss scam warning"
              size="small"
              sx={{ color: '#333333', flexShrink: 0 }}
            >
              <CloseIcon sx={{ fontSize: 14 }} />
            </IconButton>
          </Stack>
        </Box>
      </Collapse>
    </Box>
  )
}

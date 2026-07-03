import { C } from './theme'

type Props = {
  label?: string
  aspectRatio?: string
  minHeight?: number
}

// No real photography exists for the platform's own marketing pages yet — this renders
// a clearly-labelled placeholder block (not a broken image) so content editors know
// exactly what to swap in later, and so the page still looks intentional in the meantime.
export function ImagePlaceholder({ label = 'Image placeholder', aspectRatio = '16 / 9', minHeight }: Props) {
  return (
    <div
      style={{
        aspectRatio,
        minHeight,
        background: C.bgAlt,
        border: `1px dashed ${C.border}`,
        borderRadius: 8,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        color: C.textMuted,
      }}
    >
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <path d="M21 15l-5-5L5 21" />
      </svg>
      <span style={{ fontSize: 13, fontWeight: 600, letterSpacing: '0.02em' }}>{label}</span>
    </div>
  )
}

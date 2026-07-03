type Props = { size?: number; style?: React.CSSProperties }

// Papua New Guinea's national flag: diagonal split — black (upper-left) bearing the
// five white stars of the Southern Cross, red (lower-right) bearing a gold raggiana
// bird-of-paradise in flight.
export function PngFlag({ size = 20, style }: Props) {
  const w = size * 1.5
  return (
    <svg width={w} height={size} viewBox="0 0 30 20" style={{ flexShrink: 0, borderRadius: 2, ...style }} aria-hidden="true">
      <rect width="30" height="20" fill="#CE1126" />
      <polygon points="0,0 30,0 0,20" fill="#000000" />

      {/* Southern Cross — four larger stars + one smaller, in the black triangle */}
      <g fill="#FFFFFF">
        <Star cx={6} cy={4} r={1.3} />
        <Star cx={11} cy={3} r={1.1} />
        <Star cx={13.5} cy={7} r={1.3} />
        <Star cx={9} cy={9} r={1.1} />
        <Star cx={4.5} cy={9.5} r={0.8} />
      </g>

      {/* Simplified bird-of-paradise silhouette in the red triangle */}
      <path
        d="M21 9c1.5-2.5 3.5-3.5 6-3.5-1 1-1.5 2-1.5 3 1.5 0 2.7.4 3.7 1.4-1.6.3-2.7 1-3.4 2 1.2.4 2 1.2 2.4 2.4-1.6-.5-2.9-.4-4 .3.6 1 .7 2 .3 3-1-1.3-2-1.9-3.2-1.9-1.5 2-3 3-5 3.3.6-1.3.8-2.5.6-3.7-1.4.7-2.6.6-3.6-.3 1.2-.5 2-1.2 2.4-2.2-1.3.1-2.3-.2-3-1 1.3-.2 2.2-.7 2.8-1.6-1.1-.3-1.8-1-2.2-2 1.3.2 2.3.6 3 1.3.3-1.2 1-2 2-2.5-.2 1.1-.1 2 .3 2.8.6-.5 1.2-.9 2.4-1.1z"
        fill="#FFC72C"
      />
    </svg>
  )
}

function Star({ cx, cy, r }: { cx: number; cy: number; r: number }) {
  const points = Array.from({ length: 5 }, (_, i) => {
    const outerAngle = (Math.PI * 2 * i) / 5 - Math.PI / 2
    const innerAngle = outerAngle + Math.PI / 5
    return [
      [cx + r * Math.cos(outerAngle), cy + r * Math.sin(outerAngle)],
      [cx + (r * 0.42) * Math.cos(innerAngle), cy + (r * 0.42) * Math.sin(innerAngle)],
    ]
  }).flat()
  return <polygon points={points.map(p => p.join(',')).join(' ')} />
}

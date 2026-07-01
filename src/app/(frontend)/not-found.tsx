import Link from 'next/link'

export default function NotFound() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', padding: '0 24px', textAlign: 'center' }}>
      <div style={{ fontSize: 96, fontWeight: 700, color: '#D5DBDB', lineHeight: 1, userSelect: 'none' }}>404</div>
      <h1 style={{ fontSize: 24, fontWeight: 700, color: '#000716', margin: '16px 0 0' }}>Page Not Found</h1>
      <p style={{ color: '#545B64', marginTop: 8, maxWidth: 400, lineHeight: 1.6 }}>
        The page you are looking for may have been moved or removed.
      </p>
      <Link
        href="/"
        style={{ marginTop: 24, display: 'inline-block', background: '#0972D3', color: '#FFFFFF', padding: '10px 24px', borderRadius: 4, fontSize: 14, fontWeight: 700, textDecoration: 'none', border: '1px solid #0972D3' }}
      >
        Back to Home
      </Link>
    </div>
  )
}

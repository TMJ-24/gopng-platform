import { headers } from 'next/headers'
import Link from 'next/link'
import { getSiteByDomain } from '@/lib/tenant'
import { searchContent } from '@/lib/api'
import { NewsIcon, DocumentIcon, BuildingIcon, PolicyIcon } from '@/components/Icons'

const QUICK_LINKS = [
  { label: 'Passport Services',      href: '/services/passport' },
  { label: 'Business Registration',  href: '/services/business' },
  { label: 'Pay Your Taxes',         href: '/services/tax' },
  { label: 'Apply for Scholarships', href: '/services/scholarships' },
  { label: 'Land Registration',      href: '/services/land' },
  { label: 'Find Health Services',   href: '/services/health' },
]

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const headersList = await headers()
  const domain = (headersList.get('host') ?? 'localhost:3000').replace(/:\d+$/, '')
  const site = await getSiteByDomain(domain)
  if (!site) return null

  const params = await searchParams
  const query = params.q?.trim() ?? ''
  const results = query ? await searchContent(site.id, query) : null
  const newsResults = results?.news ?? []
  const pageResults = results?.pages ?? []
  const totalResults = newsResults.length + pageResults.length

  return (
    <>
      {/* ── Hero search bar — dark navy ── */}
      <section style={{ background: '#232F3E', borderBottom: '2px solid #FF9900', padding: '48px 24px' }}>
        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#8D99A8', margin: '0 0 12px' }}>
            {site.name}
          </p>
          <h1 style={{ fontSize: 'clamp(24px,3.5vw,36px)', fontWeight: 700, color: '#FFFFFF', margin: '0 0 28px', letterSpacing: '-0.01em' }}>
            {query ? `Results for "${query}"` : 'Search'}
          </h1>

          <form method="GET" action="/search">
            <div style={{ display: 'flex', background: '#FFFFFF', borderRadius: 8, overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.3)' }}>
              <input
                name="q"
                defaultValue={query}
                type="search"
                placeholder="Search services, news, departments, publications…"
                autoFocus
                style={{ flex: 1, border: 'none', padding: '16px 20px', fontSize: 15, color: '#000716', background: 'transparent', outline: 'none' }}
              />
              <button
                type="submit"
                style={{ padding: '0 28px', background: '#0972D3', color: '#FFFFFF', fontSize: 14, fontWeight: 700, border: 'none', cursor: 'pointer', whiteSpace: 'nowrap', transition: 'background 0.1s' }}
              >
                Search
              </button>
            </div>
          </form>

          {/* Quick suggestions — only when no query */}
          {!query && (
            <div style={{ marginTop: 20 }}>
              <p style={{ fontSize: 12, color: '#8D99A8', margin: '0 0 10px' }}>Popular searches:</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {QUICK_LINKS.map(l => (
                  <a key={l.href} href={`/search?q=${encodeURIComponent(l.label)}`}
                    style={{ fontSize: 12, fontWeight: 600, color: '#D5DBDB', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', padding: '5px 12px', borderRadius: 20, textDecoration: 'none', transition: 'all 0.1s' }}>
                    {l.label}
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Result count */}
          {query && (
            <p style={{ fontSize: 13, color: '#8D99A8', marginTop: 16 }}>
              {totalResults} result{totalResults !== 1 ? 's' : ''} found
            </p>
          )}
        </div>
      </section>

      {/* ── Results area ── */}
      <div style={{ background: '#F2F3F3', minHeight: '40vh' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '40px 24px' }}>

          {!query && (
            /* No-query state: browse categories */
            <div>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: '#000716', margin: '0 0 20px' }}>Browse by category</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12 }}>
                {[
                  { label: 'News & Announcements', href: '/news',         Icon: NewsIcon,     desc: 'Latest government news and press releases' },
                  { label: 'Publications',          href: '/publications', Icon: DocumentIcon, desc: 'Official documents, reports and forms' },
                  { label: 'Departments',           href: '/departments',  Icon: BuildingIcon, desc: 'Ministries, departments and agencies' },
                  { label: 'About Government',      href: '/about',        Icon: PolicyIcon,   desc: 'Mission, values and structure' },
                ].map(({ label, href, Icon, desc }) => (
                  <Link key={href} href={href} style={{ display: 'block', background: '#FFFFFF', border: '1px solid #D5DBDB', borderRadius: 16, padding: '20px', textDecoration: 'none', transition: 'box-shadow 0.12s' }} className="search-cat-card">
                    <div style={{ width: 40, height: 40, borderRadius: 8, background: '#F2F3F3', border: '1px solid #D5DBDB', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
                      <Icon size={20} color="#545B64" />
                    </div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: '#000716', marginBottom: 4 }}>{label}</div>
                    <div style={{ fontSize: 12, color: '#545B64', lineHeight: 1.5 }}>{desc}</div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {results && totalResults === 0 && (
            <div style={{ textAlign: 'center', padding: '64px 24px' }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
              <h2 style={{ fontSize: 20, fontWeight: 700, color: '#000716', margin: '0 0 10px' }}>No results found</h2>
              <p style={{ color: '#545B64', fontSize: 14, maxWidth: 400, margin: '0 auto 24px' }}>
                No results for &ldquo;<strong>{query}</strong>&rdquo;. Try different keywords or browse a category below.
              </p>
              <Link href="/search" style={{ display: 'inline-block', padding: '10px 22px', background: '#0972D3', color: '#FFFFFF', fontSize: 14, fontWeight: 700, borderRadius: 4, textDecoration: 'none' }}>
                Clear search
              </Link>
            </div>
          )}

          {results && totalResults > 0 && (
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 280px', gap: 24, alignItems: 'start' }}>

              {/* Results list */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                {newsResults.length > 0 && (
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                      <span style={{ display: 'inline-block', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', padding: '4px 12px', borderRadius: 20, border: '1px solid #D5DBDB', color: '#545B64', background: '#FFFFFF' }}>News Articles</span>
                      <span style={{ fontSize: 12, color: '#687078' }}>{newsResults.length} result{newsResults.length !== 1 ? 's' : ''}</span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {newsResults.map((item: any) => (
                        <Link
                          key={item.id}
                          href={`/news/${item.slug}`}
                          style={{ display: 'block', background: '#FFFFFF', border: '1px solid #D5DBDB', borderRadius: 16, padding: '18px 20px', textDecoration: 'none', transition: 'border-color 0.1s, box-shadow 0.1s' }}
                          className="result-card"
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                            <span style={{ fontSize: 11, fontWeight: 700, color: '#687078', textTransform: 'uppercase', letterSpacing: '0.04em' }}>News</span>
                          </div>
                          <div style={{ fontSize: 15, fontWeight: 700, color: '#0972D3', marginBottom: item.summary ? 6 : 0, lineHeight: 1.35 }}>{item.title}</div>
                          {item.summary && (
                            <div style={{ fontSize: 13, color: '#545B64', lineHeight: 1.55 }} className="line-clamp-2">{item.summary}</div>
                          )}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {pageResults.length > 0 && (
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                      <span style={{ display: 'inline-block', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', padding: '4px 12px', borderRadius: 20, border: '1px solid #D5DBDB', color: '#545B64', background: '#FFFFFF' }}>Pages</span>
                      <span style={{ fontSize: 12, color: '#687078' }}>{pageResults.length} result{pageResults.length !== 1 ? 's' : ''}</span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {pageResults.map((item: any) => (
                        <Link
                          key={item.id}
                          href={`/${item.slug}`}
                          style={{ display: 'block', background: '#FFFFFF', border: '1px solid #D5DBDB', borderRadius: 16, padding: '18px 20px', textDecoration: 'none', transition: 'border-color 0.1s, box-shadow 0.1s' }}
                          className="result-card"
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                            <span style={{ fontSize: 11, fontWeight: 700, color: '#687078', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Page</span>
                          </div>
                          <div style={{ fontSize: 15, fontWeight: 700, color: '#0972D3', lineHeight: 1.35 }}>{item.title}</div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Sidebar */}
              <div style={{ background: '#FFFFFF', border: '1px solid #D5DBDB', borderRadius: 16, padding: '20px' }}>
                <h3 style={{ fontSize: 13, fontWeight: 700, color: '#000716', margin: '0 0 14px' }}>Did you mean to browse?</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {[
                    { label: 'All News',       href: '/news' },
                    { label: 'Publications',   href: '/publications' },
                    { label: 'Departments',    href: '/departments' },
                    { label: 'Contact Us',     href: '/contact' },
                  ].map(l => (
                    <Link key={l.href} href={l.href} style={{ fontSize: 13, color: '#0972D3', textDecoration: 'none', padding: '6px 0', borderBottom: '1px solid #F2F3F3', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      {l.label} <span style={{ color: '#D5DBDB' }}>›</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .result-card:hover { border-color: #0972D3 !important; box-shadow: 0 2px 8px rgba(9,114,211,0.1); }
        .search-cat-card:hover { box-shadow: 0 2px 10px rgba(9,114,211,0.12); border-color: #0972D3 !important; }
      `}</style>
    </>
  )
}

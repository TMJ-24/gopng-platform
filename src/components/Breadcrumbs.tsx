import Link from 'next/link'

type Crumb = { label: string; href?: string }

export function Breadcrumbs({ items, light }: { items: Crumb[]; light?: boolean }) {
  const base = light ? 'text-white/60' : 'text-gray-500'
  const hover = light ? 'hover:text-white' : 'hover:text-[--color-secondary]'
  const active = light ? 'text-white font-medium' : 'text-gray-700 font-medium'
  const sep = light ? 'text-white/30' : 'text-gray-300'

  return (
    <nav aria-label="Breadcrumb" className={`text-sm ${base} mb-0`}>
      <ol className="flex flex-wrap items-center gap-1">
        {items.map((item, i) => (
          <li key={i} className="flex items-center gap-1">
            {i > 0 && <span className={sep}>/</span>}
            {item.href ? (
              <Link href={item.href} className={`${hover} transition-colors`}>
                {item.label}
              </Link>
            ) : (
              <span className={active}>{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}

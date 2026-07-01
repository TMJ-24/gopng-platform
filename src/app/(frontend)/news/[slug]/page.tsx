'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useParams, useSearchParams, notFound } from 'next/navigation'
import { useSite } from '@/context/SiteContext'
import { RichText } from '@/components/RichText'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { PageBanner } from '@/components/PageBanner'

export default function NewsDetailPage() {
  const site = useSite()
  const { slug } = useParams<{ slug: string }>()
  const searchParams = useSearchParams()
  const locale = searchParams.get('locale') === 'tpi' ? 'tpi' : 'en'

  const [article, setArticle] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [missing, setMissing] = useState(false)

  useEffect(() => {
    if (!site?.id || !slug) return
    fetch(
      `/api/news?where[site][equals]=${site.id}&where[slug][equals]=${slug}&depth=1&locale=${locale}`,
    )
      .then(r => r.json())
      .then(data => {
        const doc = data.docs?.[0] ?? null
        if (!doc) setMissing(true)
        else setArticle(doc)
        setLoading(false)
      })
      .catch(() => { setMissing(true); setLoading(false) })
  }, [site?.id, slug, locale])

  if (missing) notFound()
  if (!site) return null

  const date = article?.publishedDate
    ? new Date(article.publishedDate).toLocaleDateString('en-PG', {
        day: 'numeric', month: 'long', year: 'numeric',
      })
    : null

  return (
    <>
      {/* Banner */}
      <section className="bg-white border-b border-gray-200 py-12">
        <div className="mx-auto max-w-7xl px-4">
          <Breadcrumbs
            items={[
              { label: 'Home', href: '/' },
              { label: 'News', href: '/news' },
              { label: loading ? '…' : (article?.title ?? '') },
            ]}
          />
          {loading ? (
            <div className="mt-4 space-y-3">
              <div className="h-8 bg-gray-100 rounded-xl animate-pulse w-3/4" />
              <div className="h-4 bg-gray-100 rounded-xl animate-pulse w-1/4" />
            </div>
          ) : (
            <div className="mt-4">
              {date && <time className="text-gray-400 text-sm block mb-2">{date}</time>}
              <h1 className="text-3xl md:text-4xl font-black text-gray-900 max-w-3xl leading-tight">
                {article?.title}
              </h1>
            </div>
          )}
        </div>
      </section>

      {/* Article body */}
      <div className="mx-auto max-w-4xl px-4 py-16">
        {loading ? (
          <div className="space-y-4">
            <div className="bg-gray-100 rounded-2xl h-80 animate-pulse" />
            <div className="h-5 bg-gray-100 rounded animate-pulse w-full" />
            <div className="h-5 bg-gray-100 rounded animate-pulse w-4/5" />
            <div className="h-5 bg-gray-100 rounded animate-pulse w-3/4" />
          </div>
        ) : (
          <article>
            {article?.featuredImage?.url && (
              <div className="relative h-64 md:h-96 rounded-2xl overflow-hidden mb-10 bg-gray-100">
                <Image
                  src={article.featuredImage.url}
                  alt={article.featuredImage.alt || article.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            )}

            {article?.summary && (
              <p
                className="text-xl text-gray-600 leading-relaxed mb-8"
              >
                {article.summary}
              </p>
            )}

            <div className="prose">
              <RichText content={article?.content} />
            </div>
          </article>
        )}

        <div className="mt-14 pt-8 border-t border-gray-100">
          <Link
            href="/news"
            className="inline-flex items-center gap-2 text-sm font-semibold px-5 py-3 rounded-xl text-white hover:opacity-90 transition-opacity"
            style={{ backgroundColor: 'var(--color-primary)' }}
          >
            ← Back to News
          </Link>
        </div>
      </div>
    </>
  )
}

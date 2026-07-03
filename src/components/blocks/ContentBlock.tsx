'use client'

import { RichText } from '@/components/RichText'

type ContentBlockData = {
  body: any
}

export function ContentBlock({ block }: { block: ContentBlockData }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <RichText content={block.body} />
    </div>
  )
}

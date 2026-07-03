'use client'

import { BLOCK_REGISTRY } from './index'

type LayoutBlock = { blockType: string; id?: string } & Record<string, any>

export function BlockRenderer({ blocks }: { blocks: LayoutBlock[] }) {
  return (
    <>
      {blocks.map((block, i) => {
        const Component = BLOCK_REGISTRY[block.blockType]
        return Component ? <Component key={block.id ?? i} block={block} /> : null
      })}
    </>
  )
}

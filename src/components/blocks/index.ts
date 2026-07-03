import React from 'react'
import { HeroBlock } from './HeroBlock'
import { ContentBlock } from './ContentBlock'
import { GalleryBlock } from './GalleryBlock'
import { StatisticsBlock } from './StatisticsBlock'
import { DownloadsBlock } from './DownloadsBlock'
import { QuickLinksBlock } from './QuickLinksBlock'
import { ContactBlock } from './ContactBlock'
import { LatestNewsBlock } from './LatestNewsBlock'

export const BLOCK_REGISTRY: Record<string, React.ComponentType<{ block: any }>> = {
  hero:          HeroBlock,
  content:       ContentBlock,
  gallery:       GalleryBlock,
  statistics:    StatisticsBlock,
  downloads:     DownloadsBlock,
  'quick-links': QuickLinksBlock,
  contact:       ContactBlock,
  'latest-news': LatestNewsBlock,
}

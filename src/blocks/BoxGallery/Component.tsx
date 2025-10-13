import React from 'react'
import { BoxGallery as Layout } from './layouts/BoxGallery'
import type { Media } from '@/payload-types'

export type TransformedMedia = {
  url: string
  alt: string
}

export type BoxData = {
  title: string
  description?: string
  media: TransformedMedia[]
}

export type BoxGalleryBlockProps = {
  // Payload block metadata
  id?: string | null
  blockName?: string | null
  blockType?: string | null
  // Array of boxes with optional description and media IDs
  boxes: {
    title: string
    description?: string | null
    media: { mediaItem: Media | number; id?: string | null }[]
  }[]
  animationSpeed?: number | null
  columnAmount?: string | null
}

export const BoxGalleryBlock: React.FC<BoxGalleryBlockProps> = ({
  boxes,
  animationSpeed,
  columnAmount,
}) => {
  if (!boxes?.length) return null

  const speed = animationSpeed ?? 3
  const columns = columnAmount ?? '3'

  const transformedBoxes: BoxData[] = boxes.map((box) => ({
    title: box.title,
    description: box.description || '',
    media: box.media.map(({ mediaItem }) => {
      const url =
        typeof mediaItem === 'object' && 'url' in mediaItem && mediaItem.url
          ? mediaItem.url
          : `/media/${mediaItem}`
      const alt =
        typeof mediaItem === 'object' && 'alt' in mediaItem && mediaItem.alt ? mediaItem.alt : ''
      return { url, alt }
    }),
  }))

  return <Layout boxes={transformedBoxes} animationSpeed={speed} columnAmount={columns} />
}

'use client'

import React from 'react'
import { Grid } from './layouts/Grid'
import { Masonry } from './layouts/Masonry'
import { Slider } from './layouts/Slider'
import { Ticker } from './layouts/Ticker'
import { Media } from '@/payload-types'

export type ImageType = {
  media: {
    url: string
    alt: string
  }
  caption?: string | null
}

export type ImageGalleryProps = {
  images: {
    media: Media | number
    caption?: string | null
    id?: string | null
  }[]
  variant?: 'Grid' | 'Masonry' | 'Slider' | 'Ticker' | null
  autoplay?: boolean | null
  modal?: boolean | null
  speed?: number | null
  size?: '2 Images' | '3 Images' | '4 Images' | null
}

export const ImageGalleryBlock: React.FC<ImageGalleryProps> = ({
  images,
  variant = 'Grid',
  autoplay = true,
  modal = true,
  speed = 3,
  size = '3 Images',
}) => {
  if (!images?.length) return null

  // Transform media objects to the expected format
  const transformedImages: ImageType[] = images.map((image) => ({
    ...image,
    media: {
      url:
        typeof image.media === 'object' && 'url' in image.media && image.media.url
          ? image.media.url
          : `/media/${image.media}`,
      alt: typeof image.media === 'object' && 'alt' in image.media ? image.media.alt || '' : '',
    },
  }))

  const variants = {
    Grid: Grid,
    Masonry: Masonry,
    Slider: Slider,
    Ticker: Ticker,
  }

  const Component = variants[variant as keyof typeof variants] || variants.Grid

  return (
    <div className="w-full">
      <Component
        images={transformedImages}
        autoplay={!!autoplay}
        modal={!!modal}
        speed={speed || 3}
        size={variant === 'Grid' || variant === 'Masonry' ? size || '3 Images' : undefined}
      />
    </div>
  )
}

export const imageGalleryFields = {
  slug: 'imageGallery',
  labels: {
    singular: 'Image Gallery',
    plural: 'Image Galleries',
  },
  fields: [
    {
      name: 'images',
      type: 'array',
      required: true,
      label: 'Images',
      minRows: 1,
      admin: {
        description: 'Add one or more images to the gallery',
      },
      fields: [
        {
          name: 'media',
          type: 'upload',
          relationTo: 'media',
          required: true,
          label: 'Media',
        },
        {
          name: 'caption',
          type: 'text',
          label: 'Caption',
        },
      ],
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Content',
          fields: ['images'],
        },
        {
          label: 'Preferences',
          fields: [
            {
              name: 'variant',
              type: 'select',
              defaultValue: 'Grid',
              options: [
                { label: 'Grid', value: 'Grid' },
                { label: 'Slider', value: 'Slider' },
                { label: 'Ticker', value: 'Ticker' },
              ],
              admin: {
                description: 'Select the layout variant for the gallery',
              },
            },
            {
              name: 'autoplay',
              type: 'checkbox',
              defaultValue: true,
              admin: {
                description: 'Enable autoplay for Slider and Ticker variants',
                condition: (data, siblingData) =>
                  ['Slider', 'Ticker'].includes(siblingData?.variant),
              },
            },
            {
              name: 'modal',
              type: 'checkbox',
              defaultValue: true,
              admin: {
                description: 'Enable modal view for Grid and Ticker variants',
                condition: (data, siblingData) => ['Grid', 'Ticker'].includes(siblingData?.variant),
              },
            },
            {
              name: 'speed',
              type: 'number',
              defaultValue: 3,
              admin: {
                description: 'Animation speed in seconds for Slider and Ticker variants',
                condition: (data, siblingData) =>
                  ['Slider', 'Ticker'].includes(siblingData?.variant),
              },
            },
            {
              name: 'size',
              type: 'select',
              defaultValue: '3 Images',
              options: [
                { label: '2 Images', value: '2 Images' },
                { label: '3 Images', value: '3 Images' },
                { label: '4 Images', value: '4 Images' },
              ],
              admin: {
                description: 'Select the number of images per row/view',
                condition: (data, siblingData) => ['Grid', 'Ticker'].includes(siblingData?.variant),
              },
            },
          ],
        },
      ],
    },
  ],
}

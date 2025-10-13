'use client'

import React from 'react'
import { Grid } from './layouts/Grid'
import { Masonry } from './layouts/Masonry'
import { Slider } from './layouts/Slider'
import { Ticker } from './layouts/Ticker'
import { Media } from '@/payload-types'

export type TestimonialType = {
  avatar: {
    url: string
    alt: string
  }
  name: string
  job?: string | null
  company?: string | null
  message: any
}

export type TestimonialProps = {
  testimonials: {
    avatar: Media | number
    name: string
    job?: string | null
    company?: string | null
    message: any
    id?: string | null
  }[]
  variant?: 'Grid' | 'Masonry' | 'Slider' | 'Ticker' | null
  autoplay?: boolean | null
  modal?: boolean | null
  speed?: number | null
  size?: '2 Images' | '3 Images' | '4 Images' | null
}

export const TestimonialBlock: React.FC<TestimonialProps> = ({
  testimonials,
  variant = 'Grid',
  autoplay = true,
  modal = true,
  speed = 3,
  size = '3 Images',
}) => {
  if (!testimonials?.length) return null

  // Transform testimonial objects to the expected format
  const transformedTestimonials: TestimonialType[] = testimonials.map((testimonial) => ({
    ...testimonial,
    avatar: {
      url:
        typeof testimonial.avatar === 'object' &&
        'url' in testimonial.avatar &&
        testimonial.avatar.url
          ? testimonial.avatar.url
          : `/media/${testimonial.avatar}`,
      alt:
        typeof testimonial.avatar === 'object' && 'alt' in testimonial.avatar
          ? testimonial.avatar.alt || ''
          : '',
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
        testimonials={transformedTestimonials}
        autoplay={!!autoplay}
        modal={!!modal}
        speed={speed || 3}
        size={variant === 'Grid' || variant === 'Masonry' ? size || '3 Images' : undefined}
      />
    </div>
  )
}

export const testimonialFields = {
  slug: 'testimonial',
  labels: {
    singular: 'Testimonial',
    plural: 'Testimonials',
  },
  fields: [
    {
      name: 'testimonials',
      type: 'array',
      required: true,
      label: 'Testimonials',
      minRows: 1,
      admin: {
        description: 'Add one or more testimonials to the gallery',
      },
      fields: [
        {
          name: 'avatar',
          type: 'upload',
          relationTo: 'media',
          label: 'Avatar',
          required: true,
        },
        {
          name: 'name',
          type: 'text',
          label: 'Name',
          required: true,
        },
        {
          name: 'job',
          type: 'text',
          label: 'Job',
        },
        {
          name: 'company',
          type: 'text',
          label: 'Company',
        },
        {
          name: 'message',
          type: 'richText',
          label: 'Message',
          required: true,
        },
      ],
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Content',
          fields: ['testimonials'],
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
                description: 'Select the layout variant for the testimonials',
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
                description: 'Select the number of testimonials per row/view',
                condition: (data, siblingData) => ['Grid', 'Ticker'].includes(siblingData?.variant),
              },
            },
          ],
        },
      ],
    },
  ],
}

import type { Block } from 'payload'
import type { Media as MediaType } from '@/payload-types'
import { linkGroup } from '@/fields/linkGroup'

export type PricingOption = {
  title: string
  media: MediaType
  monthlyPrice: number
  annualPrice?: number
  content: any
  features: {
    text: string
    isAvailable: boolean
  }[]
  links: any
  isFeatured: boolean
}

export const PricingBlock: Block = {
  slug: 'pricing',
  labels: {
    singular: 'Pricing',
    plural: 'Pricing Blocks',
  },
  fields: [
    {
      name: 'currency',
      type: 'select',
      defaultValue: '$',
      options: [
        { label: 'Turkish Lira (TRY): ₺', value: '₺' },
        { label: 'US Dollar (USD): $', value: '$' },
        { label: 'Euro (EUR): €', value: '€' },
        { label: 'British Pound (GBP): £', value: '£' },
        { label: 'Japanese Yen (JPY): ¥', value: '¥' },
      ],
      admin: {
        description: 'Select the currency symbol to display',
      },
    },
    {
      name: 'options',
      type: 'array',
      label: 'Pricing Options',
      minRows: 1,
      maxRows: 5,
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
          label: 'Title',
        },
        {
          name: 'media',
          type: 'upload',
          relationTo: 'media',
          required: true,
          label: 'Image',
        },
        {
          name: 'monthlyPrice',
          type: 'number',
          required: true,
          label: 'Monthly Price',
          min: 0,
        },
        {
          name: 'annualPrice',
          type: 'number',
          label: 'Annual Price',
          min: 0,
        },
        {
          name: 'content',
          type: 'richText',
          label: 'Content',
        },
        {
          name: 'features',
          type: 'array',
          label: 'Features',
          fields: [
            {
              name: 'text',
              type: 'text',
              required: true,
              label: 'Feature Text',
            },
            {
              name: 'isAvailable',
              type: 'checkbox',
              label: 'Is Available',
              defaultValue: true,
            },
          ],
        },
        linkGroup({
          overrides: {
            maxRows: 2
          }
        }),
        {
          name: 'isFeatured',
          type: 'checkbox',
          label: 'Featured Plan',
          defaultValue: false,
        },
      ],
    },
  ],
} 
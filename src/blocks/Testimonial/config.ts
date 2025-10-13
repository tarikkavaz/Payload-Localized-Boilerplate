import type { Block } from 'payload'

export const Testimonial: Block = {
  slug: 'testimonial',
  labels: {
    singular: 'Testimonial',
    plural: 'Testimonials',
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Content',
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
          ]
        },
        {
          label: 'Settings',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'variant',
                  type: 'select',
                  defaultValue: 'Grid',
                  options: [
                    { label: 'Grid', value: 'Grid' },
                    { label: 'Masonry', value: 'Masonry' },
                    { label: 'Slider', value: 'Slider' },
                    { label: 'Ticker', value: 'Ticker' },
                  ],
                  admin: {
                    description: 'Select the layout variant for the testimonials',
                    width: '100%',
                  },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'modal',
                  type: 'checkbox',
                  defaultValue: true,
                  admin: {
                    description: 'Enable Modal for testimonials',
                    width: '50%',
                    condition: (data, siblingData) =>
                      ['Grid', 'Masonry','Ticker'].includes(siblingData?.variant),
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
                    width: '50%',
                    condition: (data, siblingData) =>
                      ['Grid', 'Masonry',].includes(siblingData?.variant),
                  },
                },
                {
                  name: 'autoplay',
                  type: 'checkbox',
                  defaultValue: true,
                  admin: {
                    description: 'Enable autoplay',
                    width: '50%',
                    condition: (data, siblingData) =>
                      ['Slider'].includes(siblingData?.variant),
                  },
                },
                {
                  name: 'speed',
                  type: 'number',
                  defaultValue: 3,
                  admin: {
                    description: 'Animation speed in seconds',
                    width: '50%',
                    condition: (data, siblingData) =>
                      ['Slider', 'Ticker'].includes(siblingData?.variant),
                  },
                },
              ],
            },
          ]
        }
      ]
    }
  ],
} 
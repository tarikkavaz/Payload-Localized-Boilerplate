import type { Block } from 'payload'

export const ImageGallery: Block = {
  slug: 'imageGallery',
  labels: {
    singular: 'Image Gallery',
    plural: 'Image Galleries',
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Content',
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
                    description: 'Select the layout variant for the gallery',
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
                    description: 'Enable Modal for big images',
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
                    description: 'Select the number of images per row/view',
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
                  defaultValue: 1,
                  admin: {
                    description: 'Animation speed',
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
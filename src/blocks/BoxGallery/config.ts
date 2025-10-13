import type { Block } from 'payload'

export const BoxGallery: Block = {
  slug: 'boxGallery',
  labels: {
    singular: 'Box Gallery',
    plural: 'Box Galleries',
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Content',
          fields: [
            {
              name: 'boxes',
              type: 'array',
              required: true,
              label: 'Boxes',
              minRows: 1,
              fields: [
                {
                  name: 'title',
                  type: 'text',
                  required: true,
                  label: 'Title',
                },
                {
                  name: 'description',
                  type: 'textarea',
                  label: 'Description',
                },
                {
                  name: 'media',
                  type: 'array',
                  required: true,
                  label: 'Media',
                  minRows: 1,
                  maxRows: 4,
                  fields: [
                    {
                      name: 'mediaItem',
                      type: 'upload',
                      relationTo: 'media',
                      required: true,
                      label: 'Media Item',
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'Settings',
          fields: [
            {
              name: 'animationSpeed',
              type: 'number',
              label: 'Animation Speed (seconds)',
              defaultValue: 3,
              admin: {
                description: 'Duration, in seconds, between media rotations',
                width: '50%',
              },
            },
            {
              name: 'columnAmount',
              type: 'select',
              label: 'Column Amount',
              defaultValue: '3',
              options: [
                { label: '2 Columns', value: '2' },
                { label: '3 Columns', value: '3' },
                { label: '4 Columns', value: '4' },
              ],
              admin: {
                description: 'Number of boxes per row',
                width: '50%',
              },
            },
          ],
        },
      ],
    },
  ],
} 
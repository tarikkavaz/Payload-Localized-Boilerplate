import type { Block } from 'payload'
import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

export const Documents: Block = {
  slug: 'documents',
  labels: {
    singular: 'Documents Block',
    plural: 'Documents Blocks',
  },
  fields: [
    {
      name: 'introContent',
      type: 'richText',
      localized: true,
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [
            ...rootFeatures,
            HeadingFeature({ enabledHeadingSizes: ['h2', 'h3', 'h4'] }),
            FixedToolbarFeature(),
            InlineToolbarFeature(),
          ]
        },
      }),
      label: 'Intro Content',
    },
    {
      name: 'documents',
      type: 'array',
      required: true,
      minRows: 1,
      labels: {
        singular: 'Document',
        plural: 'Documents',
      },
      fields: [
        {
          name: 'doc',
          type: 'upload',
          relationTo: 'documents',
          required: true,
        },
      ],
    },
  ],
} 
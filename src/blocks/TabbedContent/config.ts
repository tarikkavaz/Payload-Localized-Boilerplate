import type { Block } from 'payload'

import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

export const TabbedContent: Block = {
  slug: 'tabbedContent',
  interfaceName: 'TabbedContentBlock',
  labels: {
    singular: 'Tabbed Content',
    plural: 'Tabbed Contents',
  },
  fields: [
    {
      name: 'orientation',
      type: 'select',
      defaultValue: 'horizontal',
      options: [
        {
          label: 'Horizontal',
          value: 'horizontal',
        },
        {
          label: 'Vertical',
          value: 'vertical',
        },
      ],
      required: true,
    },
    {
      name: 'tabs',
      type: 'array',
      minRows: 1,
      maxRows: 6,
      labels: {
        singular: 'Tab',
        plural: 'Tabs',
      },
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
          label: 'Tab Title',
        },
        {
          name: 'description',
          type: 'text',
          label: 'Tab Description',
          admin: {
            description: 'A short description that appears below the title (most visible in vertical orientation)',
          },
        },
        {
          name: 'content',
          type: 'richText',
          required: true,
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
        },
      ],
    },
  ],
} 
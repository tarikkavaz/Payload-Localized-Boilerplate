import type { Block, Field } from 'payload'

import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  InlineCodeFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

const columnFields: Field[] = [
  {
    name: 'columnType',
    type: 'select',
    defaultValue: 'richText',
    options: [
      {
        label: 'Rich Text',
        value: 'richText',
      },
      {
        label: 'Media Block',
        value: 'mediaBlock',
      },
    ],
    required: true,
    admin: {
      description: 'Select the type of content for this column',
    },
  },
  {
    name: 'richText',
    type: 'richText',
    localized: true,
    editor: lexicalEditor({
      features: ({ rootFeatures }) => {
        return [
          ...rootFeatures,
          HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
          FixedToolbarFeature(),
          InlineToolbarFeature(),
          InlineCodeFeature(),
        ]
      },
    }),
    label: 'Rich Text Content',
    admin: {
      condition: (_, siblingData) => siblingData?.columnType === 'richText',
    },
  },
  {
    name: 'media',
    type: 'upload',
    relationTo: 'media',
    label: 'Media',
    admin: {
      condition: (_, siblingData) => siblingData?.columnType === 'mediaBlock',
    },
  },
]

export const TwoColumn: Block = {
  slug: 'twoColumn',
  interfaceName: 'TwoColumnBlock',
  fields: [
    {
      name: 'alignment',
      type: 'select',
      defaultValue: 'top',
      options: [
        {
          label: 'Top',
          value: 'top',
        },
        {
          label: 'Middle',
          value: 'middle',
        },
        {
          label: 'Bottom',
          value: 'bottom',
        },
        {
          label: 'Justify',
          value: 'justify',
        },
      ],
      admin: {
        description: 'Vertical alignment of the columns',
      },
    },
    {
      name: 'borders',
      type: 'select',
      hasMany: true,
      options: [
        {
          label: 'Top Border',
          value: 'top',
        },
        {
          label: 'Bottom Border',
          value: 'bottom',
        },
        {
          label: 'Between Columns',
          value: 'between',
        },
      ],
      admin: {
        description: 'Select which borders to display (you can select multiple)',
      },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'columnOne',
          type: 'group',
          label: 'Column One',
          fields: columnFields,
        },
        {
          name: 'columnTwo',
          type: 'group',
          label: 'Column Two',
          fields: columnFields,
        },
      ],
    },
  ],
}

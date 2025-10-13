import type { Block } from 'payload'

export type TableCell = {
  content: string
  alignment?: 'left' | 'center' | 'right'
}

export type TableRow = {
  cells: TableCell[]
}

export const TableBlock: Block = {
  slug: 'table',
  labels: {
    singular: 'Table',
    plural: 'Tables',
  },
  fields: [
    {
      name: 'width',
      type: 'select',
      defaultValue: 'full',
      options: [
        { label: 'Full Width', value: 'full' },
        { label: 'Auto Width', value: 'auto' },
      ],
      admin: {
        description: 'Choose how the table should fill the available space',
      },
    },
    {
      name: 'caption',
      type: 'text',
      label: 'Table Caption',
      admin: {
        description: 'The caption will be displayed below the table',
      },
    },
    {
      name: 'headers',
      type: 'array',
      label: 'Table Headers',
      minRows: 1,
      maxRows: 12,
      fields: [
        {
          name: 'content',
          type: 'text',
          required: true,
        },
        {
          name: 'alignment',
          type: 'select',
          options: [
            { label: 'Left', value: 'left' },
            { label: 'Center', value: 'center' },
            { label: 'Right', value: 'right' },
          ],
          defaultValue: 'left',
        },
      ],
    },
    {
      name: 'rows',
      type: 'array',
      label: 'Table Rows',
      fields: [
        {
          name: 'cells',
          type: 'array',
          label: 'Cells',
          admin: {
            description: "Don't add more Cells than the number of headers",
          },
          fields: [
            {
              name: 'content',
              type: 'text',
              required: true,
            },
          ],
        },
      ],
    },
  ],
}

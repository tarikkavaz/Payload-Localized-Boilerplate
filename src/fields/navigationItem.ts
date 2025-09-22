import type { Field } from 'payload'
import { link } from '@/fields/link'
import deepMerge from '@/utilities/deepMerge'

export type NavigationItemType = (options?: {
  overrides?: Record<string, unknown>
}) => Field

export const navigationItem: NavigationItemType = ({ overrides = {} } = {}) => {
  const navigationItemResult: Field = {
    name: 'navItems',
    type: 'array',
    fields: [
      {
        name: 'hasSubmenu',
        type: 'checkbox',
        label: 'Has Submenu',
        defaultValue: false,
        admin: {
          description: 'Check this to create a parent item with child items',
        },
      },
      {
        name: 'label',
        type: 'text',
        localized: true,
        required: false,
        label: 'Parent Label',
        admin: {
          condition: (_, siblingData) => siblingData?.hasSubmenu,
          description: 'Display text for the parent navigation item',
        },
      },
      // Link fields - only show when not a parent with submenu
      link({
        appearances: false,
        overrides: {
          admin: {
            condition: (_, siblingData) => !siblingData?.hasSubmenu,
            description: 'Link configuration for this navigation item',
          },
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'type',
                  type: 'radio',
                  admin: {
                    layout: 'horizontal',
                    width: '50%',
                  },
                  defaultValue: 'reference',
                  options: [
                    {
                      label: 'Internal link',
                      value: 'reference',
                    },
                    {
                      label: 'Custom URL',
                      value: 'custom',
                    },
                  ],
                },
                {
                  name: 'newTab',
                  type: 'checkbox',
                  admin: {
                    style: {
                      alignSelf: 'flex-end',
                    },
                    width: '50%',
                  },
                  label: 'Open in new tab',
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'reference',
                  type: 'relationship',
                  admin: {
                    condition: (_, siblingData) => siblingData?.type === 'reference',
                    width: '33.33%',
                  },
                  label: 'Document to link to',
                  maxDepth: 1,
                  relationTo: ['pages'],
                  required: false, // Made optional to allow parent items without links
                },
                {
                  name: 'url',
                  type: 'text',
                  admin: {
                    condition: (_, siblingData) => siblingData?.type === 'custom',
                    width: '50%',
                  },
                  label: 'Custom URL',
                  required: false, // Made optional to allow parent items without links
                },
                {
                  name: 'label',
                  localized: true,
                  type: 'text',
                  admin: {
                    width: '50%',
                  },
                  label: 'Label',
                  required: true,
                },
              ],
            },
          ],
        },
      }),
      // Submenu items - only show when hasSubmenu is checked
      {
        name: 'submenuItems',
        type: 'array',
        label: 'Submenu Items',
        admin: {
          condition: (_, siblingData) => siblingData?.hasSubmenu,
          description: 'Child items that will appear in the dropdown menu',
        },
        fields: [
          link({
            appearances: false,
          }),
        ],
        maxRows: 10,
      },
    ],
    maxRows: 10,
    admin: {
      initCollapsed: false,
    },
  }

  return deepMerge(navigationItemResult, overrides)
}

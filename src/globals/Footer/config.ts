import type { GlobalConfig } from 'payload'

import { navigationItem } from '@/fields/navigationItem'
import { revalidateFooter } from './hooks/revalidateFooter'

export const Footer: GlobalConfig = {
  slug: 'footer',
  access: {
    read: () => true,
  },
  fields: [
    navigationItem(),
  ],
  hooks: {
    afterChange: [revalidateFooter],
  },
}

import type { GlobalConfig } from 'payload'

import { navigationItem } from '@/fields/navigationItem'
import { revalidateHeader } from './hooks/revalidateHeader'

export const Header: GlobalConfig = {
  slug: 'header',
  access: {
    read: () => true,
  },
  fields: [
    navigationItem(),
  ],
  hooks: {
    afterChange: [revalidateHeader],
  },
}

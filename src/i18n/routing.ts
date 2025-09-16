import { defineRouting } from 'next-intl/routing'
import { createNavigation } from 'next-intl/navigation'
import localization from './localization'
import { collectionMappings } from './collections'

// Generate pathnames configuration from collection mappings
const generatePathnames = () => {
  const pathnames: Record<string, any> = {
    '/': '/'
  }

  // Add collection index routes
  Object.entries(collectionMappings.tr).forEach(([en, tr]) => {
    pathnames[`/${en}`] = {
      tr: `/${tr}`,
      en: `/${en}`
    }
  })

  // Add collection item routes
  Object.entries(collectionMappings.tr).forEach(([en, tr]) => {
    if (en === 'posts') {
      // Regular item routes
      pathnames[`/${en}/[slug]`] = {
        tr: `/${tr}/[slug]`,
        en: `/${en}/[slug]`
      }
      
      // Category list routes - explicit paths
      pathnames[`/${en}/categories`] = {
        tr: `/${tr}/kategoriler`,
        en: `/${en}/categories`
      }
      
      // Category detail routes - explicit paths
      pathnames[`/${en}/category/[slug]`] = {
        tr: `/${tr}/kategori/[slug]`,
        en: `/${en}/category/[slug]`
      }
    }
  })

  return pathnames
}

export const routing = defineRouting({
  locales: localization.locales.map((locale) => locale.code),
  defaultLocale: localization.defaultLocale,
  pathnames: generatePathnames()
})

// Lightweight wrappers around Next.js' navigation APIs
// that will consider the routing configuration
export const { Link, redirect, usePathname, useRouter } = createNavigation(routing)

export type Locale = (typeof routing.locales)[number]

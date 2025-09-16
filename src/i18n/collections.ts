export const collectionMappings = {
  // English to Turkish mappings
  tr: {
    'posts': 'yazilar',
    'category': 'kategori',
    'categories': 'kategoriler'
  },
  // Turkish to English mappings
  en: {
    'yazilar': 'posts',
    'kategori': 'category',
    'kategoriler': 'categories'
  }
} as const

// List of all valid collection slugs (both English and Turkish)
export const validCollections = [
  'posts',
  'yazilar',
  'category',
  'kategori',
  'categories',
  'kategoriler'
]

// Helper function to get base collection name (always English)
export const getBaseCollection = (collection: string) => {
  // If collection contains slashes, only use the first segment
  const firstSegment = collection.split('/')[0];
  
  if (collectionMappings.en[firstSegment as keyof typeof collectionMappings.en]) {
    return collectionMappings.en[firstSegment as keyof typeof collectionMappings.en]
  }
  return firstSegment
}

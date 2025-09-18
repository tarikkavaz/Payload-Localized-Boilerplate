import { BeforeSync, DocToSync } from '@payloadcms/plugin-search/types'

export const beforeSyncWithSearch: BeforeSync = async ({ req, originalDoc, searchDoc }) => {
  const {
    doc: { relationTo: collection },
  } = searchDoc

  const { id, categories } = originalDoc
  const locale = req.locale || 'en'

  // Note: Search sync happens per locale when documents are updated
  // The locale is correctly passed from the request context

  // Helper function to extract localized value
  const getLocalizedValue = (field: any, fallback: any = undefined) => {
    if (typeof field === 'object' && field !== null && !Array.isArray(field) && field[locale]) {
      return field[locale]
    }
    return field || fallback
  }

  // Extract localized fields properly
  const title = getLocalizedValue(originalDoc.title)
  const slug = getLocalizedValue(originalDoc.slug)
  
  // Handle meta fields - now that SEO fields are localized
  const meta = originalDoc.meta || {}
  const metaTitle = getLocalizedValue(meta.title, title)
  const metaDescription = getLocalizedValue(meta.description)
  
  // Handle image properly - it should be the full media object
  let metaImage = meta.image
  // Image field is not localized, so use it directly

  const modifiedDoc: DocToSync = {
    ...searchDoc,
    title,
    slug,
    meta: {
      title: metaTitle,
      description: metaDescription,
      image: metaImage,
    },
    categories: [],
  }

  if (categories && Array.isArray(categories) && categories.length > 0) {
    const populatedCategories: { id: string | number; title: string }[] = []
    for (const category of categories) {
      if (!category) {
        continue
      }

      if (typeof category === 'object') {
        populatedCategories.push(category)
        continue
      }

      const doc = await req.payload.findByID({
        collection: 'categories',
        id: category,
        disableErrors: true,
        depth: 0,
        select: { title: true },
        locale,
        req,
      })

      if (doc !== null) {
        populatedCategories.push(doc)
      } else {
        console.error(
          `Failed. Category not found when syncing collection '${collection}' with id: '${id}' to search.`,
        )
      }
    }

    modifiedDoc.categories = populatedCategories.map((each) => ({
      relationTo: 'categories',
      categoryID: String(each.id),
      title: each.title,
    }))
  }

  return modifiedDoc
}

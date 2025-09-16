import type { FieldHook, FieldHookArgs } from 'payload'

export const formatSlug = (val: string): string =>
  val
  .replace(/[ıİ]/g, 'i')
  .replace(/[öÖ]/g, 'o')
  .replace(/[şŞ]/g, 's')
  .replace(/[ğĞ]/g, 'g')
  .replace(/[üÜ]/g, 'u')
  .replace(/[Çç]/g, 'c')
  .replace(/[~!@#$%^&*()_+=\[\]{};:'"`\\|,<.>/?]/g, '-')
  .replace(/ /g, '-')
  .replace(/[^\w-]+/g, '')
  .replace(/-+/g, '-')
  .toLowerCase()

type DocWithID = { id: string; [key: string]: any }

export const formatSlugHook =
  (fallback: string): FieldHook<DocWithID> =>
  ({ originalDoc, value, ...args }) => {
    const locale = (args as any).locale || 'en';
    // If no value provided and we have an original doc with a slug for this locale, keep it
    if (!value && originalDoc?.slug?.[locale]) {
      return originalDoc.slug[locale]
    }
    // If value provided, format it
    if (value) {
      return formatSlug(value)
    }
    // If no value and no original slug, try to get the fallback field's value for this locale
    return originalDoc?.[fallback]?.[locale] ? formatSlug(originalDoc[fallback][locale]) : undefined
  }

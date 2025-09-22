'use client'

import { useLocale } from 'next-intl'
import { useParams } from 'next/navigation'
import { usePathname, useRouter } from '@/i18n/routing'
import React, { useTransition } from 'react'
import { TypedLocale } from 'payload'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import localization from '@/i18n/localization'
import { collectionMappings, validCollections, getBaseCollection } from '@/i18n/collections'

async function getTranslatedSlug(currentLocale: string, newLocale: string, collection?: string, slug?: string, currentPath?: string) {
  try {
    if (!slug) return null;
    
    // Determine collection type
    let col = collection && validCollections.includes(collection) ? collection : 'pages';
    
    // Map category collections correctly
    if (currentPath?.includes('/category/')) {
      if (currentPath.startsWith('/posts') || currentPath.startsWith('/yazilar')) {
        col = 'categories';
      }
    }

    // Fetch document ID using current locale
    const res = await fetch(`/api/${col}?where[slug][equals]=${slug}&locale=${currentLocale}`);
    const data = await res.json();

    if (data?.docs?.[0]?.id) {
      // Fetch translated version
      const translationRes = await fetch(`/api/${col}/${data.docs[0].id}?locale=${newLocale}`);
      const translationData = await translationRes.json();
      return translationData?.slug;
    }
  } catch (err) {
    console.error('Error fetching translation:', err);
  }
  return null;
}

interface LocaleSwitcherProps {
  className?: string
  rotateChevron?: boolean
}

export function LocaleSwitcher({ className, rotateChevron }: LocaleSwitcherProps) {
  const locale = useLocale()
  const router = useRouter()
  const [, startTransition] = useTransition()
  const pathname = usePathname()
  const params = useParams()

  async function onSelectChange(newLocale: TypedLocale) {
    startTransition(async () => {
      try {
        const currentPath = pathname.replace(/^\/[a-z]{2}\//, '/'); // Remove existing locale
        const isHome = currentPath === '/';

        if (isHome) {
          router.replace('/', { locale: newLocale });
          return;
        }

        // Extract route parts without locale
        const pathParts = currentPath.split('/').filter(Boolean);

        // Handle direct pages (single segment like /test)
        if (pathParts.length === 1) {
          const pageSlug = pathParts[0];
          
          // First try to get the translated slug from the pages collection
          const translatedSlug = await getTranslatedSlug(locale, newLocale, 'pages', pageSlug, currentPath);
          
          if (translatedSlug) {
            // If we found a translation in the pages collection, use it
            router.replace(`/${translatedSlug}`, { locale: newLocale });
          } else if (validCollections.includes(pageSlug)) {
            // If no translation found and it's a collection route, translate the collection name
            let newPath = pageSlug;
            // Check if we have a mapping for this locale and collection
            if (collectionMappings[newLocale as keyof typeof collectionMappings] && 
                collectionMappings[newLocale as keyof typeof collectionMappings][pageSlug as keyof typeof collectionMappings[typeof newLocale]]) {
              newPath = collectionMappings[newLocale as keyof typeof collectionMappings][pageSlug as keyof typeof collectionMappings[typeof newLocale]];
            }
            router.replace(`/${newPath}`, { locale: newLocale });
          } else {
            // If no translation found and not a collection, keep the current slug
            router.replace(`/${pageSlug}`, { locale: newLocale });
          }
          return;
        }

        // Handle category pages (like /posts/categories)
        if (pathParts.length === 2 && pathParts[1] === 'categories') {
          const collection = pathParts[0];
          const baseCollection = getBaseCollection(collection);
          if (baseCollection === 'posts') {
            const translatedCollection = collectionMappings[newLocale as keyof typeof collectionMappings]?.[baseCollection as keyof typeof collectionMappings[typeof newLocale]] || baseCollection;
            const translatedCategories = collectionMappings[newLocale as keyof typeof collectionMappings]?.['categories' as keyof typeof collectionMappings[typeof newLocale]] || 'categories';
            router.replace(`/${translatedCollection}/${translatedCategories}`, { locale: newLocale });
          }
          return;
        }

        // Handle category detail pages (like /posts/category/[slug])
        if (pathParts.length === 3 && pathParts[1] === 'category') {
          const collection = pathParts[0];
          const slug = params?.slug as string;
          const baseCollection = getBaseCollection(collection);
          if (baseCollection === 'posts') {
            const translatedSlug = await getTranslatedSlug(locale, newLocale, 'categories', slug, currentPath);
            const translatedCollection = collectionMappings[newLocale as keyof typeof collectionMappings]?.[baseCollection as keyof typeof collectionMappings[typeof newLocale]] || baseCollection;
            const translatedCategory = collectionMappings[newLocale as keyof typeof collectionMappings]?.['category' as keyof typeof collectionMappings[typeof newLocale]] || 'category';
            const pathname = `/${translatedCollection}/${translatedCategory}/${translatedSlug || slug}`;
            router.replace(pathname, { locale: newLocale });
          }
          return;
        }

        // Handle collection items (two segments like /posts/slug or /yazilar/slug)
        if (pathParts.length === 2) {
          const [collection, currentSlug] = pathParts;
          if (validCollections.includes(collection)) {
            const baseCollection = getBaseCollection(collection);
            const slugToUse = params?.slug as string || currentSlug;
            
            if (!slugToUse || slugToUse === '[slug]') {
              console.error('Invalid slug detected:', { 
                pathParts, 
                currentSlug, 
                paramsSlug: params?.slug,
                slugToUse
              });
              router.replace('/', { locale: newLocale });
              return;
            }

            const translatedSlug = await getTranslatedSlug(locale, newLocale, baseCollection, slugToUse, currentPath);
            const translatedCollection = collectionMappings[newLocale as keyof typeof collectionMappings]?.[baseCollection as keyof typeof collectionMappings[typeof newLocale]] || baseCollection;
            const newPath = `/${translatedCollection}/${translatedSlug || slugToUse}`;
            router.replace(newPath, { locale: newLocale });
            return;
          }
        }
      } catch (error) {
        console.error('Locale switch failed:', error);
        console.error('Current path:', pathname);
        console.error('Attempted locale:', newLocale);
      }
    });
  }

  return (
    <Select onValueChange={onSelectChange} value={locale}>
      <SelectTrigger className={`w-auto text-sm bg-transparent gap-2 px-0 md:pl-3 border-none ${className || 'text-primary'} ${rotateChevron ? '[&_svg]:rotate-180' : ''}`}>
        <SelectValue placeholder="Language" />
      </SelectTrigger>
      <SelectContent>
        {localization.locales
          .sort((a, b) => a.label.localeCompare(b.label))
          .map((locale) => (
            <SelectItem value={locale.code} key={locale.code}>
              {locale.label}
            </SelectItem>
          ))}
      </SelectContent>
    </Select>
  )
}

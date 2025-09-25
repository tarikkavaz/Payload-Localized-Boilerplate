'use client'

import { useLocale } from 'next-intl'
import { useParams } from 'next/navigation'
import { usePathname, useRouter } from '@/i18n/routing'
import React, { useTransition } from 'react'
import { TypedLocale } from 'payload'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { ChevronDown, Check } from 'lucide-react'
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
  variant?: 'default' | 'footer'
}

export function LocaleSwitcher({ className, rotateChevron, variant = 'default' }: LocaleSwitcherProps) {
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

  const currentLocaleLabel = localization.locales.find(l => l.code === locale)?.label || locale;

  // Color classes based on variant
  const getColorClasses = () => {
    if (variant === 'footer') {
      return {
        trigger: 'text-white hover:text-white/80',
        chevron: 'text-white/60',
        button: 'text-white hover:bg-white/10',
        buttonActive: 'bg-white/20 text-white'
      }
    }
    return {
      trigger: 'text-primary dark:text-white hover:text-primary/80 dark:hover:text-white/80',
      chevron: 'text-primary/60 dark:text-white/60',
      button: 'text-primary dark:text-white hover:bg-muted dark:hover:bg-white/5',
      buttonActive: 'bg-muted dark:bg-white/10 text-primary dark:text-white'
    }
  };

  const colors = getColorClasses();

  return (
    <Popover>
      <PopoverTrigger className={`flex items-center gap-x-1 text-sm font-semibold bg-transparent px-0 md:pl-3 border-none transition-colors ${colors.trigger} ${className || ''}`}>
        {currentLocaleLabel}
        <ChevronDown 
          aria-hidden="true" 
          className={`h-5 w-5 flex-none ${colors.chevron} ${rotateChevron ? 'rotate-180' : ''}`} 
        />
      </PopoverTrigger>
      <PopoverContent 
        className={`w-56 p-2 border shadow-lg ${
          variant === 'footer' 
            ? 'bg-gray-800 border-gray-600' 
            : 'bg-popover dark:bg-popover border-border dark:border-white/10'
        }`}
        align="start"
      >
        {localization.locales
          .sort((a, b) => a.label.localeCompare(b.label))
          .map((localeOption) => {
            const isActive = localeOption.code === locale;
            return (
              <button
                key={localeOption.code}
                className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${
                  isActive 
                    ? colors.buttonActive
                    : colors.button
                }`}
                onClick={() => onSelectChange(localeOption.code as TypedLocale)}
              >
                <span>{localeOption.label}</span>
                {isActive && <Check className="h-4 w-4" />}
              </button>
            );
          })}
      </PopoverContent>
    </Popover>
  )
}

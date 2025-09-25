'use client'

import Link from 'next/link'
import React from 'react'
import { useRouter } from '@/i18n/routing'
import { useTranslations } from 'next-intl'
import type { Footer } from '@/payload-types'
import { ThemeSelector } from '@/providers/Theme/ThemeSelector'
import { CMSLink } from '@/components/Link'
import { LocaleSwitcher } from '@/components/LocaleSwitcher'
import { Logo } from '@/components/Logo/Logo'

export function Footer({ footer }: { footer: Footer }) {
  const navItems = footer?.navItems || []
  const router = useRouter()
  const t = useTranslations()

  const generateHref = (link: any) => {
    if (link.type === 'reference' && 
        typeof link.reference?.value === 'object' && 
        link.reference.value.slug) {
      return `${link.reference?.relationTo !== 'pages' ? `/${link.reference?.relationTo}` : ''}/${link.reference.value.slug}`
    }
    return link.url
  }

  const handleNavigation = (href: string, newTab?: boolean) => {
    if (newTab) {
      window.open(href, '_blank', 'noopener,noreferrer')
    } else {
      router.push(href)
    }
  }

  // Helper function to determine grid classes based on number of items
  const getGridClasses = (itemCount: number) => {
    if (itemCount === 1) return 'grid-cols-1'
    if (itemCount === 2) return 'grid-cols-1 md:grid-cols-2'
    if (itemCount === 3) return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
    if (itemCount === 4) return 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
    if (itemCount === 5) return 'grid-cols-2 md:grid-cols-3 lg:grid-cols-5'
    if (itemCount === 6) return 'grid-cols-2 md:grid-cols-3 lg:grid-cols-6'
    // For 7+ items, use a responsive layout that caps at 6 columns on xl screens
    return 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6'
  }

  // Group navigation items for column layout
  const renderNavigationColumns = () => {
    return navItems.map((item, i) => {
      // Check if item has submenu - render as column with submenu items below
      if (item?.hasSubmenu && item?.submenuItems && item.submenuItems.length > 0) {
        const parentLabel = (item as any)?.label || 'Menu'
        
        return (
          <div key={i} className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground">{parentLabel}</h3>
            <ul role="list" className="space-y-1">
              {item.submenuItems.map((submenuItem, j) => {
                const { link } = submenuItem
                if (!link) return null

                const href = generateHref(link)
                if (!href) return null

                return (
                  <li key={j}>
                    <button
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors text-left"
                      onClick={() => handleNavigation(href, link.newTab || false)}
                    >
                      {link.label}
                    </button>
                  </li>
                )
              })}
            </ul>
          </div>
        )
      }

      // Regular menu item without submenu - render as single column
      if (item?.link) {
        const href = generateHref(item.link)
        if (!href) return null

        return (
          <div key={i} className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground">
              <button
                className="hover:text-muted-foreground transition-colors text-left"
                onClick={() => handleNavigation(href, item.link?.newTab || false)}
              >
                {item.link?.label}
              </button>
            </h3>
          </div>
        )
      }

      return null
    })
  }

  return (
    <footer className="bg-background border-t border-border">
      <div className="mx-auto max-w-7xl px-6 pb-8 pt-16 sm:pt-24 lg:px-8 lg:pt-32">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          {/* Logo and Description Section */}
          <div className="space-y-8">
            <Link href="/" className="block">
              <div className="h-9">
                <Logo />
              </div>
            </Link>
            <p className="text-balance text-sm leading-6 text-muted-foreground">
              {t('footer-description')}
            </p>
            <div className="flex items-center gap-4">
              <LocaleSwitcher />
              <ThemeSelector />
            </div>
          </div>
          
          {/* Navigation Columns */}
          {navItems.length > 0 && (
            <div className={`mt-16 xl:col-span-2 xl:mt-0 grid gap-8 ${getGridClasses(navItems.length)}`}>
              {renderNavigationColumns()}
            </div>
          )}
        </div>
        
        {/* Bottom Section */}
        <div className="mt-16 border-t border-border pt-8 sm:mt-20 lg:mt-24">
          <p className="text-sm leading-6 text-muted-foreground">
            © {new Date().getFullYear()} {t('all-rights-reserved')}
          </p>
        </div>
      </div>
    </footer>
  )
}

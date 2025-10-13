'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { SearchIcon, Menu, X, ChevronDown } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useRouter, usePathname } from '@/i18n/routing'

import type { Header as HeaderType } from '@/payload-types'
import { CMSLink } from '@/components/Link'
import { LocaleSwitcher } from '@/components/LocaleSwitcher'
import { ThemeSelector } from '@/providers/Theme/ThemeSelector'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'

export const HeaderNav: React.FC<{ header: HeaderType }> = ({ header }) => {
  const navItems = header?.navItems || []
  const t = useTranslations()
  const router = useRouter()
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [openDisclosures, setOpenDisclosures] = useState<Set<number>>(new Set())

  const handleNavigation = (href: string, newTab?: boolean) => {
    if (newTab) {
      window.open(href, '_blank', 'noopener,noreferrer')
    } else {
      router.push(href)
    }
  }

  const toggleDisclosure = (index: number) => {
    setOpenDisclosures(prev => {
      const newSet = new Set(prev)
      if (newSet.has(index)) {
        newSet.delete(index)
      } else {
        newSet.add(index)
      }
      return newSet
    })
  }

  const generateHref = (link: any) => {
    if (link.type === 'reference' && 
        typeof link.reference?.value === 'object' && 
        link.reference.value.slug) {
      return `${link.reference?.relationTo !== 'pages' ? `/${link.reference?.relationTo}` : ''}/${link.reference.value.slug}`
    }
    return link.url
  }

  const isActiveLink = (href: string) => {
    if (!href) return { isExact: false, isPrefix: false }
    
    // Exact match
    const isExact = pathname === href
    
    // Prefix match (but not for home page to avoid everything being active)
    const isPrefix = href !== '/' && pathname.startsWith(href + '/')
    
    return { isExact, isPrefix }
  }

  const getActiveLinkClasses = (href: string, baseClasses: string) => {
    const { isExact, isPrefix } = isActiveLink(href)
    
    if (isExact) {
      // Strong active state for exact matches
      return `${baseClasses} bg-foreground text-background`
    } else if (isPrefix) {
      // Subtle active state for prefix matches
      return `${baseClasses} bg-muted/70 text-foreground font-medium`
    }
    
    return baseClasses
  }

  const renderDesktopNavItems = () => {
    return navItems.map((item, i) => {
      // Check if item has submenu
      if (item?.hasSubmenu && item?.submenuItems && item.submenuItems.length > 0) {
        const parentLabel = (item as any)?.label || 'Menu'
        
        return (
          <Popover key={`desktop-${i}`}>
            <PopoverTrigger className="flex items-center gap-x-1 text-md font-semibold text-foreground hover:text-foreground hover:bg-muted rounded-lg px-3 py-2 transition-colors">
              {parentLabel}
              <ChevronDown aria-hidden="true" className="h-5 w-5 flex-none text-muted-foreground" />
            </PopoverTrigger>
            <PopoverContent 
              className="w-56 p-2 bg-popover dark:bg-popover border border-border dark:border-white/10 shadow-lg"
              align="start"
            >
              {item.submenuItems.map((submenuItem, j) => {
                const { link } = submenuItem
                if (!link) return null

                const href = generateHref(link)
                if (!href) return null

                const baseClasses = "block w-full text-left rounded-lg px-3 py-2 text-md font-semibold transition-colors"
                const inactiveClasses = "text-foreground hover:bg-muted hover:text-foreground"

                return (
                  <button
                    key={j}
                    className={getActiveLinkClasses(href, `${baseClasses} ${inactiveClasses}`)}
                    onClick={() => handleNavigation(href, link.newTab || false)}
                  >
                    {link.label}
                  </button>
                )
              })}
            </PopoverContent>
          </Popover>
        )
      }

      // Regular menu item without submenu
      if (item?.link) {
        const href = generateHref(item.link)
        const baseClasses = "text-md font-semibold transition-colors rounded-lg px-3 py-2"
        const inactiveClasses = "text-foreground hover:text-foreground hover:bg-muted"
        
        return (
          <div key={`desktop-link-${i}`}>
            <CMSLink 
              {...item.link} 
              appearance="link" 
              className={getActiveLinkClasses(href, `${baseClasses} ${inactiveClasses}`)}
            />
          </div>
        )
      }

      return null
    })
  }

  const renderMobileNavItems = () => {
    return navItems.map((item, i) => {
      // Check if item has submenu - render as Disclosure
      if (item?.hasSubmenu && item?.submenuItems && item.submenuItems.length > 0) {
        const parentLabel = (item as any)?.label || 'Menu'
        const isOpen = openDisclosures.has(i)
        
        return (
          <div key={`mobile-${i}`} className="-mx-3">
            {/* Disclosure Button */}
            <button
              onClick={() => toggleDisclosure(i)}
              className="group flex w-full items-center justify-between rounded-lg py-2 pl-3 pr-3.5 text-sm font-semibold text-foreground hover:bg-muted hover:text-foreground transition-colors"
            >
              {parentLabel}
              <ChevronDown 
                aria-hidden="true" 
                className={`h-5 w-5 flex-none text-muted-foreground transition-transform ${isOpen ? 'rotate-180' : ''}`} 
              />
            </button>
            
            {/* Disclosure Panel */}
            {isOpen && (
              <div className="mt-2 space-y-2">
                {item.submenuItems.map((submenuItem, j) => {
                  const { link } = submenuItem
                  if (!link) return null

                  const href = generateHref(link)
                  if (!href) return null

                  const baseClasses = "block w-full text-left rounded-lg py-2 pl-6 pr-3 text-sm font-semibold transition-colors"
                  const inactiveClasses = "text-foreground hover:bg-muted hover:text-foreground"

                  return (
                    <button
                      key={j}
                      className={getActiveLinkClasses(href, `${baseClasses} ${inactiveClasses}`)}
                      onClick={() => {
                        handleNavigation(href, link.newTab || false)
                        setIsMobileMenuOpen(false)
                      }}
                    >
                      {link.label}
                    </button>
                  )
                })}
              </div>
            )}
          </div>
        )
      }

      // Regular menu item without submenu
      if (item?.link) {
        const href = generateHref(item.link)
        const baseClasses = "-mx-3 block rounded-lg px-3 py-2 text-md font-semibold transition-colors"
        const inactiveClasses = "text-foreground hover:bg-muted hover:text-foreground"
        
        return (
          <div 
            key={`mobile-link-${i}`} 
            onClick={() => setIsMobileMenuOpen(false)}
            className={getActiveLinkClasses(href, `${baseClasses} ${inactiveClasses}`)}
          >
            <CMSLink {...item.link} appearance="link" className="font-semibold" />
          </div>
        )
      }

      return null
    })
  }

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden lg:flex lg:gap-x-12 items-center">
        {renderDesktopNavItems()}
        <Link href="/search" className="text-foreground hover:text-foreground hover:bg-muted rounded-lg p-2 transition-colors">
          <span className="sr-only">{t('search')}</span>
          <SearchIcon className="w-5 h-5" />
        </Link>
      </nav>

      {/* Mobile Navigation Button */}
      <div className="flex lg:hidden items-center gap-3">
        <Link href="/search" className="text-foreground hover:text-foreground hover:bg-muted rounded-lg p-2 transition-colors">
          <span className="sr-only">{t('search')}</span>
          <SearchIcon className="w-5 h-5" />
        </Link>
        <button
          type="button"
          onClick={() => setIsMobileMenuOpen(true)}
          className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-foreground hover:text-foreground hover:bg-muted transition-colors"
        >
          <span className="sr-only">Open main menu</span>
          <Menu aria-hidden="true" className="h-6 w-6" />
        </button>
      </div>

      {/* Mobile Menu Dialog */}
      <Dialog open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
        <DialogContent className="fixed inset-y-0 right-0 left-auto top-auto z-50 w-full h-full overflow-y-auto bg-background dark:bg-background p-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10 dark:sm:ring-white/10 translate-x-0 translate-y-0 max-w-none block data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-right-full data-[state=closed]:!slide-out-to-top-0 data-[state=open]:!slide-in-from-top-0 duration-300">
          <DialogTitle className="text-lg font-semibold text-foreground mb-6">
            {t('menu')}
          </DialogTitle>
          <DialogDescription className="sr-only">
            Navigation menu with links and controls
          </DialogDescription>
          <div className="flow-root">
            <div className="-my-6 divide-y divide-gray-500/10 dark:divide-white/10">
              <div className="space-y-2 py-6">
                {renderMobileNavItems()}
              </div>
              <div className="py-6 flex items-center gap-4">
                <LocaleSwitcher className="md:pl-0" />
                <ThemeSelector className="md:pl-0 text-primary" />
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

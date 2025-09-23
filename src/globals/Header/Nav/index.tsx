'use client'

import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { SearchIcon, Menu, X } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useRouter } from '@/i18n/routing'

import type { Header as HeaderType } from '@/payload-types'
import { CMSLink } from '@/components/Link'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export const HeaderNav: React.FC<{ header: HeaderType }> = ({ header }) => {
  const navItems = header?.navItems || []
  const t = useTranslations()
  const router = useRouter()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const mobileMenuRef = useRef<HTMLDivElement>(null)

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setIsMobileMenuOpen(false)
      }
    }

    if (isMobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      // Prevent body scroll when mobile menu is open
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.body.style.overflow = ''
    }
  }, [isMobileMenuOpen])

  const renderNavItems = (isMobile = false) => {
    return navItems.map((item, i) => {
      // Check if item has submenu
      if (item?.hasSubmenu && item?.submenuItems && item.submenuItems.length > 0) {
        const parentLabel = (item as any)?.label || 'Menu'
        
        // Use Select for desktop, custom dropdown for mobile
        if (isMobile) {
          return (
            <div key={`mobile-${i}`} className="relative pl-2 border-l border-primary/20">
              <div
                className="flex items-center gap-2 text-sm font-medium text-primary/60 mt-px pt-0.5"
                onClick={() => {
                  // For mobile, directly show submenu items as buttons
                }}
              >
                {parentLabel}
              </div>
              <div className="flex flex-col gap-1 mt-2">
                {item.submenuItems.map((submenuItem, j) => {
                  const { link } = submenuItem
                  if (!link) return null

                  // Generate href similar to CMSLink
                  const href = link.type === 'reference' && 
                    typeof link.reference?.value === 'object' && 
                    link.reference.value.slug
                    ? `${link.reference?.relationTo !== 'pages' ? `/${link.reference?.relationTo}` : ''}/${link.reference.value.slug}`
                    : link.url

                  if (!href) return null

                  return (
                    <button
                      key={j}
                      className="text-left text-sm text-primary/80 hover:text-primary hover:underline"
                      onClick={() => {
                        if (link.newTab) {
                          window.open(href, '_blank', 'noopener,noreferrer')
                        } else {
                          router.push(href)
                          setIsMobileMenuOpen(false)
                        }
                      }}
                    >
                      {link.label}
                    </button>
                  )
                })}
              </div>
            </div>
          )
        }
        
        // Desktop Select component
        return (
          <Select key={`desktop-${i}`} value="" onValueChange={(value) => {
            const [index, newTab] = value.split('|')
            const submenuItem = item.submenuItems?.[parseInt(index)]
            const { link } = submenuItem || {}
            if (!link) return

            // Generate href similar to CMSLink
            const href = link.type === 'reference' && 
              typeof link.reference?.value === 'object' && 
              link.reference.value.slug
              ? `${link.reference?.relationTo !== 'pages' ? `/${link.reference?.relationTo}` : ''}/${link.reference.value.slug}`
              : link.url

            if (!href) return

            if (newTab === 'true') {
              window.open(href, '_blank', 'noopener,noreferrer')
            } else {
              router.push(href)
            }
          }}>
            <SelectTrigger className="w-auto text-sm bg-transparent gap-2 px-0 md:pl-3 border-none text-primary">
              <SelectValue placeholder={parentLabel} />
            </SelectTrigger>
            <SelectContent>
              {item.submenuItems.map((submenuItem, j) => {
                const { link } = submenuItem
                if (!link) return null

                return (
                  <SelectItem key={j} value={`${j}|${link.newTab || false}`}>
                    {link.label}
                  </SelectItem>
                )
              })}
            </SelectContent>
          </Select>
        )
      }

      // Regular menu item without submenu
      if (item?.link) {
        return (
          <div key={`${isMobile ? 'mobile' : 'desktop'}-link-${i}`} onClick={() => isMobile && setIsMobileMenuOpen(false)}>
            <CMSLink {...item.link} appearance="link" />
          </div>
        )
      }

      // Item with no link (shouldn't happen but just in case)
      return null
    })
  }

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden md:flex gap-3 items-center text-sm text-primary">
        {renderNavItems(false)}
        <Link href="/search">
          <span className="sr-only">{t('search')}</span>
          <SearchIcon className="w-5" />
        </Link>
      </nav>

      {/* Mobile Navigation */}
      <div className="md:hidden flex items-center gap-3">
        <Link href="/search">
          <span className="sr-only">{t('search')}</span>
          <SearchIcon className="w-5" />
        </Link>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="text-primary hover:text-primary/80"
          aria-label="Toggle mobile menu"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="fixed inset-0 bg-black/20" />
          <div
            ref={mobileMenuRef}
            className="fixed top-20 left-0 right-0 bg-background border-b border-border shadow-lg mx-4 rounded-lg"
          >
            <nav className="flex flex-row gap-4 p-4 overflow-x-auto">
              {renderNavItems(true)}
            </nav>
          </div>
        </div>
      )}
    </>
  )
}

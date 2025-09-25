'use client'

import Link from 'next/link'
import React from 'react'
import { useRouter } from '@/i18n/routing'
import type { Footer } from '@/payload-types'
import { ThemeSelector } from '@/providers/Theme/ThemeSelector'
import { CMSLink } from '@/components/Link'
import { LocaleSwitcher } from '@/components/LocaleSwitcher'
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from '@/components/ui/select'
import { Logo } from '@/components/Logo/Logo'

export function Footer({ footer }: { footer: Footer }) {
  const navItems = footer?.navItems || []
  const router = useRouter()

  return (
    <footer className="border-t border-border bg-black dark:bg-card text-white">
      <div className="container py-8 gap-8 flex flex-col md:flex-row md:justify-between">
        <Link href="/" className="">
          <div className="max-w-[9.375rem] min-h-8 invert dark:invert-0">
            <Logo />
          </div>
        </Link>

        <div className="flex flex-col-reverse items-start md:flex-row gap-4 md:items-center">
          <LocaleSwitcher variant="footer" rotateChevron={true} />
          <ThemeSelector variant="footer" rotateChevron={true} />
          {/* <nav className="flex flex-col md:flex-row gap-4">
            {navItems.map((item, i) => {
              // Check if item has submenu
              if (item?.hasSubmenu && item?.submenuItems && item.submenuItems.length > 0) {
                const parentLabel = (item as any)?.label || 'Menu'
                
                return (
                  <Select key={i} value="" onValueChange={(value) => {
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
                    <SelectTrigger className="w-auto text-sm bg-transparent gap-2 px-0 md:pl-3 border-none text-white [&_svg]:rotate-180">
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
                return <CMSLink className="text-white text-sm flex items-center" key={i} {...item.link} />
              }

              // Item with no link (shouldn't happen but just in case)
              return null
            })}
          </nav> */}
        </div>
      </div>
    </footer>
  )
}

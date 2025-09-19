'use client'
import { cn } from '@/utilities/ui'
import useClickableCard from '@/utilities/useClickableCard'
import Link from 'next/link'
import { useLocale } from 'next-intl'
import React, { Fragment } from 'react'

import type { Post } from '@/payload-types'

import { Media } from '@/components/Media'

export const CardList: React.FC<{
  alignItems?: 'center'
  className?: string
  doc?: Post
  relationTo?: 'posts'
  showCategories?: boolean
  title?: string
}> = (props) => {
  const locale = useLocale()
  const { card, link } = useClickableCard({})
  const { className, doc, relationTo, showCategories, title: titleFromProps } = props

  const { slug, categories, meta, title } = doc || {}
  const { description, image: metaImage } = meta || {}

  const hasCategories = categories && Array.isArray(categories) && categories.length > 0
  const titleToUse = titleFromProps || title
  const sanitizedDescription = description?.replace(/\s/g, ' ') // replace non-breaking space with white space
  const href = `/${locale}/${relationTo}/${slug}`

  return (
    <article
      className={cn(
        'border border-border rounded-lg overflow-hidden bg-card hover:cursor-pointer flex mb-4 min-h-36',
        className,
      )}
      ref={card.ref}
    >
      <div className="relative w-64 h-24 flex-shrink-0">
        {!metaImage && <div className="w-full h-full bg-gray-200 flex items-center justify-center text-sm text-gray-500">No image</div>}
        {metaImage && typeof metaImage !== 'string' && <Media resource={metaImage} size="128px" className="w-full h-full object-cover" />}
      </div>
      <div className="p-4 flex-1">
        {showCategories && hasCategories && (
          <div className="uppercase text-sm mb-2">
            {showCategories && hasCategories && (
              <div>
                {categories?.map((category, index) => {
                  if (typeof category === 'object') {
                    const { title: titleFromCategory } = category

                    const categoryTitle = titleFromCategory || 'Untitled category'

                    const isLast = index === categories.length - 1

                    return (
                      <Fragment key={index}>
                        {categoryTitle}
                        {!isLast && <Fragment>, &nbsp;</Fragment>}
                      </Fragment>
                    )
                  }

                  return null
                })}
              </div>
            )}
          </div>
        )}
        {titleToUse && (
          <div className="prose">
            <h3>
              <Link className="not-prose" href={href} ref={link.ref}>
                {titleToUse}
              </Link>
            </h3>
          </div>
        )}
        {description && <div className="mt-2">{description && <p>{sanitizedDescription}</p>}</div>}
      </div>
    </article>
  )
}

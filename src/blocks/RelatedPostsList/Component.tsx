import clsx from 'clsx'
import React from 'react'
import RichText from '@/components/RichText'

import type { Post } from '@/payload-types'

import { CardList } from '../../components/CardList'

import { useTranslations, useLocale } from 'next-intl'

export type RelatedPostsListProps = {
  className?: string
  docs?: Post[]
  introContent?: any
}

export const RelatedPostsList: React.FC<RelatedPostsListProps> = (props) => {
  const { className, docs, introContent } = props
  const t = useTranslations()
  const locale = useLocale()

  return (
    <div className={clsx('container lg:mx-0 lg:grid', className)}>
      {introContent && <RichText content={introContent} enableGutter={false} />}
      <hr className="my-8" />
      <div className="prose dark:prose-invert mb-8"><h3>{t('related-posts')}</h3></div>

      <div>
        {docs?.map((doc, index) => {
          if (typeof doc === 'string') return null

          return <CardList key={index} doc={doc} relationTo="posts" showCategories />
        })}
      </div>
    </div>
  )
}

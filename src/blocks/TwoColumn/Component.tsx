import { cn } from '@/utilities/ui'
import React from 'react'
import RichText from '@/components/RichText'
import { Media } from '@/components/Media'

import type { Page } from '@/payload-types'

type Props = Extract<Page['layout'][0], { blockType: 'twoColumn' }>

export const TwoColumnBlock: React.FC<
  {
    id?: string
    priority?: boolean
  } & Props
> = (props) => {
  const { alignment, columnOne, columnTwo, borders, priority } = props

  const alignmentClasses = {
    top: 'items-start',
    middle: 'items-center',
    bottom: 'items-end',
    justify: 'items-stretch',
  }

  const hasBorder = (borderType: string) => {
    if (!borders || !Array.isArray(borders)) return false
    
    // Handle both string array and object array formats
    return borders.some((border: any) => {
      if (typeof border === 'string') return border === borderType
      if (typeof border === 'object' && border?.value) return border.value === borderType
      return false
    })
  }

  return (
    <div className="container my-16">
      <div
        className={cn(
          'grid grid-cols-1 lg:grid-cols-2',
          alignmentClasses[alignment || 'top'],
          {
            'gap-8': !hasBorder('between'),
            'gap-8 lg:gap-0': hasBorder('between'),
            'border-t border-accent-foreground/60 mt-8': hasBorder('top'),
            'border-b border-accent-foreground/60 mb-8': hasBorder('bottom'),
            'lg:divide-x lg:divide-accent-foreground/60': hasBorder('between'),
          },
        )}
      >
        {/* Column One */}
        <div
          className={cn({
            'flex items-stretch': alignment === 'justify',
            'lg:pr-8': hasBorder('between'),
          })}
        >
          {columnOne?.columnType === 'richText' && columnOne?.richText && (
            <div className="mb-8 [&_h1]:text-balance [&_h2]:text-balance"><RichText content={columnOne.richText} enableGutter={false} /></div>
          )}
          {columnOne?.columnType === 'mediaBlock' && columnOne?.media && (
            <div className={cn({ 'p-0 m-0': columnOne.columnType === 'mediaBlock' })}>
              <Media resource={columnOne.media} imgClassName="w-full h-full object-cover" priority={priority} />
            </div>
          )}
        </div>

        {/* Column Two */}
        <div
          className={cn({
            'flex items-stretch': alignment === 'justify',
            'lg:pl-8': hasBorder('between'),
          })}
        >
          {columnTwo?.columnType === 'richText' && columnTwo?.richText && (
            <div className="mb-8 [&_h1]:text-balance [&_h2]:text-balance"><RichText content={columnTwo.richText} enableGutter={false} /></div>
          )}
          {columnTwo?.columnType === 'mediaBlock' && columnTwo?.media && (
            <div className={cn({ 'p-0 m-0': columnTwo.columnType === 'mediaBlock' })}>
              <Media resource={columnTwo.media} imgClassName="w-full h-full object-cover" priority={priority} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

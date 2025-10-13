import { cn } from '@/utilities/ui'
import React, { Fragment } from 'react'

import type { Page } from '@/payload-types'

import { ArchiveBlock } from '@/blocks/ArchiveBlock/Component'
import { CallToActionBlock } from '@/blocks/CallToAction/Component'
import { ContentBlock } from '@/blocks/Content/Component'
import { FormBlock } from '@/blocks/Form/Component'
import { MediaBlock } from '@/blocks/MediaBlock/Component'
import { BoxGalleryBlock } from '@/blocks/BoxGallery/Component'
import { DocumentsBlock } from '@/blocks/Documents/Component'
import { ImageGalleryBlock } from '@/blocks/ImageGallery/Component'
import { PricingBlock } from '@/blocks/Pricing/Component'
import { TabbedContentBlock } from '@/blocks/TabbedContent/Component'
import { TableBlock } from '@/blocks/Table/Component'
import { TestimonialBlock } from '@/blocks/Testimonial/Component'
import { TwoColumnBlock } from '@/blocks/TwoColumn/Component'
import { YoutubeBlock } from '@/blocks/Youtube/Component'
import { TypedLocale } from 'payload'

const blockComponents = {
  archive: ArchiveBlock,
  content: ContentBlock,
  cta: CallToActionBlock,
  formBlock: FormBlock,
  mediaBlock: MediaBlock,
  boxGallery: BoxGalleryBlock,
  documents: DocumentsBlock,
  imageGallery: ImageGalleryBlock,
  pricing: PricingBlock,
  tabbedContent: TabbedContentBlock,
  table: TableBlock,
  testimonial: TestimonialBlock,
  twoColumn: TwoColumnBlock,
  youtube: YoutubeBlock,
}

export const RenderBlocks: React.FC<{
  blocks: Page['layout'][0][]
  locale: TypedLocale
}> = (props) => {
  const { blocks, locale } = props

  const hasBlocks = blocks && Array.isArray(blocks) && blocks.length > 0

  if (hasBlocks) {
    return (
      <Fragment>
        {blocks.map((block, index) => {
          const { blockType } = block

          if (blockType && blockType in blockComponents) {
            const Block = blockComponents[blockType]

            if (Block) {
              return (
                <div className="my-16" key={index}>
                  {/* @ts-expect-error */}
                  <Block {...block} locale={locale} />
                </div>
              )
            }
          }
          return null
        })}
      </Fragment>
    )
  }

  return null
}

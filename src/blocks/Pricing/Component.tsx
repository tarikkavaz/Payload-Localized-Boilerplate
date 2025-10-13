"use client"
import React, { useState } from 'react'
import { Check, X } from 'lucide-react'
import { Switch } from '@/components/ui/switch'
import { Media } from '@/components/Media'
import RichText from '@/components/RichText'
import { CMSLink } from '@/components/Link'
import { cn } from '@/utilities/ui'
import type { Media as MediaType } from '@/payload-types'
import { useTranslations } from 'next-intl'

type Props = {
  currency?: string
  locale?: string
  options: {
    title: string
    media: MediaType | string | number
    monthlyPrice: number
    annualPrice?: number
    content: any
    features: {
      text: string
      isAvailable: boolean
    }[]
    links: {
      link: {
        type: 'custom'
        url: string
        label: string
        appearance?: 'default' | 'outline'
      }
    }[]
    isFeatured: boolean
  }[]
}

export const PricingBlock: React.FC<Props> = ({ options, currency = '$', locale = 'en' }) => {
  const t = useTranslations('pricing')
  const [isAnnual, setIsAnnual] = useState(false)

  const calculateSavings = (monthly: number, annual?: number) => {
    if (!annual) return 0
    return Math.round(((monthly - annual) / monthly) * 100)
  }

  return (
    <div className="container pb-12 border-t border-b border-border">
      <div className="flex justify-center my-8">
        <div className="flex items-center gap-2 pb-8">
          <span className="text-foreground">{t('monthly')}</span>
          <Switch
            checked={isAnnual}
            onCheckedChange={setIsAnnual}
            className="data-[state=checked]:bg-foreground data-[state=unchecked]:bg-foreground"
          />
          <span className="text-foreground">{t('annual')}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {options.map((option, index) => {
          const monthlyAmount = isAnnual ? option.annualPrice || option.monthlyPrice : option.monthlyPrice
          const yearlyTotal = monthlyAmount * 12
          const savings = calculateSavings(option.monthlyPrice, option.annualPrice)

          return (
            <div
              key={index}
              className={cn(
                'rounded-lg border p-6 relative flex flex-col',
                option.isFeatured && 'border-primary shadow-lg scale-105'
              )}
            >
              {option.isFeatured && (
                <span className="absolute px-4 py-1 text-sm -translate-x-1/2 rounded-full text-background -top-4 left-1/2 bg-primary">
                  {t('featured')}
                </span>
              )}

              <div className="mb-6 text-center">
                <h3 className="mb-4 text-2xl font-bold">{option.title}</h3>
                <div className="w-full h-auto mx-auto mb-4">
                  <Media resource={option.media} className="object-contain w-full h-full" />
                </div>
                <div className="mb-2 text-3xl font-bold">
                  {currency}{monthlyAmount.toLocaleString()}
                  <span className="text-sm font-normal">{t('per-month')}</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  {currency}{yearlyTotal.toLocaleString()}{t('per-year')}
                </div>
                <div className="h-[24px]">
                  {isAnnual && option.annualPrice && savings > 0 && (
                    <div className="text-sm text-green-600">
                      {t('save')} {savings}%
                    </div>
                  )}
                </div>
              </div>

              <div className="mb-6">
                <RichText content={option.content} />
              </div>

              <ul className="flex-grow mb-6 space-y-3">
                {option.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center gap-2">
                    {feature.isAvailable ? (
                      <Check className="w-5 h-5 text-green-500" />
                    ) : (
                      <X className="w-5 h-5 text-red-500" />
                    )}
                    <span className="text-sm text-muted-foreground">{feature.text}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-auto">
                <div className="flex flex-col gap-2">
                  {option.links.map((linkItem, linkIndex) => (
                    <CMSLink
                      key={linkIndex}
                      {...linkItem.link}
                    />
                  ))}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
} 
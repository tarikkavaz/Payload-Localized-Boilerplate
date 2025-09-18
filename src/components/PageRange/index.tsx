import { useLocale, useTranslations } from 'next-intl'
import React from 'react'

export const PageRange: React.FC<{
  className?: string
  currentPage?: number
  limit?: number
  totalDocs?: number
  // pass "post" to say posts; anything else -> generic "result/sonuç"
  kind?: 'post' | 'result'
}> = (props) => {
  const { className, currentPage = 1, limit = 1, totalDocs = 0, kind = 'result' } = props
  const t = useTranslations()
  const locale = useLocale()
  const nf = new Intl.NumberFormat(locale)

  let indexStart = (currentPage - 1) * limit + 1
  if (totalDocs && indexStart > totalDocs) indexStart = 0

  let indexEnd = currentPage * limit
  if (totalDocs && indexEnd > totalDocs) indexEnd = totalDocs

  if (!totalDocs || indexStart === 0) {
    return <div className={[className, 'font-semibold'].filter(Boolean).join(' ')}>{t('no-results')}</div>
  }

  return (
    <div className={[className, 'font-semibold'].filter(Boolean).join(' ')}>
      {t('range', {
        start: nf.format(indexStart),
        end: nf.format(indexEnd),
        total: nf.format(totalDocs),
        kind
      })}
    </div>
  )
}

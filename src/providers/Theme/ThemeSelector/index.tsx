'use client'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import React, { useState } from 'react'

import type { Theme } from './types'
import { useTranslations } from 'next-intl'
import { useTheme } from '..'
import { themeLocalStorageKey } from './types'

interface ThemeSelectorProps {
  className?: string
  rotateChevron?: boolean
}

export const ThemeSelector: React.FC<ThemeSelectorProps> = ({ className, rotateChevron }) => {
  const { theme, setTheme } = useTheme()
  const t = useTranslations()
  
  const onThemeChange = (themeToSet: Theme & 'auto') => {
    if (themeToSet === 'auto') {
      setTheme(null)
    } else {
      setTheme(themeToSet)
    }
  }

  const value = theme || 'auto'

  return (
    <Select onValueChange={onThemeChange} value={value}>
      <SelectTrigger className={`w-auto text-sm bg-transparent gap-2 px-0 md:pl-3 border-none ${className || ''} ${rotateChevron ? '[&_svg]:rotate-180' : ''}`}>
        <SelectValue placeholder="Theme" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="auto">{t('auto')}</SelectItem>
        <SelectItem value="light">{t('light')}</SelectItem>
        <SelectItem value="dark">{t('dark')}</SelectItem>
      </SelectContent>
    </Select>
  )
}

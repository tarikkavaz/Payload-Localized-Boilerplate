'use client'

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { ChevronDown, Check } from 'lucide-react'
import React, { useState, useEffect } from 'react'

import type { Theme } from './types'
import { useTranslations } from 'next-intl'
import { useTheme } from '..'
import { themeLocalStorageKey } from './types'

interface ThemeSelectorProps {
  className?: string
  rotateChevron?: boolean
  variant?: 'default' | 'footer'
}

export const ThemeSelector: React.FC<ThemeSelectorProps> = ({ className, rotateChevron, variant = 'default' }) => {
  const { theme, setTheme } = useTheme()
  const t = useTranslations()
  const [mounted, setMounted] = useState(false)
  const [open, setOpen] = useState(false)
  
  useEffect(() => {
    setMounted(true)
  }, [])
  
  const onThemeChange = (themeToSet: Theme | 'auto') => {
    if (themeToSet === 'auto') {
      setTheme(null)
    } else {
      setTheme(themeToSet)
    }
    setOpen(false)
  }

  const value = theme || 'auto'

  const getThemeLabel = (themeValue: string) => {
    switch (themeValue) {
      case 'auto': return t('auto');
      case 'light': return t('light');
      case 'dark': return t('dark');
      default: return t('auto');
    }
  };

  // Color classes based on variant
  const getColorClasses = () => {
    if (variant === 'footer') {
      return {
        trigger: 'text-primary dark:text-white hover:text-primary/80 dark:hover:text-white/80',
        chevron: 'text-primary/60 dark:text-white/60',
        button: 'text-primary dark:text-white hover:bg-muted dark:hover:bg-white/5',
        buttonActive: 'bg-foreground text-background'
      }
    }
    return {
      trigger: 'text-primary dark:text-white hover:text-primary/80 dark:hover:text-white/80',
      chevron: 'text-primary/60 dark:text-white/60',
      button: 'text-primary dark:text-white hover:bg-muted dark:hover:bg-white/5',
      buttonActive: 'bg-foreground text-background'
    }
  };

  const colors = getColorClasses();

  if (!mounted) {
    return (
      <div className={`flex items-center gap-x-1 text-sm font-semibold bg-transparent px-0 md:pl-3 border-none ${colors.trigger} ${className || ''}`}>
        {t('auto')}
        <ChevronDown 
          aria-hidden="true" 
          className={`h-5 w-5 flex-none ${colors.chevron} ${rotateChevron ? 'rotate-180' : ''}`} 
        />
      </div>
    )
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger className={`flex items-center gap-x-1 text-sm font-semibold bg-transparent px-0 md:pl-3 border-none transition-colors ${colors.trigger} ${className || ''}`}>
        {getThemeLabel(value)}
        <ChevronDown 
          aria-hidden="true" 
          className={`h-5 w-5 flex-none ${colors.chevron} ${rotateChevron ? 'rotate-180' : ''}`} 
        />
      </PopoverTrigger>
      <PopoverContent 
        className={`w-56 p-2 border shadow-lg ${
          variant === 'footer' 
            ? 'bg-popover border-border' 
            : 'bg-popover dark:bg-popover border-border dark:border-white/10'
        }`}
        align="start"
      >
        {[
          { key: 'auto', label: t('auto') },
          { key: 'light', label: t('light') },
          { key: 'dark', label: t('dark') }
        ].map((themeOption) => {
          const isActive = value === themeOption.key;
          return (
            <button
              key={themeOption.key}
              className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-semibold transition-colors text-primary ${
                isActive 
                  ? colors.buttonActive
                  : colors.button
              }`}
              onClick={() => onThemeChange(themeOption.key as Theme | 'auto')}
            >
              <span>{themeOption.label}</span>
              {isActive && <Check className="h-4 w-4" />}
            </button>
          );
        })}
      </PopoverContent>
    </Popover>
  )
}

import React from 'react'
import { cn } from '@/utilities/ui'

export const Logo = ({ className }: { className?: string }) => {
  return (
    /* eslint-disable @next/next/no-img-element */
    <img
      alt="Logo"
      className={cn("w-auto h-auto", className)}
      // className={cn("invert dark:invert-0", className)}
      // src="https://raw.githubusercontent.com/payloadcms/payload/main/packages/ui/src/assets/payload-logo-light.svg"
      src="logo.svg"
    />
  )
}

'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { cn } from '@/utilities/ui'
import type { BoxData } from '../Component'

interface BoxGalleryLayoutProps {
  boxes: BoxData[]
  animationSpeed: number
  columnAmount: string
}

export const BoxGallery: React.FC<BoxGalleryLayoutProps> = ({
  boxes,
  animationSpeed,
  columnAmount,
}) => {
  if (!boxes.length) return null

  const columnClasses: Record<string, string> = {
    '2': 'grid-cols-1 sm:grid-cols-2',
    '3': 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    '4': 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
  }
  const gridClass = columnClasses[columnAmount] || columnClasses['3']

  // Determine how many images to prioritize based on column count
  const priorityCount = parseInt(columnAmount) || 3

  return (
    <div className={cn('container grid gap-4 mx-auto', gridClass)}>
      {boxes.map((box, idx) => (
        <BoxItem
          key={idx}
          box={box}
          animationSpeed={animationSpeed}
          isPriority={idx < priorityCount}
        />
      ))}
    </div>
  )
}

interface BoxItemProps {
  box: BoxData
  animationSpeed: number
  isPriority?: boolean
}

const BoxItem: React.FC<BoxItemProps> = ({ box, animationSpeed, isPriority = false }) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isHovering, setIsHovering] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (isHovering || !isMounted) return
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % box.media.length)
    }, animationSpeed * 1000)
    return () => clearInterval(interval)
  }, [isHovering, animationSpeed, box.media.length, isMounted])

  return (
    <div
      className="flex flex-col rounded-lg border-1 border-foreground/30"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div className="relative aspect-[1/1] overflow-hidden bg-gray-100 rounded-lg dark:bg-gray-800">
        {box.media.map((m, i) => {
          const shouldPrioritize = isPriority && i === 0
          const isVisible = currentIndex === i
          return (
            <motion.div
              key={i}
              initial={false}
              animate={{ opacity: isVisible ? 1 : 0 }}
              transition={{ duration: isMounted ? 0.5 : 0 }}
              className="absolute inset-0 w-full h-full"
            >
              <Image
                src={m.url}
                alt={m.alt}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover transition-transform duration-300 hover:scale-105 !m-0"
                {...(shouldPrioritize && { priority: true })}
              />
            </motion.div>
          )
        })}
      </div>
      <div className="mt-2 text-center">
        <h3 className="font-semibold line-clamp-2">{box.title}</h3>
        {box.description && <p className="text-sm line-clamp-2">{box.description}</p>}
      </div>
    </div>
  )
}

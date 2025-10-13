'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { ImageType } from '../Component'
import { Dialog } from '@/components/Dialog'

interface GridProps {
  images: ImageType[]
  modal?: boolean
  size?: '2 Images' | '3 Images' | '4 Images'
}

export const Grid: React.FC<GridProps> = ({ images, modal = true, size = '3 Images' }) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null)

  const columns = {
    '2 Images': 'grid-cols-1 sm:grid-cols-2',
    '3 Images': 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    '4 Images': 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
  }

  const handlePrevious = useCallback(() => {
    if (selectedImageIndex !== null) {
      setSelectedImageIndex((prev) => (prev! - 1 + images.length) % images.length)
    }
  }, [selectedImageIndex, images.length])

  const handleNext = useCallback(() => {
    if (selectedImageIndex !== null) {
      setSelectedImageIndex((prev) => (prev! + 1) % images.length)
    }
  }, [selectedImageIndex, images.length])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedImageIndex === null) return

      switch (e.key) {
        case 'ArrowLeft':
          handlePrevious()
          break
        case 'ArrowRight':
          handleNext()
          break
        case 'Escape':
          setSelectedImageIndex(null)
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectedImageIndex, handleNext, handlePrevious])

  return (
    <>
      <div className={`container grid ${columns[size]} gap-4`}>
        {images.map((image, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className={`relative overflow-hidden bg-gray-100 rounded-lg aspect-[1/1] dark:bg-gray-800 scale-85 ${modal ? 'cursor-pointer' : ''}`}
            onClick={() => modal && setSelectedImageIndex(index)}
          >
            <div className="relative w-full h-full">
              <Image
                src={image.media.url}
                alt={image.media.alt}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover transition-transform duration-300 hover:scale-105 !m-0"
              />
            </div>
            {image.caption && (
              <div className="absolute bottom-0 left-0 right-0 p-2 text-sm text-white bg-black/50">
                {image.caption}
              </div>
            )}
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {modal && selectedImageIndex !== null && (
          <Dialog open={selectedImageIndex !== null} onClose={() => setSelectedImageIndex(null)}>
            <div className="relative w-[90vw] h-[90vh] max-w-7xl">
              <div className="relative w-full h-full">
                <Image
                  src={images[selectedImageIndex].media.url}
                  alt={images[selectedImageIndex].media.alt}
                  fill
                  sizes="90vw"
                  priority
                  className="object-contain"
                />
              </div>
              {images[selectedImageIndex].caption && (
                <div className="absolute bottom-0 left-0 right-0 p-4 text-center text-white bg-black/50">
                  {images[selectedImageIndex].caption}
                </div>
              )}

              <button
                onClick={handlePrevious}
                className="absolute p-2 text-white transition-colors -translate-y-1/2 rounded-full cursor-pointer left-4 top-1/2 bg-black/50 hover:bg-black/75"
                aria-label="Previous image"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 19.5L8.25 12l7.5-7.5"
                  />
                </svg>
              </button>

              <button
                onClick={handleNext}
                className="absolute p-2 text-white transition-colors -translate-y-1/2 rounded-full cursor-pointer right-4 top-1/2 bg-black/50 hover:bg-black/75"
                aria-label="Next image"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8.25 4.5l7.5 7.5-7.5 7.5"
                  />
                </svg>
              </button>
            </div>
          </Dialog>
        )}
      </AnimatePresence>
    </>
  )
}

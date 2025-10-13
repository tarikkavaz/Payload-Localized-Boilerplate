'use client'

import React, { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { AnimatePresence } from 'framer-motion'
import MotionTicker from 'framer-motion-ticker'
import { ImageType } from '../Component'
import { Dialog } from '@/components/Dialog'

interface TickerProps {
  images: ImageType[]
  modal?: boolean
  speed?: number
}

export const Ticker: React.FC<TickerProps> = ({ images, modal = true, speed = 3 }) => {
  const [isHovering, setIsHovering] = useState(false)
  const [selectedImage, setSelectedImage] = useState<ImageType | null>(null)
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)

  // Calculate duration based on speed (lower speed value = faster ticker)
  // The framer-motion-ticker uses duration in seconds
  const duration = 30 / speed

  const handleImageClick = (image: ImageType, index: number) => {
    if (modal) {
      setSelectedImage(image)
      setSelectedIndex(index)
    }
  }

  const handleCloseModal = useCallback(() => {
    setSelectedImage(null)
    setSelectedIndex(null)
  }, [])

  const handlePrevious = useCallback(() => {
    if (selectedIndex !== null) {
      const newIndex = (selectedIndex - 1 + images.length) % images.length
      setSelectedIndex(newIndex)
      setSelectedImage(images[newIndex])
    }
  }, [selectedIndex, images])

  const handleNext = useCallback(() => {
    if (selectedIndex !== null) {
      const newIndex = (selectedIndex + 1) % images.length
      setSelectedIndex(newIndex)
      setSelectedImage(images[newIndex])
    }
  }, [selectedIndex, images])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedImage) return

      switch (e.key) {
        case 'ArrowLeft':
          handlePrevious()
          break
        case 'ArrowRight':
          handleNext()
          break
        case 'Escape':
          handleCloseModal()
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectedImage, selectedIndex, handleNext, handlePrevious, handleCloseModal])

  return (
    <>
      <div
        className="relative overflow-hidden min-h-52"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <MotionTicker duration={duration} isPlaying={!isHovering && !selectedImage}>
          {images.map((image, index) => (
            <div
              key={`${index}-${image.media.url}`}
              className={`relative px-2 ${modal ? 'cursor-pointer' : ''}`}
              style={{ height: '100%', width: '350px' }}
              onClick={() => handleImageClick(image, index)}
            >
              <div className="relative w-full h-full">
                <div className="relative aspect-[19/10] overflow-hidden bg-gray-100 rounded-lg dark:bg-gray-800">
                  <Image
                    src={image.media.url}
                    alt={image.media.alt}
                    fill
                    sizes="350px"
                    className="object-cover transition-transform duration-300 hover:scale-105"
                  />
                  {image.caption && (
                    <div className="absolute bottom-0 left-0 right-0 z-10 p-4 text-center">
                      <span className="px-4 py-2 text-white rounded-md bg-black/50">
                        {image.caption}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </MotionTicker>
      </div>

      <AnimatePresence>
        {modal && selectedImage && (
          <Dialog open={!!selectedImage} onClose={handleCloseModal}>
            <div className="relative w-[90vw] h-[90vh] max-w-7xl">
              <div className="relative w-full h-full">
                <Image
                  src={selectedImage.media.url}
                  alt={selectedImage.media.alt}
                  fill
                  sizes="90vw"
                  priority
                  className="object-contain"
                />
              </div>
              {selectedImage.caption && (
                <div className="absolute bottom-0 left-0 right-0 z-10 p-4 text-center">
                  <span className="px-4 py-2 text-white rounded-md bg-black/50">
                    {selectedImage.caption}
                  </span>
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

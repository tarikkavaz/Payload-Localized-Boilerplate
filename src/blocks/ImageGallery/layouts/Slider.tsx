'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { ImageType } from '../Component'
import { Dialog } from '@/components/Dialog'

interface SliderProps {
  images: ImageType[]
  autoplay?: boolean
  speed?: number
}

export const Slider: React.FC<SliderProps> = ({ images, autoplay = true, speed = 3 }) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedImage, setSelectedImage] = useState<ImageType | null>(null)
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)

  useEffect(() => {
    if (!autoplay || selectedImage) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length)
    }, speed * 1000)

    return () => clearInterval(interval)
  }, [autoplay, images.length, speed, selectedImage])

  const handlePrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)
  }, [images.length])

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % images.length)
  }, [images.length])

  const handleImageClick = (index: number) => {
    setSelectedImage(images[index])
    setSelectedIndex(index)
  }

  const handleCloseModal = useCallback(() => {
    setSelectedImage(null)
    setSelectedIndex(null)
  }, [])

  const handleModalPrevious = useCallback(() => {
    if (selectedIndex !== null) {
      const newIndex = (selectedIndex - 1 + images.length) % images.length
      setSelectedIndex(newIndex)
      setSelectedImage(images[newIndex])
    }
  }, [selectedIndex, images])

  const handleModalNext = useCallback(() => {
    if (selectedIndex !== null) {
      const newIndex = (selectedIndex + 1) % images.length
      setSelectedIndex(newIndex)
      setSelectedImage(images[newIndex])
    }
  }, [selectedIndex, images])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedImage !== null) {
        // When modal is open
        switch (e.key) {
          case 'ArrowLeft':
            handleModalPrevious()
            break
          case 'ArrowRight':
            handleModalNext()
            break
          case 'Escape':
            handleCloseModal()
            break
        }
      } else {
        // When just viewing the slider
        switch (e.key) {
          case 'ArrowLeft':
            handlePrevious()
            break
          case 'ArrowRight':
            handleNext()
            break
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [
    selectedImage,
    selectedIndex,
    handleNext,
    handlePrevious,
    handleModalNext,
    handleModalPrevious,
    handleCloseModal,
  ])

  return (
    <div className="relative h-full overflow-hidden rounded-lg ">
      <div className="relative aspect-[16/9] sm:aspect-[16/10] md:aspect-[16/9] lg:aspect-[21/9] xl:aspect-[21/9]">
        {images.map((image, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0 }}
            animate={{ opacity: index === currentIndex ? 1 : 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 w-full h-full cursor-pointer"
            onClick={() => handleImageClick(index)}
          >
            <div className="relative w-full h-full">
              <Image
                src={image.media.url}
                alt={image.media.alt}
                fill
                priority
                sizes="100vw"
                className="object-contain"
              />
            </div>
            {image.caption && (
              <div className="absolute left-0 right-0 z-10 p-4 text-center bottom-8">
                <span className="px-4 py-2 text-white rounded-md bg-black/50">{image.caption}</span>
              </div>
            )}
          </motion.div>
        ))}
      </div>

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
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
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
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
        </svg>
      </button>

      <div className="absolute flex gap-2 -translate-x-1/2 bottom-4 left-1/2">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`h-2 w-2 rounded-full transition-colors ${
              index === currentIndex ? 'bg-white' : 'bg-white/50 hover:bg-white/75'
            }`}
            aria-label={`Go to image ${index + 1}`}
          />
        ))}
      </div>

      <AnimatePresence>
        {selectedImage && (
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
                onClick={handleModalPrevious}
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
                onClick={handleModalNext}
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
    </div>
  )
}

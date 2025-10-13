'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { ImageType } from '../Component'
import { Dialog } from '@/components/Dialog'

interface MasonryProps {
  images: ImageType[]
  modal?: boolean
  size?: '2 Images' | '3 Images' | '4 Images'
}

export const Masonry: React.FC<MasonryProps> = ({ images, modal = true, size = '3 Images' }) => {
  const [selectedImage, setSelectedImage] = useState<ImageType | null>(null)

  // Map size options to Tailwind columns classes
  const columnClasses = {
    '2 Images': 'columns-1 sm:columns-2',
    '3 Images': 'columns-1 sm:columns-2 lg:columns-3',
    '4 Images': 'columns-1 sm:columns-2 md:columns-3 lg:columns-4',
  }

  return (
    <>
      <div className={`container ${columnClasses[size]} gap-4 space-y-4`}>
        {images.map((image, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className={`mb-4 overflow-hidden bg-gray-100 rounded-lg shadow-md break-inside-avoid-column dark:bg-gray-800 ${modal ? 'cursor-pointer' : ''}`}
            onClick={() => modal && setSelectedImage(image)}
          >
            <Image
              src={image.media.url}
              alt={image.media.alt || ''}
              width={0}
              height={0}
              sizes={
                size === '2 Images'
                  ? '(max-width: 640px) 100vw, 50vw'
                  : size === '3 Images'
                    ? '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'
                    : '(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw'
              }
              style={{
                width: '100%',
                height: 'auto',
                display: 'block',
              }}
              className="w-full transition-transform duration-300 hover:scale-105"
            />
            {image.caption && (
              <div className="p-2 text-sm text-white bg-black/50">{image.caption}</div>
            )}
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {modal && selectedImage && (
          <Dialog open={!!selectedImage} onClose={() => setSelectedImage(null)}>
            <div className="relative w-[90vw] h-[90vh] max-w-7xl">
              <div className="relative w-full h-full">
                <Image
                  src={selectedImage.media.url}
                  alt={selectedImage.media.alt || ''}
                  fill
                  sizes="90vw"
                  priority
                  className="object-contain"
                />
              </div>
              {selectedImage.caption && (
                <div className="absolute bottom-0 left-0 right-0 p-4 text-center text-white bg-black/50">
                  {selectedImage.caption}
                </div>
              )}
            </div>
          </Dialog>
        )}
      </AnimatePresence>
    </>
  )
}

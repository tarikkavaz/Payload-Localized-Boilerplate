'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { TestimonialType } from '../Component'
import { Dialog } from '@/components/Dialog'
import RichText from '@/components/RichText'

interface MasonryProps {
  testimonials: TestimonialType[]
  modal?: boolean
  size?: '2 Images' | '3 Images' | '4 Images'
}

export const Masonry: React.FC<MasonryProps> = ({
  testimonials,
  modal = true,
  size = '3 Images',
}) => {
  const [selectedTestimonial, setSelectedTestimonial] = useState<TestimonialType | null>(null)

  const columns = {
    '2 Images': 2,
    '3 Images': 3,
    '4 Images': 4,
  }

  const columnCount = columns[size]

  // Distribute testimonials into columns
  const columnTestimonials: TestimonialType[][] = Array.from({ length: columnCount }, () => [])

  testimonials.forEach((testimonial, i) => {
    const columnIndex = i % columnCount
    columnTestimonials[columnIndex].push(testimonial)
  })

  return (
    <>
      <div className="container grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {columnTestimonials.map((column, columnIndex) => (
          <div key={columnIndex} className="flex flex-col gap-4">
            {column.map((testimonial, index) => (
              <motion.div
                key={`${columnIndex}-${index}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`
                  relative overflow-hidden border border-border rounded-lg p-6 ${modal ? 'cursor-pointer' : ''} shadow-md
                `}
                onClick={() => modal && setSelectedTestimonial(testimonial)}
              >
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 mb-4 overflow-hidden rounded-full">
                    <Image
                      src={testimonial.avatar.url}
                      alt={testimonial.avatar.alt || testimonial.name}
                      width={64}
                      height={64}
                      className="object-cover w-full h-full"
                    />
                  </div>

                  <div className="mb-4 text-center">
                    <h3 className="text-lg font-bold">{testimonial.name}</h3>
                    {(testimonial.job || testimonial.company) && (
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {testimonial.job ? testimonial.job : ''}
                        {testimonial.job && testimonial.company ? ' @ ' : ''}
                        {testimonial.company ? testimonial.company : ''}
                      </p>
                    )}
                  </div>

                  <div className="mt-2 text-sm text-gray-700 dark:text-gray-300">
                    {typeof testimonial.message === 'string' ? (
                      <p>{testimonial.message}</p>
                    ) : (
                      <RichText content={testimonial.message} />
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ))}
      </div>

      <AnimatePresence>
        {modal && selectedTestimonial && (
          <Dialog open={!!selectedTestimonial} onClose={() => setSelectedTestimonial(null)}>
            <div className="relative w-[90vw] max-w-2xl bg-white dark:bg-gray-800 p-8 rounded-lg">
              <div className="flex flex-col items-center">
                <div className="w-24 h-24 mb-4 overflow-hidden rounded-full">
                  <Image
                    src={selectedTestimonial.avatar.url}
                    alt={selectedTestimonial.avatar.alt || selectedTestimonial.name}
                    width={96}
                    height={96}
                    className="object-cover w-full h-full"
                  />
                </div>

                <div className="mb-6 text-center">
                  <h3 className="text-xl font-bold dark:text-white">{selectedTestimonial.name}</h3>
                  {(selectedTestimonial.job || selectedTestimonial.company) && (
                    <p className="text-gray-500 text-md dark:text-gray-400">
                      {selectedTestimonial.job ? selectedTestimonial.job : ''}
                      {selectedTestimonial.job && selectedTestimonial.company ? ' @ ' : ''}
                      {selectedTestimonial.company ? selectedTestimonial.company : ''}
                    </p>
                  )}
                </div>

                <div className="mt-4 dark:text-gray-300">
                  {typeof selectedTestimonial.message === 'string' ? (
                    <p>{selectedTestimonial.message}</p>
                  ) : (
                    <RichText content={selectedTestimonial.message} />
                  )}
                </div>
              </div>
            </div>
          </Dialog>
        )}
      </AnimatePresence>
    </>
  )
}

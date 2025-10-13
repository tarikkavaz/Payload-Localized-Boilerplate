'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { TestimonialType } from '../Component'
import { Dialog } from '@/components/Dialog'
import RichText from '@/components/RichText'

interface GridProps {
  testimonials: TestimonialType[]
  modal?: boolean
  size?: '2 Images' | '3 Images' | '4 Images'
}

export const Grid: React.FC<GridProps> = ({ testimonials, modal = true, size = '3 Images' }) => {
  const [selectedTestimonialIndex, setSelectedTestimonialIndex] = useState<number | null>(null)

  const columns = {
    '2 Images': 'grid-cols-1 sm:grid-cols-2',
    '3 Images': 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    '4 Images': 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
  }

  const handlePrevious = useCallback(() => {
    if (selectedTestimonialIndex !== null) {
      setSelectedTestimonialIndex((prev) => (prev! - 1 + testimonials.length) % testimonials.length)
    }
  }, [selectedTestimonialIndex, testimonials.length])

  const handleNext = useCallback(() => {
    if (selectedTestimonialIndex !== null) {
      setSelectedTestimonialIndex((prev) => (prev! + 1) % testimonials.length)
    }
  }, [selectedTestimonialIndex, testimonials.length])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedTestimonialIndex === null) return

      switch (e.key) {
        case 'ArrowLeft':
          handlePrevious()
          break
        case 'ArrowRight':
          handleNext()
          break
        case 'Escape':
          setSelectedTestimonialIndex(null)
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectedTestimonialIndex, handleNext, handlePrevious])

  return (
    <>
      <div className={`container grid ${columns[size]} gap-4`}>
        {testimonials.map((testimonial, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className={`relative p-6 overflow-hidden border border-border rounded-lg shadow-md  ${modal ? 'cursor-pointer' : ''}`}
            onClick={() => modal && setSelectedTestimonialIndex(index)}
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

              <div className="mt-2 text-sm text-gray-700 dark:text-gray-300 line-clamp-2">
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

      <AnimatePresence>
        {modal && selectedTestimonialIndex !== null && (
          <Dialog
            open={selectedTestimonialIndex !== null}
            onClose={() => setSelectedTestimonialIndex(null)}
          >
            <div className="relative w-[90vw] max-w-2xl bg-white dark:bg-gray-800 p-8 rounded-lg">
              <div className="flex flex-col items-center">
                <div className="w-24 h-24 mb-4 overflow-hidden rounded-full">
                  <Image
                    src={testimonials[selectedTestimonialIndex].avatar.url}
                    alt={
                      testimonials[selectedTestimonialIndex].avatar.alt ||
                      testimonials[selectedTestimonialIndex].name
                    }
                    width={96}
                    height={96}
                    className="object-cover w-full h-full"
                  />
                </div>

                <div className="mb-6 text-center">
                  <h3 className="text-xl font-bold dark:text-white">
                    {testimonials[selectedTestimonialIndex].name}
                  </h3>
                  {(testimonials[selectedTestimonialIndex].job ||
                    testimonials[selectedTestimonialIndex].company) && (
                    <p className="text-gray-500 text-md dark:text-gray-400">
                      {testimonials[selectedTestimonialIndex].job
                        ? testimonials[selectedTestimonialIndex].job
                        : ''}
                      {testimonials[selectedTestimonialIndex].job &&
                      testimonials[selectedTestimonialIndex].company
                        ? ' @ '
                        : ''}
                      {testimonials[selectedTestimonialIndex].company
                        ? testimonials[selectedTestimonialIndex].company
                        : ''}
                    </p>
                  )}
                </div>

                <div className="mt-4 dark:text-gray-300">
                  {typeof testimonials[selectedTestimonialIndex].message === 'string' ? (
                    <p>{testimonials[selectedTestimonialIndex].message}</p>
                  ) : (
                    <RichText content={testimonials[selectedTestimonialIndex].message} />
                  )}
                </div>
              </div>

              <button
                onClick={handlePrevious}
                className="absolute p-2 text-gray-700 transition-colors -translate-y-1/2 bg-gray-200 rounded-full cursor-pointer left-4 top-1/2 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white"
                aria-label="Previous testimonial"
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
                className="absolute p-2 text-gray-700 transition-colors -translate-y-1/2 bg-gray-200 rounded-full cursor-pointer right-4 top-1/2 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white"
                aria-label="Next testimonial"
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

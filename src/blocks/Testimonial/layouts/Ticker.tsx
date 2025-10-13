'use client'

import React, { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { AnimatePresence } from 'framer-motion'
import MotionTicker from 'framer-motion-ticker'
import { TestimonialType } from '../Component'
import { Dialog } from '@/components/Dialog'
import RichText from '@/components/RichText'

interface TickerProps {
  testimonials: TestimonialType[]
  modal?: boolean
  speed?: number
}

export const Ticker: React.FC<TickerProps> = ({ testimonials, modal = true, speed = 3 }) => {
  const [isHovering, setIsHovering] = useState(false)
  const [selectedTestimonial, setSelectedTestimonial] = useState<TestimonialType | null>(null)
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)

  // Calculate duration based on speed (lower speed value = faster ticker)
  // The framer-motion-ticker uses duration in seconds
  const duration = 30 / speed

  const handleTestimonialClick = (testimonial: TestimonialType, index: number) => {
    if (modal) {
      setSelectedTestimonial(testimonial)
      setSelectedIndex(index)
    }
  }

  const handleCloseModal = useCallback(() => {
    setSelectedTestimonial(null)
    setSelectedIndex(null)
  }, [])

  const handlePrevious = useCallback(() => {
    if (selectedIndex !== null) {
      const newIndex = (selectedIndex - 1 + testimonials.length) % testimonials.length
      setSelectedIndex(newIndex)
      setSelectedTestimonial(testimonials[newIndex])
    }
  }, [selectedIndex, testimonials])

  const handleNext = useCallback(() => {
    if (selectedIndex !== null) {
      const newIndex = (selectedIndex + 1) % testimonials.length
      setSelectedIndex(newIndex)
      setSelectedTestimonial(testimonials[newIndex])
    }
  }, [selectedIndex, testimonials])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedTestimonial) return

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
  }, [selectedTestimonial, selectedIndex, handleNext, handlePrevious, handleCloseModal])

  return (
    <>
      <div
        className="relative overflow-hidden min-h-52"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <MotionTicker duration={duration} isPlaying={!isHovering && !selectedTestimonial}>
          {testimonials.map((testimonial, index) => (
            <div
              key={`${index}-${testimonial.name}`}
              className={`relative px-2 ${modal ? 'cursor-pointer' : ''}`}
              style={{ height: '100%', width: '350px' }}
              onClick={() => handleTestimonialClick(testimonial, index)}
            >
              <div className="flex-shrink-0 h-full p-6 border rounded-lg shadow-md border-border ">
                <div className="flex flex-col items-center h-full">
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
              </div>
            </div>
          ))}
        </MotionTicker>
      </div>

      <AnimatePresence>
        {modal && selectedTestimonial && (
          <Dialog open={!!selectedTestimonial} onClose={handleCloseModal}>
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

'use client'

import React, { useCallback, useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { TestimonialType } from '../Component'
import RichText from '@/components/RichText'

interface SliderProps {
  testimonials: TestimonialType[]
  autoplay: boolean
  speed: number
}

export const Slider: React.FC<SliderProps> = ({ testimonials, autoplay = true, speed = 3 }) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)
  const autoplayTimerRef = useRef<NodeJS.Timeout | null>(null)

  const minSwipeDistance = 50

  const goToPrevious = useCallback(() => {
    const isFirstSlide = currentIndex === 0
    const newIndex = isFirstSlide ? testimonials.length - 1 : currentIndex - 1
    setCurrentIndex(newIndex)
  }, [currentIndex, testimonials.length])

  const goToNext = useCallback(() => {
    const isLastSlide = currentIndex === testimonials.length - 1
    const newIndex = isLastSlide ? 0 : currentIndex + 1
    setCurrentIndex(newIndex)
  }, [currentIndex, testimonials.length])

  const goToSlide = (slideIndex: number) => {
    setCurrentIndex(slideIndex)
  }

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
  }

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return
    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance

    if (isLeftSwipe) {
      goToNext()
    }
    if (isRightSwipe) {
      goToPrevious()
    }
  }

  // Set up autoplay timer
  useEffect(() => {
    if (autoplay && testimonials.length > 1) {
      autoplayTimerRef.current = setInterval(() => {
        goToNext()
      }, speed * 1000)
    }

    return () => {
      if (autoplayTimerRef.current) {
        clearInterval(autoplayTimerRef.current)
      }
    }
  }, [autoplay, currentIndex, testimonials.length, speed, goToNext])

  // Add keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowLeft':
          goToPrevious()
          break
        case 'ArrowRight':
          goToNext()
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [goToNext, goToPrevious])

  if (!testimonials.length) return null

  return (
    <div
      className="relative w-full max-w-6xl mx-auto overflow-hidden h-[500px]"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <div className="flex items-center justify-center h-full">
        <div
          className="absolute flex w-full h-full p-4 transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {testimonials.map((testimonial, index) => (
            <div key={index} className="flex items-center justify-center h-full min-w-full">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-3xl p-8 rounded-lg shadow-md"
              >
                <div className="flex flex-col items-center">
                  <div className="w-20 h-20 mb-4 overflow-hidden rounded-full">
                    <Image
                      src={testimonial.avatar.url}
                      alt={testimonial.avatar.alt || testimonial.name}
                      width={80}
                      height={80}
                      className="object-cover w-full h-full"
                    />
                  </div>

                  <div className="mb-6 text-center">
                    <h3 className="text-xl font-bold">{testimonial.name}</h3>
                    {(testimonial.job || testimonial.company) && (
                      <p className="text-gray-500 text-md dark:text-gray-400">
                        {testimonial.job ? testimonial.job : ''}
                        {testimonial.job && testimonial.company ? ' @ ' : ''}
                        {testimonial.company ? testimonial.company : ''}
                      </p>
                    )}
                  </div>

                  <div className="mt-4 text-center text-gray-700 dark:text-gray-300">
                    {typeof testimonial.message === 'string' ? (
                      <p>{testimonial.message}</p>
                    ) : (
                      <RichText content={testimonial.message} />
                    )}
                  </div>
                </div>
              </motion.div>
            </div>
          ))}
        </div>
      </div>

      {/* Left Arrow */}
      <div className="absolute z-10 p-2 text-2xl text-white -translate-y-1/2 rounded-full cursor-pointer top-1/2 left-2 bg-black/20">
        <button
          onClick={(e) => {
            e.stopPropagation()
            goToPrevious()
          }}
          className="flex items-center justify-center w-10 h-10"
          aria-label="Previous testimonial"
        >
          ←
        </button>
      </div>

      {/* Right Arrow */}
      <div className="absolute z-10 p-2 text-2xl text-white -translate-y-1/2 rounded-full cursor-pointer top-1/2 right-2 bg-black/20">
        <button
          onClick={(e) => {
            e.stopPropagation()
            goToNext()
          }}
          className="flex items-center justify-center w-10 h-10"
          aria-label="Next testimonial"
        >
          →
        </button>
      </div>

      {/* Dots */}
      <div className="absolute left-0 right-0 bottom-4">
        <div className="flex items-center justify-center gap-2">
          {testimonials.map((_, slideIndex) => (
            <div
              key={slideIndex}
              onClick={() => goToSlide(slideIndex)}
              className={`
                transition-all w-3 h-3 rounded-full cursor-pointer
                ${slideIndex === currentIndex ? 'bg-blue-500' : 'bg-blue-500/30'}
              `}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

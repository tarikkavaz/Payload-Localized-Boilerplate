"use client"
import React, { useState } from 'react'
import type { Page } from '@/payload-types'
import Image from 'next/image'

type Props = Extract<Page['layout'][0], { blockType: 'youtube' }>

export const YoutubeBlock: React.FC<Props> = (props) => {
  const { videourl } = props
  const [isPlaying, setIsPlaying] = useState(false)

  // Extract video ID from the URL
  const getVideoId = (url: string): string => {
    if (!url) return ''
    
    // Handle multiple YouTube URL formats
    const regexPatterns = [
      /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([^&]+)/,
      /(?:https?:\/\/)?(?:www\.)?youtu\.be\/([^?]+)/,
      /(?:https?:\/\/)?(?:www\.)?youtube\.com\/embed\/([^?]+)/
    ]
    
    for (const pattern of regexPatterns) {
      const match = url.match(pattern)
      if (match && match[1]) return match[1]
    }
    
    return ''
  }

  const videoId = getVideoId(videourl || '')

  if (!videoId) {
    return (
      <div className="container my-16">
        <div className="w-full max-w-4xl mx-auto">
          <div className="p-4 text-center border rounded-lg border-border bg-card">
            Invalid or missing YouTube URL
          </div>
        </div>
      </div>
    )
  }

  const handlePlayClick = () => {
    setIsPlaying(true)
  }

  return (
    <div className="container">
      <div className="w-full mx-auto">
        <div className="overflow-hidden rounded-lg">
          {!isPlaying ? (
            <div 
              className="relative w-full cursor-pointer aspect-video"
              onClick={handlePlayClick}
            >
              <Image 
                src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
                alt="YouTube thumbnail"
                className="object-cover rounded-lg"
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                onError={(e) => {
                  // Fallback to medium quality if maxres is not available
                  const imgElement = e.target as HTMLImageElement;
                  imgElement.src = `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
                }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="flex items-center justify-center w-16 h-16 bg-red-600 rounded-full hover:bg-red-700 transition-colors">
                  <div className="w-0 h-0 ml-1 border-l-[12px] border-l-white border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent"></div>
                </div>
              </div>
            </div>
          ) : (
            <iframe
              className="w-full rounded-lg aspect-video"
              src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              loading="lazy"
            />
          )}
        </div>
      </div>
    </div>
  )
} 
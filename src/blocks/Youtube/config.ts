import type { Block } from 'payload'

export const Youtube: Block = {
  slug: 'youtube',
  interfaceName: 'YoutubeBlock',
  fields: [
    {
      name: 'videourl',
      type: 'text',
      required: true,
      label: 'YouTube Video URL',
      validate: (value) => {
        if (!value) return true
        const youtubeRegex = /^https:\/\/www\.youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)(&.*)?$/
        if (!youtubeRegex.test(value)) {
          return 'Please enter a valid YouTube video URL (https://www.youtube.com/watch?v=...)'
        }
        return true
      },
    },
  ],
  labels: {
    singular: 'YouTube Block',
    plural: 'YouTube Blocks',
  },
} 
import { withPayload } from '@payloadcms/next/withPayload'
import createNextIntlPlugin from 'next-intl/plugin'
import { setMaxListeners } from 'events'

// Fix MaxListenersExceededWarning for process event listeners
// This is common in Next.js + Payload CMS with multiple plugins
setMaxListeners(50)

const withNextIntl = createNextIntlPlugin()

import redirects from './redirects.js'

const NEXT_PUBLIC_SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    qualities: [75, 90, 100],
    // Increase timeout for image optimization
    minimumCacheTTL: 60,
    // Configure image loader to handle both API and direct media URLs
    remotePatterns: [
      ...[NEXT_PUBLIC_SERVER_URL /* 'https://example.com' */].map((item) => {
        const url = new URL(item)

        return {
          hostname: url.hostname,
          protocol: url.protocol.replace(':', ''),
        }
      }),
    ],
  },
  reactStrictMode: true,
  redirects,
  output: 'standalone',
}

export default withNextIntl(withPayload(nextConfig))

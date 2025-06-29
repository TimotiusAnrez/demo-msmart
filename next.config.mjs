import { withPayload } from '@payloadcms/next/withPayload'

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Your Next.js config here
  images: {
    remotePatterns: [
      new URL('https://images.unsplash.com/**'),
      new URL('https://www.flaticon.com/**'),
    ],
  },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })

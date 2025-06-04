import type { MetadataRoute } from 'next'
 
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Spend AI',
    short_name: 'Spend AI',
    description: 'AI-powered expense tracking',
    start_url: '/my',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#000000',
    icons: [
      {
        src: '/logo-128x128.png',
        sizes: '128x128',
        type: 'image/png',
      },
      {
        src: '/logo-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}
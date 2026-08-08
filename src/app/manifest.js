export default function manifest() {
  return {
    name: 'Balance Island Admin',
    short_name: 'AdminPortal',
    description: 'Management dashboard for Balance Island',
    start_url: '/admin',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#1c1c1c',
    icons: [
      {
        src: '/icon.jpg',
        sizes: '192x192',
        type: 'image/jpeg',
      },
      {
        src: '/icon.jpg',
        sizes: '512x512',
        type: 'image/jpeg',
      },
    ],
  }
}

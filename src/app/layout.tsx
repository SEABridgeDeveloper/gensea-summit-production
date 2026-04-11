import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import VisitTracker from '@/components/VisitTracker'

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'Gen SEA Summit 2026 — Building Amidst Chaos',
  description:
    'Gen SEA Summit 2026 — One Summit. One Region. One Future. One Generation. 16–18 July 2026, Khon Kaen, Thailand.',
      icons: {
    icon: '/logo.webp',        // browser tab
    apple: '/logo.webp',       // iOS home screen
  },
    openGraph: {
    title: 'Gen SEA Summit 2026 — Building Amidst Chaos',
    description: 'Gen SEA Summit 2026 — One Summit. One Region. One Future. One Generation. 16–18 July 2026, Khon Kaen, Thailand.',
    images: ['/logo.webp'], // image when shared on social/search
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="no-js" suppressHydrationWarning>
      <body className={`${inter.variable} ${inter.className}`}>
        {/* JS detection: switches no-js → js before first paint */}
        <script
          dangerouslySetInnerHTML={{
            __html: "document.documentElement.className=document.documentElement.className.replace('no-js','js')",
          }}
        />
        {/* SVG noise filter definition */}
        <svg
          aria-hidden="true"
          style={{ position: 'absolute', width: 0, height: 0 }}
        >
          <filter id="noiseFilter">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.65"
              numOctaves={3}
              stitchTiles="stitch"
            />
            <feColorMatrix type="saturate" values="0" />
          </filter>
        </svg>
        <VisitTracker />
        {children}
      </body>
    </html>
  )
}

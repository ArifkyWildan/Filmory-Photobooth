import type { Metadata } from 'next'
import { ClerkProvider } from '@clerk/nextjs'
import { Space_Mono, Playfair_Display } from 'next/font/google'
import './globals.css'

const spaceMono = Space_Mono({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-mono',
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-display',
})

export const metadata: Metadata = {
  title: 'Filmory — Abadikan Momenmu',
  description: 'Buat template foto aesthetic dengan gaya Polaroid, Film Strip, Korean Booth, dan lainnya.',
  keywords: ['photobooth', 'template foto', 'polaroid', 'film strip', 'korean booth'],
  openGraph: {
    title: 'Filmory',
    description: 'Buat template foto aesthetic',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="id" className={`${spaceMono.variable} ${playfair.variable}`}>
        <body className="bg-[#0e0b09] text-[#e8ddd0] antialiased">
          {children}
        </body>
      </html>
    </ClerkProvider>
  )
}
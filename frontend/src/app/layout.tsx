import { Inter } from 'next/font/google'
import { Metadata } from 'next'
import './globals.css' 
const inter = Inter({
  variable: '--font-inter-mod',
  subsets: ['latin'],
})
import { Header } from '@/components/header'
import { Footer } from '@/components/ui/footer'

export const metadata: Metadata = {
  title: 'StreamForge',
  description: 'Instant video processing with adaptive streaming. Built for creators, educators, and developers.',
}
 
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning >
      <body className={`${inter.className}  antialiased dark`}>
        <Header/>
        <div className="min-h-screen">

        {children}
        </div>
        <Footer />
        </body>
    </html>
  )
}
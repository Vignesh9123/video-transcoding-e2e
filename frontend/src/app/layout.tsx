import { Inter } from 'next/font/google'
import { Metadata } from 'next'
import './globals.css' 
const inter = Inter({
  variable: '--font-inter-mod',
  subsets: ['latin'],
})
import { Header } from '@/components/header'

export const metadata: Metadata = {
  title: 'StreamForge',
  description: 'Instant video processing with adaptive streaming. Built for creators, educators, and developers.',
}
 
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning >
      <body className={`${inter.className}  antialiased dark min-h-[300vh]`}>
        <Header/>
        {children}
        </body>
    </html>
  )
}
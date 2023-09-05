import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Navbar from '@/components/Navbar'
import { Provider } from '@/components/Providers'
import { cn } from '@/lib/utils'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'CourseGen'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en'>
      <body className={cn(inter.className, 'antialiased min-h-screen pt-16')}>
        <Provider>
          <Navbar />
          {children}
        </Provider>
      </body>
    </html>
  )
}

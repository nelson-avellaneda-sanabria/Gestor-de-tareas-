import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'Gestor de Tareas',
  description: 'Organiza tus tareas de manera eficiente',
  icons: {
    icon: [
      {
        url: '/My Icon.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/My Icon.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/My Icon.png',
        type: 'image/svg+xml',
      },
    ],
    apple: '/My Icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className="bg-background">
      <body className="font-sans antialiased min-h-screen">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}

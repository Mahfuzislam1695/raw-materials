import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'medicine raw-materials - drug internationl limited',
  description: 'A Next.js application for managing medicine raw materials at Drug International Limited',
  keywords: ['medicine', 'raw materials', 'drug international limited', 'inventory management'],
  authors: [{ name: 'mahfuz islam' }],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

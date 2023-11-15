import type { Metadata } from 'next'
import './globals.css'

import { poppins } from './fonts';

export const metadata: Metadata = {
    title: 'Zen',
    description: 'Made by kyro',
};

export default function RootLayout({ children, }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={poppins.className}>{children}</body>
    </html>
  )
};

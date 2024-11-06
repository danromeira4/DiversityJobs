import './globals.css';
import { ReactNode } from 'react';
import Link from 'next/link';

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="pt-BR">
      <body>
        {children}
      </body>
    </html>
  );
}
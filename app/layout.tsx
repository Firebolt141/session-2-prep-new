import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Asuka Planner',
  description: 'A cute mobile-first planner built with Next.js + Firestore',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

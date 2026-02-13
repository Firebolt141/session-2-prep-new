import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Asuka Planner 🌸',
  description: 'Cute modern mobile planner powered by Firestore',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

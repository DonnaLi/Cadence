import type { ReactNode } from 'react';
import './globals.css';

export const metadata = { title: 'Cadence', description: 'Schedule and publish social posts as a team' };

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

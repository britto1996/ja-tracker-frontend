import '../styles/globals.css';
import type { Metadata } from 'next';
import AppShell from '@/components/layout/AppShell';
import Providers from '@/components/layout/Providers';

export const metadata: Metadata = {
  title: 'JA Tracker',
  description: 'Track your job applications with a polished UI',
  icons: {
    icon: [{ url: '/favicon.svg', type: 'image/svg+xml' }],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <AppShell>
            {children}
          </AppShell>
        </Providers>
      </body>
    </html>
  );
}

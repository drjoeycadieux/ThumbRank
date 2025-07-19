import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import { Header } from '@/components/header';
import { AuthProvider } from '@/context/auth-context';

export const metadata: Metadata = {
  title: 'ThumbRank',
  description: 'AI-Powered YouTube thumbnail ranking to maximize your click-through rate.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter&display=swap" rel="stylesheet"></link>
      </head>
      <body className="font-body antialiased flex flex-col min-h-screen">
        <AuthProvider>
          <Header />
          <div className="flex-grow">
            {children}
          </div>
          <Toaster />
          <footer className="text-center p-4 text-muted-foreground text-sm">
            ThumbRank. All Right Reserved. 2025
          </footer>
        </AuthProvider>
      </body>
    </html>
  );
}

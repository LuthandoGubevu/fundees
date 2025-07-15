import type {Metadata} from 'next';
import './globals.css';
import { cn } from "@/lib/utils";
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/contexts/auth-context';

export const metadata: Metadata = {
  title: 'Fundees',
  description: 'Spark your creativity with Fundees!',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300..800;1,300..800&display=swap" rel="stylesheet" />
      </head>
      <body className={cn("font-body antialiased min-h-screen")}>
        <AuthProvider>
            {children}
            <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}

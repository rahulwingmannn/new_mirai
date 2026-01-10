import type { Metadata } from "next";
import "./globals.css";
import NavContainer from "@/components/Home/Navbar/NavContainer";
import LoadingOverlay from '@/components/Common/LoadingOverlay';
import SafeDomPatches from '@/components/Common/SafeDomPatches';

export const metadata: Metadata = {
  title: "Mirai",
  description: "Welcome to pavani world",
  icons: {
    icon: '/favicon.png',
    apple: '/favicon.png',
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" style={{ backgroundColor: '#000' }}>
      <head>
        {/* CRITICAL: Black background before anything else loads */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
              html, body {
                background-color: #000 !important;
                background: #000 !important;
              }
            `,
          }}
        />
        
        {/* CRITICAL: Preload hero assets for faster loading */}
        <link 
          rel="preload" 
          href="/images/logo_1.png" 
          as="image"
          fetchPriority="high"
        />
        <link 
          rel="preload" 
          href="https://d3p1hokpi6aqc3.cloudfront.net/mirai_home_1.mp4" 
          as="video"
          type="video/mp4"
        />
        <link 
          rel="preload" 
          href="/images/sixth_ment.png" 
          as="image"
        />
        
        {/* CRITICAL: Reset scroll position before anything else loads */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                if ('scrollRestoration' in history) {
                  history.scrollRestoration = 'manual';
                }
                window.scrollTo(0, 0);
                document.documentElement.scrollTop = 0;
                document.body && (document.body.scrollTop = 0);
              })();
            `,
          }}
        />
        
        {/* Playfair Display from Google */}
        <link 
          rel="preconnect" 
          href="https://fonts.googleapis.com" 
        />
        <link 
          rel="preconnect" 
          href="https://fonts.gstatic.com" 
          crossOrigin="anonymous"
        />
        <link 
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&display=swap" 
          rel="stylesheet" 
        />
        
        {/* Preconnect to video CDN */}
        <link 
          rel="preconnect" 
          href="https://d3p1hokpi6aqc3.cloudfront.net" 
        />
        
        {/* Favicons */}
        <link rel="icon" href="/favicon.png" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="32x32" href="/favicon.png" />
      </head>
      <body className="antialiased" style={{ backgroundColor: '#000' }}>
        {/* Server-rendered black overlay to show immediately during initial load */}
        <div 
          id="initial-loading-overlay" 
          className="fixed inset-0 bg-black z-[9999] transition-opacity duration-500" 
        />
        <NavContainer />
        {/* Safe DOM patches that run early on the client to prevent insertBefore runtime errors */}
        <SafeDomPatches />
        {children}
        <LoadingOverlay />
      </body>
    </html>
  );
}

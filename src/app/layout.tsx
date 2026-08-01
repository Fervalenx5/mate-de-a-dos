import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import MobileNav from "@/components/layout/MobileNav";
import WhatsAppButton from "@/components/layout/WhatsAppButton";

export const viewport: Viewport = {
  themeColor: '#1F2C1D',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: "Mate de a Dos | El mate perfecto para compartir",
  description: "Tienda premium especializada en mates, bombillas, termos, yerbas y accesorios artesanales.",
  keywords: ["mate", "argentina", "artesanal", "bombilla", "termo", "yerba"],
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/favicon.png?v=2026", type: "image/png" },
      { url: "/favicon.ico?v=2026" }
    ],
    shortcut: "/favicon.png?v=2026",
    apple: "/favicon.png?v=2026",
  },
};

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const playfair = Playfair_Display({ 
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

import CartDrawer from "@/components/cart/CartDrawer";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        <link rel="icon" type="image/png" href="/favicon.png?v=2026" sizes="any" />
        <link rel="shortcut icon" href="/favicon.png?v=2026" />
        <link rel="apple-touch-icon" href="/favicon.png?v=2026" />
      </head>
      <body className={`${inter.variable} ${playfair.variable} antialiased font-body selection:bg-dorado/30`}>
        <Header />
        <CartDrawer />
        
        <div className="flex flex-col min-h-screen pt-20 lg:pt-32 pb-16 lg:pb-0">
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
        </div>
        
        <MobileNav />
        <WhatsAppButton />
      </body>
    </html>
  );
}

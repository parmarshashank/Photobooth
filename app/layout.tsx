import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Playfair_Display, Special_Elite } from 'next/font/google';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfair = Playfair_Display({ 
  subsets: ['latin'],
  variable: '--font-playfair'
});

const specialElite = Special_Elite({ 
  weight: '400',
  subsets: ['latin'],
  variable: '--font-special-elite'
});

export const metadata: Metadata = {
  title: "Photobooth",
  description: "Capture it all",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} ${specialElite.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}

'use client';

import { useState, useEffect } from 'react';
import localFont from "next/font/local";
import Splash from '@components/main/splash';
import "./globals.css";
import 'material-icons/iconfont/material-icons.css';

const poppins = localFont({
  src: "./fonts/poppins-v21-latin-regular.woff2",
  variable: "--font-poppins",
  weight: "100 900",
});

export default function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2000); // Show splash screen for 2 seconds

    return () => clearTimeout(timer);
  }, []);

  return (
    <html lang="en">
      <body className={`${poppins.variable} antialiased`}>
        {showSplash ? <Splash /> : children}
      </body>
    </html>
  );
}
import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const poppins = localFont({
  src: "./fonts/poppins-v21-latin-regular.woff2",
  variable: "--font-poppins",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "ReFresh",
  description: "Fresh, healthy choices. Download the ReFresh mobile app.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} antialiased`}>{children}</body>
    </html>
  );
}

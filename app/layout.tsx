import type { Metadata } from "next";
import { Inter } from "next/font/google"; // Changed to Inter matching Stitch
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Chile SUP Weather Dashboard",
  description: "Real-time weather and surf conditions for SUP in Chile",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} antialiased bg-[#1a1a2e] text-white overflow-x-hidden`}
      >
        {children}
      </body>
    </html>
  );
}

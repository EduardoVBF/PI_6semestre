import RootClient from "./RootClient";
import { Geist, Geist_Mono } from "next/font/google";
import type { Metadata } from "next";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FROTINIX",
  description: "Controle sua frota",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const fontClass = `${geistSans.variable} ${geistMono.variable} antialiased bg-gray-900`;

  return (
    <html lang="en">
      <body>
        <RootClient fontClass={fontClass}>{children}</RootClient>
      </body>
    </html>
  );
}

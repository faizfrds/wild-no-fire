import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  title: "Wildfire Detection",
  description: "Computer vision wildfire detection",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <footer className="text-center mt-5 mb-10 flex-col flex">
          Created by Faiz Firdaus - 2025
          <a className="text-xs text-gray-400" target="#" href="https://universe.roboflow.com/firdaus-ixdju/wildfire-image-detection">
            Powered by YOLOv11, click here to access Roboflow Project
          </a>
        </footer>
      </body>
    </html>
  );
}

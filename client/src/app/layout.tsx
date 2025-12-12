import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ReactLenis } from "lenis/react";
import CustomCursor from "./components/CustomCursor";
import { TransitionProvider } from "./components/TransitionProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Billy Dinh",
  description: "Billy Dinh photographer and filmmaker",
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
        <CustomCursor />
        <ReactLenis root>
          <TransitionProvider>{children}</TransitionProvider>
        </ReactLenis>
      </body>
    </html>
  );
}

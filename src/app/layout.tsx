import type React from "react";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import Navbar from "./components/NavComponents/Navbar";
import { AuthRouterGuard } from "./components/RouterProtector/RouterGuard";
import JWTRefreshScheduler from "./components/silentRefresh/SilentRefresh";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "the-rudy-club",
  description: "Social media platoform, connect and grow",
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
        <JWTRefreshScheduler />
        <ThemeProvider
          attribute="data-theme"
          defaultTheme="light"
          themes={["light", "dark", "dracula", "ocean", "forest"]}
          enableSystem={false}
        >
          <Navbar />
          <AuthRouterGuard>{children}</AuthRouterGuard>
        </ThemeProvider>
      </body>
    </html>
  );
}

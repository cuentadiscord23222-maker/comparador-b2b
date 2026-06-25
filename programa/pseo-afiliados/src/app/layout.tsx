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
  title: {
    default: "CompareB2B | Software Tool Comparisons",
    template: "%s | CompareB2B"
  },
  description: "Compare the best software tools for your business. Find the right tool by comparing features, pricing, pros and cons side-by-side.",
  keywords: ["software comparisons", "tool battles", "software reviews", "b2b software", "saas comparisons"],
  openGraph: {
    title: "CompareB2B | Software Tool Comparisons",
    description: "Compare the best software tools for your business. Find the right tool by comparing features, pricing, pros and cons side-by-side.",
    url: "https://compareb2b.com",
    siteName: "CompareB2B",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CompareB2B | Software Tool Comparisons",
    description: "Compare the best software tools for your business.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}

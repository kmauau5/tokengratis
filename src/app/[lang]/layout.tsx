import type { Metadata } from "next";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "@/app/globals.css";

import { Inter, Outfit } from "next/font/google";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const metadata: Metadata = {
  metadataBase: new URL('https://aifreetoken.com'), // Ganti dengan domain asli nanti
  title: "AI Free Token — Direktori API AI Gratis",
  description: "Kumpulan free tier & free credits API LLM, di-aggregate otomatis dari sumber komunitas. Temukan API OpenAI, Llama 3, Claude, Gemini, Mistral gratis.",
  keywords: ["Free LLM API", "API AI Gratis", "OpenAI Free Tier", "Llama 3 API Free", "Claude API Gratis", "Free AI Credits", "LLM Directory"],
  authors: [{ name: "AI Free Token Community" }],
  icons: {
    icon: '/icon.svg',
    shortcut: '/icon.svg',
    apple: '/icon.svg',
  },
  openGraph: {
    title: "AI Free Token — Direktori API AI Gratis",
    description: "Cari dan temukan ratusan API AI dengan free tier, diperbarui secara otomatis dari komunitas.",
    url: 'https://aifreetoken.com',
    siteName: 'AI Free Token',
    images: [
      {
        url: '/logo.png',
        width: 800,
        height: 600,
        alt: 'AI Free Token Logo',
      },
    ],
    locale: 'id_ID',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "AI Free Token — Direktori API AI Gratis",
    description: "Kumpulan free tier API LLM (Llama, GPT, Claude). Diperbarui otomatis!",
    images: ['/logo.png'],
  },
};

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}>) {
  const resolvedParams = await params;
  return (
    <html lang={resolvedParams.lang} suppressHydrationWarning>
      <body className={`${inter.variable} ${outfit.variable} antialiased`}>
        <ThemeProvider attribute="data-theme" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { ThemeProvider } from "@/components/ThemeProvider";
import "@/app/globals.css";

export const metadata: Metadata = {
  title: "TokenAIFree — Direktori API AI Gratis",
  description: "Kumpulan free tier & free credits API LLM, di-aggregate otomatis dari sumber komunitas.",
  openGraph: {
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
      <body>
        <ThemeProvider attribute="data-theme" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}

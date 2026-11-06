import type { Metadata, Viewport } from "next";
import { Manrope, Oswald } from "next/font/google";
import { Providers } from "@/components/layout/Providers";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { themeScript } from "@/components/layout/ThemeToggle";
import { site } from "@/content/site";
import "./globals.css";

const display = Oswald({ variable: "--font-oswald", subsets: ["latin"] });
const sans = Manrope({ variable: "--font-manrope", subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.fullName}, equipe de FRC de Resende (RJ)`,
    template: `%s · ${site.fullName}`,
  },
  description: site.description,
  keywords: ["Nine Tails", "9219", "FRC", "FIRST Robotics Competition", "robótica", "Resende", "Firjan SENAI SESI", "STEAM"],
  openGraph: { type: "website", locale: "pt_BR", siteName: site.fullName, url: site.url },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = { themeColor: "#ffffff" };

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      data-theme="light"
      suppressHydrationWarning
      className={`${display.variable} ${sans.variable} antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="flex min-h-dvh flex-col overflow-x-clip">
        <a
          href="#conteudo"
          className="sr-only z-[60] bg-brand px-4 py-2 font-bold text-brand-ink focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
        >
          Pular para o conteúdo
        </a>
        <Providers>
          <Header />
          <main id="conteudo" className="flex-1">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}

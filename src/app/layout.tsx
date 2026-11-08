import type { Metadata, Viewport } from "next";
import { Big_Shoulders, Bricolage_Grotesque } from "next/font/google";
import { Providers } from "@/components/layout/Providers";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { site } from "@/content/site";
import "./globals.css";

const display = Big_Shoulders({ variable: "--font-big-shoulders", subsets: ["latin"] });
const sans = Bricolage_Grotesque({ variable: "--font-bricolage", subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.fullName}, equipe de FRC de Resende (RJ)`,
    template: `%s · ${site.fullName}`,
  },
  description: site.summary,
  applicationName: site.fullName,
  keywords: [
    "Nine Tails",
    "Nine Tails 9219",
    "equipe 9219",
    "FRC",
    "FIRST Robotics Competition",
    "robótica",
    "equipe de robótica",
    "Resende",
    "Rio de Janeiro",
    "Firjan SENAI SESI",
    "STEAM",
  ],
  authors: [{ name: site.fullName, url: site.url }],
  creator: site.fullName,
  publisher: site.fullName,
  category: "education",
  formatDetection: { telephone: false, email: false, address: false },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 } },
  alternates: { canonical: "/" },
  openGraph: { type: "website", locale: "pt_BR", siteName: site.fullName, url: "/" },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = { themeColor: "#9e19b8" };

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      className={`${display.variable} ${sans.variable} antialiased`}
    >
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

import type { Metadata } from "next";
import { Geist, Geist_Mono, Noto_Kufi_Arabic, Noto_Sans_Arabic } from "next/font/google";
import "./globals.css";
import { LocaleProvider } from "@/lib/locale";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SiteBackground } from "@/components/SiteBackground";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const notoKufiArabic = Noto_Kufi_Arabic({
  variable: "--font-noto-kufi-arabic",
  subsets: ["arabic"],
  weight: ["500", "700", "800"],
});

const notoSansArabic = Noto_Sans_Arabic({
  variable: "--font-noto-sans-arabic",
  subsets: ["arabic"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "AEHEC — Association des Étudiants du Hodh Ech Chargui",
  description:
    "Site officiel de l'Association des Étudiants du Hodh Ech Chargui : actualités, comité exécutif, ressources et résultats d'examens.",
  icons: {
    icon: "/logo.png",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="fr"
      className={`${geistSans.variable} ${geistMono.variable} ${notoKufiArabic.variable} ${notoSansArabic.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <SiteBackground />
        <LocaleProvider>
          <Header />
          <main className="flex flex-1 flex-col">{children}</main>
          <Footer />
        </LocaleProvider>
      </body>
    </html>
  );
}

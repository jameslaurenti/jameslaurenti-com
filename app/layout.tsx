import type { Metadata } from "next";
import { Bricolage_Grotesque, DM_Sans } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  axes: ["opsz"],
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["300", "400"],
  style: ["normal", "italic"],
  display: "swap",
});

const SITE_DESCRIPTION =
  "I can't leave a thing half-understood. Plain-language guides to how Beverly, Massachusetts runs, and essays on what things mean.";

export const metadata: Metadata = {
  // Without this, page-level Open Graph images and canonical URLs can't resolve.
  metadataBase: new URL("https://www.jameslaurenti.com"),
  title: "James Laurenti",
  description: SITE_DESCRIPTION,
  // Inherited whole by every page that doesn't set its own openGraph (Next merges metadata
  // shallowly), so it carries no url: a shared /writing link must not claim to be the
  // homepage. The image comes from app/opengraph-image.tsx.
  openGraph: {
    type: "website",
    title: "James Laurenti",
    description: SITE_DESCRIPTION,
    siteName: "James Laurenti",
  },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${bricolage.variable} ${dmSans.variable}`}>
      <body className="min-h-screen flex flex-col bg-bg text-ink">
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-S2MBZ4HH37"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-S2MBZ4HH37');
          `}
        </Script>
        <Nav />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}

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

export const metadata: Metadata = {
  // Without this, page-level Open Graph images and canonical URLs can't resolve, and every
  // page inherits the homepage's og:url.
  metadataBase: new URL("https://www.jameslaurenti.com"),
  title: "James Laurenti",
  description: "Product leader. Builder of useful things.",
  openGraph: {
    type: "website",
    title: "James Laurenti",
    description: "Product leader. Builder of useful things.",
    url: "/",
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

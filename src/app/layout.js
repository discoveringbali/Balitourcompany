import { Inter, Playfair_Display } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BottomNav from "@/components/navigation/BottomNav";
import AuthProvider from "@/components/providers/AuthProvider";
import GoogleTranslate from "@/components/GoogleTranslate";
import SplashScreen from "@/components/SplashScreen";
const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"] });
const playfair = Playfair_Display({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"], variable: '--font-playfair' });

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export const metadata = {
  metadataBase: new URL("https://www.balanceisland.com"),
  applicationName: "Balance Island",
  title: {
    default: "Private Bali Tours & Experiences | Balance Island",
    template: "%s | Balance Island"
  },
  description: "Explore Bali with private tours and carefully planned experiences across Ubud, Uluwatu, Canggu, Nusa Penida and beyond.",
  keywords: ["Bali Private Driver", "Hire Driver in Bali", "Bali Car Charter", "Premium Bali Tours", "Ubud Day Tour", "Nusa Penida Tour Package", "Bali Airport Transfer", "Custom Bali Itinerary", "Local Bali Guide", "Best Driver in Ubud"],
  authors: [{ name: "Balance Island" }],
  creator: "Balance Island",
  publisher: "Balance Island",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "Balance Island | Private Tours & Experiences in Bali",
    description: "Private tours. Remarkable places. A better way to experience Bali. Discover carefully planned experiences across the island with Balance Island.",
    url: "https://www.balanceisland.com",
    siteName: "Balance Island",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Ubud Full-Day Tour: Monkey Forest, Rice Terraces, Temple & Waterfall",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  twitter: {
    card: "summary_large_image",
    title: "Balance Island | Private Tours & Experiences in Bali",
    description: "Private tours. Remarkable places. A better way to experience Bali. Discover carefully planned experiences across the island with Balance Island.",
    images: ["/og-image.jpg"],
  },
  alternates: {
    canonical: '/',
  },
  icons: {
    icon: '/favicon.PNG',
    shortcut: '/favicon.PNG',
    apple: '/favicon.PNG',
  },
};

export default function RootLayout({ children }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Balance Island",
    "alternateName": ["Balance Island Bali", "Balance Island Tours"],
    "url": "https://www.bobbybaliguide.com/"
  };

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${inter.className} ${playfair.variable} min-h-screen flex flex-col bg-background selection:bg-accent selection:text-primary pb-24 md:pb-0`}>
        <Script src="https://www.googletagmanager.com/gtag/js?id=AW-18408986681" strategy="afterInteractive" />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'AW-18408986681');
          `}
        </Script>
        <AuthProvider>
          <SplashScreen>
            <GoogleTranslate />
            {/* Navbar handles its own desktop/mobile responsive states now */}
            <Navbar />

            <main className="flex-grow w-full relative pt-20 md:pt-24">
              {children}
            </main>

            {/* New App-style floating bottom navigation */}
            <BottomNav />

            {/* Hide default Footer on mobile as we rely on bottom nav */}
            <div className="hidden md:block">
              <Footer />
            </div>
          </SplashScreen>
        </AuthProvider>
      </body>
    </html>
  );
}

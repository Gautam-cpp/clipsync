import type { Metadata, Viewport } from "next";
import { Outfit } from "next/font/google"; // Quirky/Modern font
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { StructuredData } from "@/components/structured-data";

const outfit = Outfit({ subsets: ["latin"] });

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL("https://www.clipsyncc.me"),
  title: {
    default: "ClipSync - Sync Clipboard & Transfer Files Instantly",
    template: "%s | ClipSync",
  },
  description: "Sync your clipboard across devices effortlessly and transfer files in real-time. Secure room-based sharing for text and files. No login required, works instantly across all your devices.",
  keywords: [
    "clipboard sync",
    "file transfer",
    "real-time sharing",
    "device sync",
    "secure file sharing",
    "cross-device clipboard",
    "instant file sharing",
    "room-based sharing",
    "clipboard manager",
    "file sync tool",
    "web clipboard",
    "online clipboard",
    "share files online",
    "sync text across devices",
    "collaborative clipboard",
  ],
  authors: [{ name: "ClipSync Team" }],
  creator: "ClipSync",
  publisher: "ClipSync",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.clipsyncc.me",
    siteName: "ClipSync",
    title: "ClipSync - Instant File & Clipboard Sharing",
    description: "Sync your clipboard across devices and transfer files instantly. Real-time, secure, and no login required.",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "ClipSync - Sync Clipboard & Transfer Files Instantly",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ClipSync - Instant File & Clipboard Sharing",
    description: "Sync your clipboard across devices and transfer files instantly. Real-time, secure, and no login required.",
    images: ["/twitter-image"],
    creator: "@clipsync",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/icon.png",
    apple: "/icon.png",
  },
  manifest: "/manifest.json",
  verification: {
    google: "QGHR3DwLtR_DnMnLHM0EE96mJ9ZybUBw5g_R4SdhSlQ",
    // yandex: "your-yandex-verification-code",
    // bing: "your-bing-verification-code",
  },
  alternates: {
    canonical: "https://www.clipsyncc.me",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${outfit.className} antialiased transition-colors duration-300`}>
        <StructuredData type="webapp" />
        <StructuredData type="organization" />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}

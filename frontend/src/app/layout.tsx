import type { Metadata } from "next";
import { Outfit } from "next/font/google"; // Quirky/Modern font
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";

const outfit = Outfit({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ClipSync - Sync Clipboard & Transfer Files Instantly",
  description: "Sync your clipboard across devices effortlessly and transfer files in real-time. Secure room-based sharing for text and files.",
  keywords: "clipboard sync, file transfer, real-time sharing, device sync, secure file sharing",
  openGraph: {
    title: "ClipSync - Instant File & Clipboard Sharing",
    description: "Sync your clipboard across devices and transfer files instantly",
    url: "https://www.clipsyncc.me",
    siteName: "ClipSync",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ClipSync - Instant File & Clipboard Sharing",
    description: "Sync your clipboard across devices and transfer files instantly",
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

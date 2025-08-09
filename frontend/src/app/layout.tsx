import type { Metadata } from "next";
import "./globals.css";
import AuthProvider from "@/context/AuthProvider";

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
    <html lang="en">
      <AuthProvider>
      <body
        
      >
        {children}
      </body>
    </AuthProvider>
    </html>
  );
}

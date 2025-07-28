import type { Metadata } from "next";
import "./globals.css";
import AuthProvider from "@/context/AuthProvider";


export const metadata: Metadata = {
  title: "ClipSync",
  description: "Sync your clipboard across devices effortlessly and tranfer files in real-time.",
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

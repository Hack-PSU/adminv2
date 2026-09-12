import { Inter } from "next/font/google";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { HackPSUProvider, Role } from "@hackpsu/react-sdk";
import { AppShell } from "@/components/layout/AppShell";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "HackPSU Admin v2",
  description: "Administrative dashboard for HackPSU",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${inter.variable} antialiased`}>
        <HackPSUProvider
          config={{
            firebase: {
              apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
              authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
              databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
              projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
              storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
              messagingSenderId:
                process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
              appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
            },
            apiBaseUrl: process.env.NEXT_PUBLIC_BASE_URL!,
            authServiceUrl: process.env.NEXT_PUBLIC_AUTH_SERVICE_URL,
            minimumRole: Role.TEAM,
          }}
        >
          <AppShell>{children}</AppShell>
        </HackPSUProvider>
      </body>
    </html>
  );
}

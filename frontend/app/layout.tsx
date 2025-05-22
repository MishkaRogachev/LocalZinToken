import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { headers } from "next/headers";
import { cookieToInitialState } from "wagmi";
import "./globals.css";
import { getConfig } from "@/wagmi.config";
import { Providers } from "./providers";
import { Navbar } from "@/components/navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LocalZin Token Airdrop",
  description: "Claim your LocalZin tokens",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const initialState = cookieToInitialState(
    getConfig(),
    (await headers()).get("cookie") ?? ""
  );
  return (
    <html lang="en">
      <body
        className={`
          ${geistSans.variable} ${geistMono.variable}
          bg-gradient-to-br from-[#0d1b2a] via-[#1b263b] to-[#415a77]
          text-white antialiased min-h-screen
        `}
      >
        {/* Background effects */}
        <div className="fixed inset-0 z-[-10] bg-noise bg-repeat opacity-[0.06]"></div>
        <div className="absolute w-[100%] h-[100%] rounded-full bg-blue-500 opacity-20 blur-[200px] z-[-20]"></div>

        <main className="flex flex-col max-w-screen-lg mx-auto pb-20">
          <Providers initialState={initialState}>
            <Navbar />
            {children}
          </Providers>
        </main>
      </body>
    </html>
  );
}

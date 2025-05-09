import type { Metadata } from "next";
import { bodyFont } from "./font";
import "./globals.css";
import { headers } from 'next/headers';
import Header from "./components/Header";

export const metadata: Metadata = {
  title: "FSS - Account Setup",
  description: "Fagron onboarding form for new clients",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const headersList = headers();
  const nonce = headersList.get('x-nonce');
  if (!nonce) return

  return (
    <html lang="en">
      <body
        nonce={nonce}
        className={`${bodyFont.className} antialiased`}
      >
        <Header />
        {children}
      </body>
    </html>
  );
}
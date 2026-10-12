import type { Metadata } from "next";
import { Nunito_Sans } from "next/font/google";
import "./globals.css";

const nunitoSans = Nunito_Sans({
  subsets: ["latin"],
  variable: "--font-nunito-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Svenskaspåret – Din väg till svenska",
  description:
    "Öva svenska i din egen takt med roliga utmaningar, kluriga ord och tydliga förklaringar.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="sv">
      <body className={nunitoSans.className}>{children}</body>
    </html>
  );
}

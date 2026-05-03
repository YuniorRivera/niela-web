import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://niela.app"),
  title: "Niela — Meditación en español",
  description:
    "Guías de meditación en español organizadas por tradición y propósito.",
  openGraph: {
    title: "Niela — Meditación en español",
    description:
      "Guías de meditación en español organizadas por tradición y propósito.",
    images: ["/og.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="h-full scroll-smooth">
      <body className={`${inter.className} min-h-full flex flex-col`}>
        {children}
      </body>
    </html>
  );
}

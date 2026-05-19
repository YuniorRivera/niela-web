import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://niela.app"),
  title: "Niela — Meditación personalizada",
  description:
    "Sesiones de meditación generadas por IA, adaptadas a tu tradición espiritual y a cómo te sentís hoy.",
  icons: {
    icon: "/icon-192.png",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "Niela — Meditación personalizada",
    description:
      "Sesiones de meditación generadas por IA, adaptadas a tu tradición espiritual y a cómo te sentís hoy.",
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

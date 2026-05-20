import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';

const inter = Inter({ subsets: ["latin"] });

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta' });
  return {
    metadataBase: new URL("https://niela.app"),
    title: t('title'),
    description: t('description'),
    icons: {
      icon: "/icon-192.png",
      apple: "/apple-touch-icon.png",
    },
    openGraph: {
      title: t('title'),
      description: t('description'),
      url: `https://niela.app${locale === 'es' ? '' : `/${locale}`}`,
      images: ["/og.png"],
      locale: locale === 'es' ? 'es_ES' : locale === 'en' ? 'en_US' : 'it_IT',
    },
  };
}

export function generateStaticParams() {
  return [{ locale: 'es' }, { locale: 'en' }, { locale: 'it' }];
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  const messages = await getMessages({ locale });
  return (
    <html lang={locale} className="h-full scroll-smooth">
      <body className={`${inter.className} min-h-full flex flex-col`}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

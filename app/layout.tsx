// Root layout — locale-specific layout in app/[locale]/layout.tsx provides html/body/providers.
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children as React.ReactElement;
}

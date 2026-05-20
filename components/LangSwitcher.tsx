'use client';
import { useRouter, usePathname } from 'next/navigation';
import { useLocale } from 'next-intl';

export function LangSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const changeLang = (newLocale: string) => {
    const cleanPath = pathname.replace(/^\/(en|it)/, '') || '/';
    const newPath = newLocale === 'es' ? cleanPath : `/${newLocale}${cleanPath === '/' ? '' : cleanPath}`;
    router.push(newPath);
  };

  return (
    <select
      value={locale}
      onChange={(e) => changeLang(e.target.value)}
      style={{
        background: 'transparent',
        fontSize: 13,
        cursor: 'pointer',
        color: 'rgba(232,241,245,0.75)',
        border: '1px solid rgba(166,200,220,0.25)',
        borderRadius: 999,
        padding: '10px 12px',   /* ≥44px touch target on Android */
        minHeight: 44,
        outline: 'none',
        WebkitAppearance: 'none',
        appearance: 'none',
      }}
    >
      <option value="es" style={{ background: '#2c3e50' }}>🇪🇸 ES</option>
      <option value="en" style={{ background: '#2c3e50' }}>🇬🇧 EN</option>
      <option value="it" style={{ background: '#2c3e50' }}>🇮🇹 IT</option>
    </select>
  );
}

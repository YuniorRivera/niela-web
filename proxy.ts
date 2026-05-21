import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  locales: ['es', 'en', 'it'],
  defaultLocale: 'es',
  localePrefix: 'as-needed'
});

export const config = {
  // Excluir: api, _next, archivos estáticos, y páginas legales (necesitan URL pública para Google Play)
  matcher: ['/((?!api|_next|legal|demo|.*\\..*).*)']
};

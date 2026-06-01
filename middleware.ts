import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  locales: ['es', 'en', 'it'],
  defaultLocale: 'es',
  localePrefix: 'always',
});

export const config = {
  // Excluimos api, _next, archivos con extensión, /verify (link de email) y /legal (sin locale)
  matcher: ['/((?!api|_next|verify|legal|.*\\..*).*)'],
};

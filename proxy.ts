import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  locales: ['es', 'en', 'it'],
  defaultLocale: 'es',
  localePrefix: 'as-needed'
});

export const config = {
  // Excluir: api, _next, archivos estáticos, /verify (link del email de verificación),
  // /legal y /demo (URLs públicas para Google Play y assets compartidos)
  matcher: ['/((?!api|_next|verify|legal|demo|.*\\..*).*)']
};

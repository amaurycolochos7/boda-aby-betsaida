import { NextRequest, NextResponse } from 'next/server';

const ROOT_DOMAIN = 'eventcontrol.site';

export function middleware(request: NextRequest) {
  const host = request.headers.get('host') || '';
  const hostname = host.split(':')[0]; // quitar puerto en dev

  // Solo actuar en subdominios (no en dominio raiz, www, ni localhost)
  if (
    hostname === ROOT_DOMAIN ||
    hostname === `www.${ROOT_DOMAIN}` ||
    hostname === 'localhost' ||
    hostname === '127.0.0.1'
  ) {
    return NextResponse.next();
  }

  // Verificar que es un subdominio de nuestro dominio
  if (!hostname.endsWith(`.${ROOT_DOMAIN}`)) {
    return NextResponse.next();
  }

  // Extraer slug: "abidan-betsaida.eventcontrol.site" → "abidan-betsaida"
  const slug = hostname.replace(`.${ROOT_DOMAIN}`, '');

  // No reescribir rutas estaticas / internas
  const path = request.nextUrl.pathname;
  if (
    path.startsWith('/_next') ||
    path.startsWith('/api') ||
    path.startsWith('/images') ||
    path.startsWith('/favicon') ||
    path.includes('.')
  ) {
    return NextResponse.next();
  }

  // Reescribir a /event/[slug]
  const url = request.nextUrl.clone();
  url.pathname = `/event/${slug}${path === '/' ? '' : path}`;
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};

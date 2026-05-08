import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

const DEFAULT_TEST_CREDENTIAL = 'testformcp';

function unauthorized() {
  return new NextResponse('Authentication required', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="ShopTest", charset="UTF-8"',
      'Cache-Control': 'no-store',
    },
  });
}

function parseBasicAuth(header: string | null) {
  if (!header?.startsWith('Basic ')) {
    return null;
  }

  try {
    const decoded = atob(header.slice('Basic '.length));
    const separatorIndex = decoded.indexOf(':');

    if (separatorIndex === -1) {
      return null;
    }

    return {
      username: decoded.slice(0, separatorIndex),
      password: decoded.slice(separatorIndex + 1),
    };
  } catch {
    return null;
  }
}

export function middleware(request: NextRequest) {
  const isPublicPreview = process.env.VERCEL_ENV === 'preview' || process.env.SHOPTEST_DISABLE_BASIC_AUTH === 'true';

  if (isPublicPreview) {
    return NextResponse.next();
  }

  const credentials = parseBasicAuth(request.headers.get('authorization'));
  const expectedUsername = process.env.SHOPTEST_BASIC_AUTH_USERNAME || DEFAULT_TEST_CREDENTIAL;
  const expectedPassword = process.env.SHOPTEST_BASIC_AUTH_PASSWORD || DEFAULT_TEST_CREDENTIAL;

  if (
    credentials?.username === expectedUsername &&
    credentials.password === expectedPassword
  ) {
    return NextResponse.next();
  }

  return unauthorized();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)',
  ],
};

import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
    const nonce = Buffer.from(crypto.randomUUID()).toString('base64');

    let cspHeader = ''
    if (process.env.NODE_ENV === 'production') {
        cspHeader = `
        default-src 'self';
        script-src 'self' 'nonce-${nonce}' https://cdn.jsdelivr.net;
        style-src 'self' 'unsafe-inline';
        img-src 'self' blob: data: https://unfinished-pages.s3.us-east-2.amazonaws.com;
        worker-src 'self' blob:;
        font-src 'self';
        frame-src 'self' blob: https://fagron-services.s3.us-east-2.amazonaws.com/ https://fagron-sterile-services-d92ac81c2d87.herokuapp.com/;
        object-src 'none';
        base-uri 'self';
        form-action 'self';
        frame-ancestors https://fagron-onboarding.vercel.app/ https://fagron-sterile-services-d92ac81c2d87.herokuapp.com/;
        upgrade-insecure-requests;
    `;
    }

    const contentSecurityPolicyHeaderValue = cspHeader.replace(/\s{2,}/g, ' ').trim();
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-nonce', nonce);
    requestHeaders.set('Content-Security-Policy', contentSecurityPolicyHeaderValue);

    const response = NextResponse.next({
        request: {
            headers: requestHeaders,
        },
    });
    response.headers.set('Content-Security-Policy', contentSecurityPolicyHeaderValue);

    return response;
}

export const config = {
    matcher: [
        {
            source: '/((?!api|_next/static|_next/image|favicon.ico).*)',
            missing: [
                { type: 'header', key: 'next-router-prefetch' },
                { type: 'header', key: 'purpose', value: 'prefetch' },
            ],
        },
    ],
};

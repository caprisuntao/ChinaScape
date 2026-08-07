/** @type {import('next').NextConfig} */

const isDev = process.env.NODE_ENV === 'development'

// Derive the Supabase host from the public env var so connect-src stays in
// sync with the project, with a safe wildcard fallback.
let supabaseHost = '*.supabase.co'
try {
  supabaseHost = new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname
} catch {
  // fall back to the wildcard above
}

const csp = [
  "default-src 'self'",
  // Next.js injects inline bootstrap scripts; 'unsafe-eval' is only needed in dev (webpack HMR)
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ''}`,
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "img-src 'self' data: https://images.unsplash.com",
  "font-src 'self' data: https://fonts.gstatic.com",
  `connect-src 'self' https://${supabaseHost} wss://${supabaseHost}${isDev ? ' ws:' : ''}`,
  "object-src 'none'",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
].join('; ')

const nextConfig = {
  poweredByHeader: false,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
    ],
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'Content-Security-Policy', value: csp },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()' },
        ],
      },
    ]
  },
};

export default nextConfig;

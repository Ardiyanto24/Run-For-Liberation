/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  poweredByHeader: false,
  outputFileTracingIncludes: {
    "/api/eticket": ["./public/fonts/**/*"],
    "/api/eticket/preview": ["./public/fonts/**/*"],
    "/actions/admin": ["./public/fonts/**/*"],
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/**",
      },
    ],
  },
};

export default nextConfig;
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Baseline security headers. HSTS is already added by Vercel; these are the
  // cheap wins. Permissions-Policy denies mic/camera/geo for the WEBSITE
  // (the desktop app uses the mic; the marketing site never should) — which
  // reinforces the product's privacy positioning.
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          {
            key: "Permissions-Policy",
            value: "microphone=(), camera=(), geolocation=(), interest-cohort=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;

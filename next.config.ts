import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static export for Cloudflare Pages. The site is fully static (no SSR /
  // API routes), so `next build` emits an `out/` directory Pages serves
  // directly.
  output: "export",
  // NOTE: Next's `headers()` is ignored under `output: "export"`. Security
  // headers are served by Cloudflare Pages via `public/_headers` (copied
  // verbatim into `out/_headers`).
};

export default nextConfig;

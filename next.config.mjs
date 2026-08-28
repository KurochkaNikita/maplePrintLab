/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static export only for production builds (`next build`).
  // `next dev` keeps normal behaviour so dynamic routes render without a
  // full rebuild.
  output: process.env.NODE_ENV === "production" ? "export" : undefined,
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;

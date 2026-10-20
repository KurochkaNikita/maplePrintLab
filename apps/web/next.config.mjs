/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static export only for production builds (`next build`).
  // `next dev` keeps normal behaviour so dynamic routes render without a
  // full rebuild.
  output: process.env.NODE_ENV === "production" ? "export" : undefined,
  trailingSlash: true,
  // Static export has no image optimiser: a custom loader maps the requested
  // width to the pre-generated variants (src/lib/image-loader.ts).
  images: {
    loader: "custom",
    loaderFile: "./src/lib/image-loader.ts",
    deviceSizes: [480, 800, 1200],
    imageSizes: [320],
  },
};

export default nextConfig;

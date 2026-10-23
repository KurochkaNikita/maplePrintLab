/** @type {import('next').NextConfig} */
const nextConfig = {
  // The db package ships TypeScript source.
  transpilePackages: ["@maple-print-lab/db"],
};

export default nextConfig;

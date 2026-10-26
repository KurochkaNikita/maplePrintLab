/** @type {import('next').NextConfig} */
const nextConfig = {
  // The db package ships TypeScript source.
  transpilePackages: ["@maple-print-lab/db"],

  // `import CloseIcon from "@/icons/close.svg"` gives a React component (SVGR), so icons live in
  // .svg files and inherit colour via `currentColor`. Images in /public are still plain URLs.
  webpack(config) {
    // Next's built-in image rule claims .svg (as a URL); it appears at the top level and inside `oneOf`.
    const excludeSvg = (rules) => {
      for (const rule of rules ?? []) {
        if (rule.test?.test?.(".svg")) rule.exclude = /\.svg$/i;
        if (rule.oneOf) excludeSvg(rule.oneOf);
      }
    };
    excludeSvg(config.module.rules);

    config.module.rules.push({
      test: /\.svg$/i,
      use: [
        {
          loader: "@svgr/webpack",
          options: {
            // Keep the viewBox: the size comes from the className at the call site.
            svgoConfig: { plugins: [{ name: "preset-default", params: { overrides: { removeViewBox: false } } }] },
          },
        },
      ],
    });
    return config;
  },
};

export default nextConfig;

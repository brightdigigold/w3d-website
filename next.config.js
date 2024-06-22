/**
 * @type {import('next').NextConfig}
 */

const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

const nextConfig = {
  webpack(config) {
    // Integrate Webpack Bundle Analyzer
    if (process.env.ANALYZE === "true") {
      config.plugins.push(
        new (require("webpack-bundle-analyzer").BundleAnalyzerPlugin)()
      );
    }

    // Add SVGR loader for SVG files
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ["@svgr/webpack"],
    });

    return config;
  },

  reactStrictMode: true,

  eslint: {
    ignoreDuringBuilds: true,
  },

  env: {
    baseUrl: "https://devapi.brightdigigold.com",
    cashfree: "sandbox",
    GOOGLE_TAG: "GTM-5JFBNN5",
    NEXT_PUBLIC_SANITY_PROJECT_ID: "nkdqpbbn",
    MIX_PANNEL_TOKEN: "497551b628f786f66e8a0fb646d605eb",
  },

  swcMinify: true,

  images: {
    unoptimized: true,
  },
};

module.exports = withBundleAnalyzer(nextConfig);

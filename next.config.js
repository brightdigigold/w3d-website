const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
  analyzerMode: "server",
  analyzerPort: process.env.ANALYZER_PORT || 8889,
});

const nextConfig = {
  webpack(config, { isServer }) {
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ["@svgr/webpack"],
    });

    if (process.env.ANALYZE === "true") {
      const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
      config.plugins.push(
        new BundleAnalyzerPlugin({
          analyzerMode: "server",
          analyzerPort: process.env.ANALYZER_PORT || 8889,
        })
      );
    }

    // Example: Lazy loading react-player components to reduce initial load
    config.resolve.alias["react-player"] = require.resolve("react-player/lazy");

    // Generate source maps for better debugging
    if (!isServer) {
      config.devtool = "source-map";
    }

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
    domains: [
      "localhost",
      "brightdigigold.s3.ap-south-1.amazonaws.com",
      "cdn.sanity.io",
      "d2fbpyhlah02sy.cloudfront.net",
      "cdn-icons-png.flaticon.com",
      "www.brightdigigold.com",
    ],
  },

  productionBrowserSourceMaps: true, 
};

module.exports = withBundleAnalyzer(nextConfig);

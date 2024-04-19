/**
 * @type {import('next').NextConfig}
 */

const nextConfig = { 
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ["@svgr/webpack"],
    });

    return config;
  },

  experimental: {
    appDir: true,
  },

  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  // basePath: '/beta',
  // assetPrefix: '/beta',
  // publicRuntimeConfig: {
  //   baseURL: '/beta',
  // },
  env: {
    baseUrl: "https://api.brightdigigold.com",
    // baseUrl: "https://devapi.brightdigigold.com",
    // cashfree: "sandbox",
    cashfree: "production",
    // baseUrl: "http://localhost:3032",
    // baseUrl: "http://192.168.1.10:3031",
    GOOGLE_TAG: "GTM-5JFBNN5",
    NEXT_PUBLIC_SANITY_PROJECT_ID: "nkdqpbbn",
    MIX_PANNEL_TOKEN: "497551b628f786f66e8a0fb646d605eb",
  },
  reactStrictMode: true,
  swcMinify: true,
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;

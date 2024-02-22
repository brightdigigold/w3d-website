/** @type {import('next').NextConfig} */
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
    baseUrl: "http://localhost:3032",
    // baseUrl: "http://192.168.1.8:3031",
    GOOGLE_TAG : "GTM-5JFBNN5",
  },
  reactStrictMode: true,
  swcMinify: true,
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;

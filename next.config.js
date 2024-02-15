// next.config.js

module.exports = {
  webpack(config) {
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
    baseUrl: "https://api.brightdigigold.com",
    // baseUrl: "https://devapi.brightdigigold.com",
    // cashfree: "sandbox",
    cashfree: "production",
    // baseUrl: "http://localhost:3031",
    // baseUrl: "http://192.168.1.6:3031",
  },
  swcMinify: true,
  images: {
    unoptimized: true,
  },
};

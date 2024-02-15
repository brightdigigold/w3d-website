// next.config.js

// module.exports = {
//   webpack(config) {
//     config.module.rules.push({
//       test: /\.svg$/i,
//       issuer: /\.[jt]sx?$/,
//       use: ["@svgr/webpack"],
//     });

//     return config;
//   },
//   reactStrictMode: true,
//   eslint: {
//     ignoreDuringBuilds: true,
//   },
//   env: {
//     baseUrl: "https://api.brightdigigold.com",
//     // baseUrl: "https://devapi.brightdigigold.com",
//     // cashfree: "sandbox",
//     cashfree: "production",
//     // baseUrl: "http://localhost:3031",
//     // baseUrl: "http://192.168.1.6:3031",
//   },
//   swcMinify: true,
//   images: {
//     unoptimized: true,
//   },
// };

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
    // baseUrl: "http://localhost:3031",
    // baseUrl: "http://192.168.1.6:3031",
  },
  reactStrictMode: true,
  swcMinify: true,
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;

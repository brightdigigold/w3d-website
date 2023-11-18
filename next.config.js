/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ['@svgr/webpack'],
    })

    return config
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
   baseUrl: "https://devapi.brightdigigold.com",
  //  baseUrl: "https://api.brightdigigold.com",
    
  },
  reactStrictMode: true,
  swcMinify: true,
  images: {
    unoptimized: true,
  }
}

module.exports = nextConfig

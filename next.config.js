/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  output: "export",
  basePath: "/fov-calculator",
  assetPrefix: "/fov-calculator",
  distDir: "dist",
};

module.exports = nextConfig;

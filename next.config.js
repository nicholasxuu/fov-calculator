/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  output: "export",
  basePath: "/fovcalc",
  assetPrefix: "/fovcalc",
};

module.exports = nextConfig;

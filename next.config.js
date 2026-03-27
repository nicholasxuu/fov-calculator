/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  output: "export",
  transpilePackages: ["antd-mobile"],
};

module.exports = nextConfig;

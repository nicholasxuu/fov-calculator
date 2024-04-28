/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  output: "export",
  // basePath: "/fov-calculator",
  // assetPrefix: "/fov-calculator",
  // transpilePackages: ["antd-mobile"],
};

const withTM = require("next-transpile-modules")(["antd-mobile"]);

module.exports = withTM(nextConfig);

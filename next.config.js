/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  output: "export",
  // Toy hosts each upload in a subdirectory, so assets must follow index.html.
  assetPrefix: ".",
  transpilePackages: ["antd-mobile"],
};

module.exports = nextConfig;

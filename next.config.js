/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "export",
  basePath: process.env.NODE_ENV === "production" ? "/james-storybook" : "",
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;

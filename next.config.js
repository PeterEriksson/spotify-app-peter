/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      "i.scdn.co",
      "e7.pngegg.com",
      "baypark.ca",
      "links.papareact.com",
    ],
  },
};

module.exports = nextConfig;

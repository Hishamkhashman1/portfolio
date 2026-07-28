/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  async redirects() {
    return [
      {
        source: "/about",
        destination: "/portfolio/about",
        permanent: true
      },
      {
        source: "/services",
        destination: "/portfolio/services",
        permanent: true
      }
    ];
  },
};

module.exports = nextConfig;

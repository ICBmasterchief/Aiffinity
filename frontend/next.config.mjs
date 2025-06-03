// frontend/next.config.mjs

/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/graphql/:path*",
        destination: "http://backend:2159/graphql/:path*",
      },
    ];
  },
};

export default nextConfig;

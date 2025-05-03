// frontend/next.config.mjs

/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    if (
      !process.env.NEXT_PUBLIC_BACKEND_URL ||
      !process.env.NEXT_PUBLIC_BACKEND_PORT
    ) {
      throw new Error(
        `Tienes que definir NEXT_PUBLIC_BACKEND_URL y NEXT_PUBLIC_BACKEND_PORT en frontend/.env.local - ${process.env.NEXT_PUBLIC_BACKEND_URL} - ${process.env.NEXT_PUBLIC_BACKEND_PORT}`
      );
    }
    return [
      {
        source: "/uploads/:path*",
        destination: `${process.env.NEXT_PUBLIC_BACKEND_URL}:${process.env.NEXT_PUBLIC_BACKEND_PORT}/uploads/:path*`,
      },
    ];
  },
};

export default nextConfig;

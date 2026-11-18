/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  async redirects() {
    return [
      {
        source: '/index.html',
        destination: '/',
        permanent: false
      }
    ];
  }
};

export default nextConfig;

import type { NextConfig } from 'next';

// Exportación estática: el sitio se publica como HTML/JS plano en cualquier hosting.
const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true },
  reactStrictMode: true,
};

export default nextConfig;

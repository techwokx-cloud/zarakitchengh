/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  reactStrictMode: true,
  // Limits Next.js to a single build worker process instead of spawning
  // several in parallel. Needed for shared hosting (like the DirectAdmin/
  // Passenger host) where strict per-account process limits cause
  // "spawn ... EAGAIN" crashes when Next.js tries to fork multiple
  // workers during static page generation.
  experimental: {
    cpus: 1,
    workerThreads: false,
  },
}

module.exports = nextConfig

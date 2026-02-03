/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    // 1. Force transpilation of Firebase packages to ensure modern syntax is handled
    transpilePackages: ['firebase', '@firebase', 'undici'],

    webpack: (config, { isServer }) => {
        // 2. Client-side polyfills/exclusions
        if (!isServer) {
            // Exclude Node.js-only modules from the client bundle
            config.resolve.fallback = {
                ...config.resolve.fallback,
                undici: false, // Explicitly tell Webpack that undici is not needed on client
                fs: false,
                net: false,
                tls: false,
                child_process: false,
            };

            // Additional alias to force ignore undici
            config.resolve.alias = {
                ...config.resolve.alias,
                undici: false,
            };
        }
        return config;
    },
    experimental: {
        // 3. Ensure these packages are treated as external on the server to avoid bundling issues
        serverComponentsExternalPackages: ['undici', 'firebase-admin'],
    },
};

export default nextConfig;

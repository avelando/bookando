/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['covers.openlibrary.org'],
    },
    async redirects() {
        return [
            {
                source: '/',
                destination: '/autenticacao/login',
                permanent: false,
            },
        ];
    },
};

export default nextConfig;
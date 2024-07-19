/** @type {import('next').NextConfig} */
const nextConfig = {
    async redirects() {
        return [
            {
                source: '/',
                destination: '/autenticacao/login',
                permanent: false,
            },
        ];
    },
    images: {
        domains: ['covers.openlibrary.org'],
    },
};

export default nextConfig;

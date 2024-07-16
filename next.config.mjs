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
};

export default nextConfig;

import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
	function middleware(req) {
		const { pathname } = req.nextUrl;
		if (pathname.startsWith('/_next') || pathname.startsWith('/static')) {
		return NextResponse.next();
		}
		if (!req.nextauth.token && pathname !== '/autenticacao/login') {
		return NextResponse.redirect(new URL('/autenticacao/login', req.url));
		}
		return NextResponse.next();
	},
	{
		pages: {
		signIn: '/autenticacao/login',
		},
	}
);

export const config = {
	matcher: [
		'/((?!api|_next|static|favicon.ico|/autenticacao/login).*)',
	],
};

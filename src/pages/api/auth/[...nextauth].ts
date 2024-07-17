import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { supabase } from "../../../lib/supabaseClient";
import bcrypt from "bcryptjs";

export default NextAuth({
	providers: [
		CredentialsProvider({
		name: "Credentials",
		credentials: {
			email: { label: "Email", type: "text" },
			password: { label: "Password", type: "password" },
		},
		authorize: async (credentials) => {
			if (!credentials) {
				throw new Error("Credentials are undefined");
			}
		
			const { data: user, error } = await supabase
			.from("users")
			.select("*")
			.eq("email", credentials.email)
			.single();

			if (error || !user) {
				console.error("User not found or error fetching user", error);
				return null;
			}

			const isValidPassword = bcrypt.compareSync(credentials.password, user.password);

			if (!isValidPassword) {
				console.error("Invalid credentials");
			return null;
			}

			return { id: user.id, name: user.name, email: user.email };
		},
		}),
	],
	session: {
		strategy: "jwt",
	},
	callbacks: {
		async jwt({ token, user }) {
		if (user) {
			token.id = user.id;
			token.name = user.name;
			token.email = user.email;
		}
		return token;
		},
		async session({ session, token }) {
			session.user = { id: token.id as string, name: token.name as string, email: token.email as string };
			return session;
		},
	},
	pages: {
		signIn: "/autenticacao/login",
	},
});

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import Link from "next/link";

const Login: React.FC = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const result = await signIn("credentials", {
                redirect: false,
                email,
                password,
            });

            if (!result?.error) {
                router.push("/");
            } else {
                alert("Login failed");
            }
        } catch (error) {
            console.error("An error occurred while logging in", error);
            alert("An unexpected error occurred. Please try again.");
        }
    };

    return (
        <div className="container">
            <div className="form-wrapper">
                <h1>Login</h1>
                <form onSubmit={handleSubmit}>
                    <div className="email">
                        <label>Email:</label>
                        <input
                            className="input"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="password">
                        <label>Password:</label>
                        <input
                            className="input"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <button type="submit">Login</button>
                    <p>
                        Don&apos;t have an account?
                        <Link className="link" href="/autenticacao/signup">
                            Signup
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Login;

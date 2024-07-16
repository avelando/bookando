import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";

const Login: React.FC = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const router = useRouter();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		const result = await signIn("credentials", {
		redirect: false,
		email,
		password,
	});

    if (!result?.error) {
      	router.push("/");
    } else {
      	alert("Login failed");
    };
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
				<p>Não tem uma conta? <a href="/autenticacao/signup">Cadastre-se</a></p>
				</form>
			</div>
		</div>
  	);
};

export default Login;

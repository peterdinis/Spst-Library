import { NextPage } from "next";
import LoginForm from "@/components/auth/LoginForm";

const LoginPage: NextPage = () => {
	return (
		<div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-background to-muted/20">
			<LoginForm />
		</div>
	);
};

export default LoginPage;

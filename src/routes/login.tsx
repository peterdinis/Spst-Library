import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, FormEvent } from "react";
import { useAuth } from "@/lib/auth-context";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2, LogIn } from "lucide-react";

export const Route = createFileRoute("/login")({
	component: LoginPage,
});

function LoginPage() {
	const navigate = useNavigate();
	const { login, isLoading: authLoading } = useAuth();
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [formData, setFormData] = useState({
		email: "",
		password: "",
	});

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();
		setIsSubmitting(true);

		try {
			await login(formData.email, formData.password);
			toast.success("Úspešne prihlásený");
			navigate({ to: "/" });
		} catch (error: any) {
			toast.error("Chyba pri prihlásení", {
				description: error.message || "Skúste to znova",
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className="container max-w-md mx-auto py-16">
			<Card>
				<CardHeader>
					<CardTitle className="text-2xl">Prihlásenie</CardTitle>
					<CardDescription>
						Zadajte svoje prihlasovacie údaje pre prístup do knižnice
					</CardDescription>
				</CardHeader>
				<CardContent>
					<form onSubmit={handleSubmit} className="space-y-4">
						<div className="space-y-2">
							<Label htmlFor="email">Email</Label>
							<Input
								id="email"
								type="email"
								value={formData.email}
								onChange={(e) =>
									setFormData({ ...formData, email: e.target.value })
								}
								placeholder="vas@email.sk"
								required
								disabled={isSubmitting}
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="password">Heslo</Label>
							<Input
								id="password"
								type="password"
								value={formData.password}
								onChange={(e) =>
									setFormData({ ...formData, password: e.target.value })
								}
								placeholder="••••••••"
								required
								disabled={isSubmitting}
							/>
						</div>

						<Button
							type="submit"
							className="w-full"
							disabled={isSubmitting || authLoading}
						>
							{isSubmitting || authLoading ? (
								<>
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									Prihlasovanie...
								</>
							) : (
								<>
									<LogIn className="mr-2 h-4 w-4" />
									Prihlásiť sa
								</>
							)}
						</Button>

						<div className="text-center text-sm">
							Nemáte účet?{" "}
							<a
								href="/register"
								className="text-primary hover:underline"
							>
								Registrujte sa
							</a>
						</div>
					</form>
				</CardContent>
			</Card>
		</div>
	);
}

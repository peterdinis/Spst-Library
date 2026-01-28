import {
	createFileRoute,
	useNavigate,
	useSearch,
} from "@tanstack/react-router";
import { useState, FormEvent, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2, LogIn, Eye, EyeOff, AlertCircle } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Alert, AlertDescription } from "@/components/ui/alert";

export const Route = createFileRoute("/login")({
	component: LoginPage,
	validateSearch: (search: Record<string, unknown>) => {
		return {
			redirect: (search.redirect as string) || "/",
		};
	},
});

function LoginPage() {
	const navigate = useNavigate();
	const search = useSearch({ from: "/login" });
	const { login, isLoading: authLoading, isAuthenticated } = useAuth();
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [formData, setFormData] = useState({
		email: "",
		password: "",
	});

	// Auto-redirect if already authenticated
	useEffect(() => {
		if (isAuthenticated && !authLoading) {
			navigate({ to: search.redirect || "/" });
		}
	}, [isAuthenticated, authLoading, navigate, search.redirect]);

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();
		setError(null); // Clear previous errors
		setIsSubmitting(true);

		try {
			await login(formData.email, formData.password);
			toast.success("Úspešne prihlásený", {
				description: "Vitajte späť!",
			});
			// Navigate to redirect path or home
			navigate({ to: search.redirect || "/" });
		} catch (error: any) {
			console.error("Login error:", error);
			const errorMessage =
				error.data || error.message || "Nesprávny email alebo heslo";
			setError(errorMessage);
			toast.error("Chyba pri prihlásení", {
				description: errorMessage,
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	// Show loading while checking auth
	if (authLoading) {
		return (
			<div className="container max-w-md mx-auto py-16">
				<div className="flex items-center justify-center min-h-[400px]">
					<div className="text-center space-y-4">
						<Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
						<p className="text-muted-foreground">Načítavam...</p>
					</div>
				</div>
			</div>
		);
	}

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
						{error && (
							<Alert variant="destructive">
								<AlertCircle className="h-4 w-4" />
								<AlertDescription>{error}</AlertDescription>
							</Alert>
						)}

						<div className="space-y-2">
							<Label htmlFor="email">Email</Label>
							<Input
								id="email"
								type="email"
								value={formData.email}
								onChange={(e) => {
									setError(null); // Clear error on input change
									setFormData({ ...formData, email: e.target.value });
								}}
								placeholder="vas@email.sk"
								required
								disabled={isSubmitting}
								autoComplete="email"
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="password">Heslo</Label>
							<div className="relative">
								<Input
									id="password"
									type={showPassword ? "text" : "password"}
									value={formData.password}
									onChange={(e) => {
										setError(null); // Clear error on input change
										setFormData({ ...formData, password: e.target.value });
									}}
									placeholder="••••••••"
									required
									disabled={isSubmitting}
									autoComplete="current-password"
									className="pr-10"
								/>
								<Button
									type="button"
									variant="ghost"
									size="sm"
									className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
									onClick={() => setShowPassword(!showPassword)}
									disabled={isSubmitting}
								>
									{showPassword ? (
										<EyeOff className="h-4 w-4 text-muted-foreground" />
									) : (
										<Eye className="h-4 w-4 text-muted-foreground" />
									)}
									<span className="sr-only">
										{showPassword ? "Skryť heslo" : "Zobraziť heslo"}
									</span>
								</Button>
							</div>
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
							<Link
								to="/register"
								search={{ redirect: search.redirect }}
								className="text-primary hover:underline"
							>
								Registrujte sa
							</Link>
						</div>
					</form>
				</CardContent>
			</Card>
		</div>
	);
}

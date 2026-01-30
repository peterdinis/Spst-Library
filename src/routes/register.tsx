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
import {
	Loader2,
	UserPlus,
	CheckCircle2,
	XCircle,
	Eye,
	EyeOff,
	AlertCircle,
} from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Alert, AlertDescription } from "@/components/ui/alert";

export const Route = createFileRoute("/register")({
	component: RegisterPage,
	validateSearch: (search: Record<string, unknown>) => {
		return {
			redirect: (search.redirect as string) || "/",
		};
	},
});

function RegisterPage() {
	const navigate = useNavigate();
	const search = useSearch({ from: "/register" });
	const { register, isLoading: authLoading, isAuthenticated } = useAuth();
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [formData, setFormData] = useState({
		email: "",
		password: "",
		confirmPassword: "",
		firstName: "",
		lastName: "",
	});
	const [passwordValidation, setPasswordValidation] = useState({
		minLength: false,
		match: false,
	});

	// Auto-redirect if already authenticated
	useEffect(() => {
		if (isAuthenticated && !authLoading) {
			navigate({ to: search.redirect || "/" });
		}
	}, [isAuthenticated, authLoading, navigate, search.redirect]);

	// Update password validation in real-time
	useEffect(() => {
		setPasswordValidation({
			minLength: formData.password.length >= 6,
			match:
				formData.password === formData.confirmPassword &&
				formData.confirmPassword.length > 0,
		});
	}, [formData.password, formData.confirmPassword]);

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();
		setError(null); // Clear previous errors

		if (formData.password !== formData.confirmPassword) {
			const errorMsg = "Heslá sa nezhodujú";
			setError(errorMsg);
			toast.error(errorMsg);
			return;
		}

		if (formData.password.length < 6) {
			const errorMsg = "Heslo musí mať aspoň 6 znakov";
			setError(errorMsg);
			toast.error(errorMsg);
			return;
		}

		setIsSubmitting(true);

		try {
			await register(
				formData.email,
				formData.password,
				formData.firstName,
				formData.lastName,
			);
			toast.success("Úspešne zaregistrovaný", {
				description:
					"Potvrdzujúci email bol odoslaný. Teraz sa môžete prihlásiť!",
			});
			// Navigate to login page after registration
			navigate({ to: "/login", search: { redirect: "/" } });
		} catch (error: any) {
			console.error("Registration error:", error);
			const errorMessage = error.data || error.message || "Skúste to znova";
			setError(errorMessage);
			toast.error("Chyba pri registrácii", {
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
					<CardTitle className="text-2xl">Registrácia</CardTitle>
					<CardDescription>
						Vytvorte si účet pre prístup do knižnice
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

						<div className="grid grid-cols-2 gap-4">
							<div className="space-y-2">
								<Label htmlFor="firstName">Meno</Label>
								<Input
									id="firstName"
									value={formData.firstName}
									onChange={(e) => {
										setError(null);
										setFormData({ ...formData, firstName: e.target.value });
									}}
									placeholder="Ján"
									required
									disabled={isSubmitting}
									autoComplete="given-name"
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="lastName">Priezvisko</Label>
								<Input
									id="lastName"
									value={formData.lastName}
									onChange={(e) => {
										setError(null);
										setFormData({ ...formData, lastName: e.target.value });
									}}
									placeholder="Novák"
									required
									disabled={isSubmitting}
									autoComplete="family-name"
								/>
							</div>
						</div>

						<div className="space-y-2">
							<Label htmlFor="email">Email</Label>
							<Input
								id="email"
								type="email"
								value={formData.email}
								onChange={(e) => {
									setError(null);
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
										setError(null);
										setFormData({ ...formData, password: e.target.value });
									}}
									placeholder="••••••••"
									required
									disabled={isSubmitting}
									minLength={6}
									autoComplete="new-password"
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
							<div className="flex items-center gap-2 text-xs">
								{formData.password.length > 0 &&
									(passwordValidation.minLength ? (
										<div className="flex items-center gap-1 text-green-600">
											<CheckCircle2 className="h-3 w-3" />
											<span>Minimálne 6 znakov</span>
										</div>
									) : (
										<div className="flex items-center gap-1 text-red-600">
											<XCircle className="h-3 w-3" />
											<span>Minimálne 6 znakov</span>
										</div>
									))}
							</div>
						</div>

						<div className="space-y-2">
							<Label htmlFor="confirmPassword">Potvrďte heslo</Label>
							<div className="relative">
								<Input
									id="confirmPassword"
									type={showConfirmPassword ? "text" : "password"}
									value={formData.confirmPassword}
									onChange={(e) => {
										setError(null);
										setFormData({
											...formData,
											confirmPassword: e.target.value,
										});
									}}
									placeholder="••••••••"
									required
									disabled={isSubmitting}
									autoComplete="new-password"
									className="pr-10"
								/>
								<Button
									type="button"
									variant="ghost"
									size="sm"
									className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
									onClick={() => setShowConfirmPassword(!showConfirmPassword)}
									disabled={isSubmitting}
								>
									{showConfirmPassword ? (
										<EyeOff className="h-4 w-4 text-muted-foreground" />
									) : (
										<Eye className="h-4 w-4 text-muted-foreground" />
									)}
									<span className="sr-only">
										{showConfirmPassword ? "Skryť heslo" : "Zobraziť heslo"}
									</span>
								</Button>
							</div>
							<div className="flex items-center gap-2 text-xs">
								{formData.confirmPassword.length > 0 &&
									(passwordValidation.match ? (
										<div className="flex items-center gap-1 text-green-600">
											<CheckCircle2 className="h-3 w-3" />
											<span>Heslá sa zhodujú</span>
										</div>
									) : (
										<div className="flex items-center gap-1 text-red-600">
											<XCircle className="h-3 w-3" />
											<span>Heslá sa nezhodujú</span>
										</div>
									))}
							</div>
						</div>

						<Button
							type="submit"
							className="w-full"
							disabled={
								isSubmitting ||
								authLoading ||
								!passwordValidation.minLength ||
								!passwordValidation.match
							}
						>
							{isSubmitting || authLoading ? (
								<>
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									Registrovanie...
								</>
							) : (
								<>
									<UserPlus className="mr-2 h-4 w-4" />
									Registrovať sa
								</>
							)}
						</Button>

						<div className="text-center text-sm">
							Už máte účet?{" "}
							<Link
								to="/login"
								search={{ redirect: search.redirect }}
								className="text-primary hover:underline"
							>
								Prihláste sa
							</Link>
						</div>
					</form>
				</CardContent>
			</Card>
		</div>
	);
}

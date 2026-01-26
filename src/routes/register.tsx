import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, FormEvent } from "react";
import { useAuth } from "@/lib/auth-context";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2, UserPlus } from "lucide-react";

export const Route = createFileRoute("/register")({
	component: RegisterPage,
});

function RegisterPage() {
	const navigate = useNavigate();
	const { register, isLoading: authLoading } = useAuth();
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [formData, setFormData] = useState({
		email: "",
		password: "",
		confirmPassword: "",
		firstName: "",
		lastName: "",
	});

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();

		if (formData.password !== formData.confirmPassword) {
			toast.error("Heslá sa nezhodujú");
			return;
		}

		if (formData.password.length < 6) {
			toast.error("Heslo musí mať aspoň 6 znakov");
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
			toast.success("Úspešne zaregistrovaný");
			navigate({ to: "/" });
		} catch (error: any) {
			toast.error("Chyba pri registrácii", {
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
					<CardTitle className="text-2xl">Registrácia</CardTitle>
					<CardDescription>
						Vytvorte si účet pre prístup do knižnice
					</CardDescription>
				</CardHeader>
				<CardContent>
					<form onSubmit={handleSubmit} className="space-y-4">
						<div className="grid grid-cols-2 gap-4">
							<div className="space-y-2">
								<Label htmlFor="firstName">Meno</Label>
								<Input
									id="firstName"
									value={formData.firstName}
									onChange={(e) =>
										setFormData({ ...formData, firstName: e.target.value })
									}
									placeholder="Ján"
									required
									disabled={isSubmitting}
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="lastName">Priezvisko</Label>
								<Input
									id="lastName"
									value={formData.lastName}
									onChange={(e) =>
										setFormData({ ...formData, lastName: e.target.value })
									}
									placeholder="Novák"
									required
									disabled={isSubmitting}
								/>
							</div>
						</div>

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
								minLength={6}
							/>
							<p className="text-xs text-muted-foreground">
								Minimálne 6 znakov
							</p>
						</div>

						<div className="space-y-2">
							<Label htmlFor="confirmPassword">Potvrďte heslo</Label>
							<Input
								id="confirmPassword"
								type="password"
								value={formData.confirmPassword}
								onChange={(e) =>
									setFormData({ ...formData, confirmPassword: e.target.value })
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
							<a href="/login" className="text-primary hover:underline">
								Prihláste sa
							</a>
						</div>
					</form>
				</CardContent>
			</Card>
		</div>
	);
}

import { createFileRoute, redirect } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth-context";
import { useQuery, useMutation } from "convex/react";
import { api } from "convex/_generated/api";
import { useState, useEffect, FormEvent, ChangeEvent } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { Loader2, Save, AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export const Route = createFileRoute("/profile")({
	beforeLoad: ({ location }) => {
		// Check if user is authenticated (only on client side)
		if (typeof window === "undefined") {
			// Skip auth check on server
			return;
		}

		const token = localStorage.getItem("auth_token");
		if (!token) {
			// Redirect to login with return path
			throw redirect({
				to: "/login",
				search: {
					redirect: location.pathname,
				},
			});
		}
	},
	component: ProfilePage,
});

function ProfilePage() {
	const { user, isLoading: authLoading } = useAuth();
	const fullUser = useQuery(
		api.users.getById,
		user?._id ? { id: user._id } : "skip",
	);
	const updateProfile = useMutation(api.users.updateProfile);

	const [isSubmitting, setIsSubmitting] = useState(false);
	const [formData, setFormData] = useState({
		firstName: "",
		lastName: "",
	});

	// Update form data when full user loads
	useEffect(() => {
		if (fullUser) {
			setFormData({
				firstName: fullUser.firstName,
				lastName: fullUser.lastName,
			});
		}
	}, [fullUser]);

	// Show loading state while auth is loading
	if (authLoading) {
		return (
			<div className="container max-w-4xl mx-auto py-8">
				<div className="flex items-center justify-center min-h-[400px]">
					<div className="text-center space-y-4">
						<Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
						<p className="text-muted-foreground">Načítavam profil...</p>
					</div>
				</div>
			</div>
		);
	}

	// Show error if user is not loaded
	if (!user) {
		return (
			<div className="container max-w-4xl mx-auto py-8">
				<Alert variant="destructive">
					<AlertCircle className="h-4 w-4" />
					<AlertTitle>Chyba</AlertTitle>
					<AlertDescription>
						Nepodarilo sa načítať používateľa. Prosím skúste sa prihlásiť znova.
					</AlertDescription>
				</Alert>
			</div>
		);
	}

	const handleInputChange = (
		e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
	) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();
		if (!user) return;

		setIsSubmitting(true);

		try {
			await updateProfile({
				userId: user._id,
				firstName: formData.firstName,
				lastName: formData.lastName,
			});

			toast.success("Profil bol úspešne aktualizovaný");
		} catch (error: any) {
			toast.error("Chyba pri aktualizácii profilu", {
				description: error.message || "Skúste to znova",
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	const displayName = user.fullName || `${user.firstName} ${user.lastName}`;
	const initials = displayName
		.split(" ")
		.map((n) => n[0])
		.join("")
		.toUpperCase()
		.slice(0, 2);

	return (
		<div className="container max-w-4xl mx-auto py-8">
			<div className="mb-8">
				<h1 className="text-3xl font-bold tracking-tight">Môj profil</h1>
				<p className="text-muted-foreground mt-2">
					Spravujte svoje osobné informácie a nastavenia
				</p>
			</div>

			<Card>
				<CardHeader>
					<div className="flex items-center gap-4">
						<Avatar className="h-20 w-20">
							<AvatarImage src={user.imageUrl} alt={displayName} />
							<AvatarFallback className="text-2xl">{initials}</AvatarFallback>
						</Avatar>
						<div>
							<CardTitle>{displayName}</CardTitle>
							<p className="text-sm text-muted-foreground">{user.email}</p>
						</div>
					</div>
				</CardHeader>
				<CardContent>
					<form onSubmit={handleSubmit} className="space-y-6">
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							<div className="space-y-2">
								<Label htmlFor="firstName">Meno</Label>
								<Input
									id="firstName"
									name="firstName"
									value={formData.firstName}
									onChange={handleInputChange}
									disabled={isSubmitting}
									required
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="lastName">Priezvisko</Label>
								<Input
									id="lastName"
									name="lastName"
									value={formData.lastName}
									onChange={handleInputChange}
									disabled={isSubmitting}
									required
								/>
							</div>
						</div>

						<div className="flex justify-end gap-4 pt-4">
							<Button type="submit" disabled={isSubmitting}>
								{isSubmitting ? (
									<>
										<Loader2 className="mr-2 h-4 w-4 animate-spin" />
										Ukladanie...
									</>
								) : (
									<>
										<Save className="mr-2 h-4 w-4" />
										Uložiť zmeny
									</>
								)}
							</Button>
						</div>
					</form>
				</CardContent>
			</Card>
		</div>
	);
}

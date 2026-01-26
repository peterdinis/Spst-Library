import { createFileRoute, Navigate } from "@tanstack/react-router";
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
import { Loader2, Save } from "lucide-react";

export const Route = createFileRoute("/profile")({
	component: ProfilePage,
});

function ProfilePage() {
	const { user } = useAuth();
	const fullUser = useQuery(
		api.users.getById,
		user?._id ? { id: user._id } : "skip",
	);
	const updateProfile = useMutation(api.users.updateProfile);

	const [isSubmitting, setIsSubmitting] = useState(false);
	const [formData, setFormData] = useState({
		firstName: "",
		lastName: "",
		phone: "",
		address: {
			line1: "",
			line2: "",
			city: "",
			state: "",
			postalCode: "",
			country: "",
		},
	});

	// Update form data when full user loads
	useEffect(() => {
		if (fullUser) {
			setFormData({
				firstName: fullUser.firstName,
				lastName: fullUser.lastName,
				phone: fullUser.phone || "",
				address: {
					line1: fullUser.address?.line1 || "",
					line2: fullUser.address?.line2 || "",
					city: fullUser.address?.city || "",
					state: fullUser.address?.state || "",
					postalCode: fullUser.address?.postalCode || "",
					country: fullUser.address?.country || "",
				},
			});
		}
	}, [fullUser]);

	if (!user) {
		return <Navigate to="/login" />;
	}

	const handleInputChange = (
		e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
	) => {
		const { name, value } = e.target;

		if (name.startsWith("address.")) {
			const addressField = name.split(".")[1];
			setFormData((prev) => ({
				...prev,
				address: {
					...prev.address,
					[addressField]: value,
				},
			}));
		} else {
			setFormData((prev) => ({
				...prev,
				[name]: value,
			}));
		}
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
				phone: formData.phone || undefined,
				address: Object.values(formData.address).some((v) => v)
					? {
							line1: formData.address.line1 || undefined,
							line2: formData.address.line2 || undefined,
							city: formData.address.city || undefined,
							state: formData.address.state || undefined,
							postalCode: formData.address.postalCode || undefined,
							country: formData.address.country || undefined,
						}
					: undefined,
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

						<div className="space-y-2">
							<Label htmlFor="phone">Telefón</Label>
							<Input
								id="phone"
								name="phone"
								type="tel"
								value={formData.phone}
								onChange={handleInputChange}
								disabled={isSubmitting}
								placeholder="+421 912 345 678"
							/>
						</div>

						<div className="space-y-4">
							<h3 className="text-lg font-semibold">Adresa</h3>
							<div className="space-y-2">
								<Label htmlFor="address.line1">Adresa (riadok 1)</Label>
								<Input
									id="address.line1"
									name="address.line1"
									value={formData.address.line1}
									onChange={handleInputChange}
									disabled={isSubmitting}
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="address.line2">Adresa (riadok 2)</Label>
								<Input
									id="address.line2"
									name="address.line2"
									value={formData.address.line2}
									onChange={handleInputChange}
									disabled={isSubmitting}
								/>
							</div>

							<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
								<div className="space-y-2">
									<Label htmlFor="address.city">Mesto</Label>
									<Input
										id="address.city"
										name="address.city"
										value={formData.address.city}
										onChange={handleInputChange}
										disabled={isSubmitting}
									/>
								</div>

								<div className="space-y-2">
									<Label htmlFor="address.state">Kraj</Label>
									<Input
										id="address.state"
										name="address.state"
										value={formData.address.state}
										onChange={handleInputChange}
										disabled={isSubmitting}
									/>
								</div>

								<div className="space-y-2">
									<Label htmlFor="address.postalCode">PSČ</Label>
									<Input
										id="address.postalCode"
										name="address.postalCode"
										value={formData.address.postalCode}
										onChange={handleInputChange}
										disabled={isSubmitting}
									/>
								</div>
							</div>

							<div className="space-y-2">
								<Label htmlFor="address.country">Krajina</Label>
								<Input
									id="address.country"
									name="address.country"
									value={formData.address.country}
									onChange={handleInputChange}
									disabled={isSubmitting}
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

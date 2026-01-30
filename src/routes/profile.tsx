import { createFileRoute } from "@tanstack/react-router";
import { authGuard } from "@/lib/auth-guard";
import { useAuth } from "@/lib/auth-context";
import { useQuery, useMutation } from "convex/react";
import { api } from "convex/_generated/api";
import { useState, useEffect, FormEvent, ChangeEvent } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import {
	Loader2,
	Save,
	AlertCircle,
	Book,
	Calendar,
	Clock,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/profile")({
	beforeLoad: authGuard,
	component: ProfilePage,
});

function ProfilePage() {
	const { user, isLoading: authLoading } = useAuth();
	const fullUser = useQuery(
		api.users.getById,
		user?._id ? { id: user._id } : "skip",
	);
	const borrowedBooks = useQuery(
		api.orders.getUserBorrowings,
		user?._id ? { userId: user._id, status: "active" } : "skip",
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
				<div className="flex items-center justify-center min-h-100">
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
		.map((n: any[]) => n[0])
		.join("")
		.toUpperCase()
		.slice(0, 2);

	const formatDueDate = (dueDate: number) => {
		const date = new Date(dueDate);
		const now = new Date();
		const daysUntilDue = Math.ceil(
			(date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
		);

		return {
			formatted: date.toLocaleDateString("sk-SK"),
			daysUntilDue,
			isOverdue: daysUntilDue < 0,
			isDueSoon: daysUntilDue >= 0 && daysUntilDue <= 3,
		};
	};

	return (
		<div className="container max-w-4xl mx-auto py-8">
			<div className="mb-8">
				<h1 className="text-3xl font-bold tracking-tight">Môj profil</h1>
				<p className="text-muted-foreground mt-2">
					Spravujte svoje osobné informácie a nastavenia
				</p>
			</div>

			<div className="space-y-6">
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

				{/* Borrowed Books Section */}
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Book className="h-5 w-5" />
							Požičané knihy
						</CardTitle>
					</CardHeader>
					<CardContent>
						{borrowedBooks === undefined ? (
							<div className="flex items-center justify-center py-8">
								<Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
							</div>
						) : borrowedBooks.length === 0 ? (
							<div className="text-center py-8 text-muted-foreground">
								<Book className="h-12 w-12 mx-auto mb-2 opacity-50" />
								<p>Momentálne nemáte požičané žiadne knihy</p>
							</div>
						) : (
							<div className="space-y-4">
								{borrowedBooks.map((borrowing) => {
									const dueInfo = formatDueDate(borrowing.dueDate);

									return (
										<div
											key={borrowing._id}
											className="flex items-start gap-4 p-4 border rounded-lg hover:bg-accent/50 transition-colors"
										>
											{borrowing.book?.coverImageUrl ? (
												<img
													src={borrowing.book.coverImageUrl}
													alt={borrowing.book.title || "Book cover"}
													className="w-16 h-24 object-cover rounded"
												/>
											) : (
												<div className="w-16 h-24 bg-muted rounded flex items-center justify-center">
													<Book className="h-8 w-8 text-muted-foreground" />
												</div>
											)}

											<div className="flex-1 min-w-0">
												<h3 className="font-semibold text-lg truncate">
													{borrowing.book?.title || "Neznáma kniha"}
												</h3>
												<p className="text-sm text-muted-foreground">
													{borrowing.author?.name || "Neznámy autor"}
												</p>

												<div className="flex flex-wrap items-center gap-3 mt-2">
													<div className="flex items-center gap-1 text-sm">
														<Calendar className="h-4 w-4" />
														<span>
															Požičané:{" "}
															{new Date(
																borrowing.borrowedAt,
															).toLocaleDateString("sk-SK")}
														</span>
													</div>

													<div className="flex items-center gap-1 text-sm">
														<Clock className="h-4 w-4" />
														<span>Vrátiť do: {dueInfo.formatted}</span>
													</div>
												</div>

												<div className="mt-2">
													{dueInfo.isOverdue ? (
														<Badge variant="destructive">
															Po termíne ({Math.abs(dueInfo.daysUntilDue)}{" "}
															{Math.abs(dueInfo.daysUntilDue) === 1
																? "deň"
																: "dni"}
															)
														</Badge>
													) : dueInfo.isDueSoon ? (
														<Badge
															variant="secondary"
															className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
														>
															Blíži sa termín ({dueInfo.daysUntilDue}{" "}
															{dueInfo.daysUntilDue === 1 ? "deň" : "dni"})
														</Badge>
													) : (
														<Badge variant="outline">
															Aktívne ({dueInfo.daysUntilDue}{" "}
															{dueInfo.daysUntilDue === 1 ? "deň" : "dní"})
														</Badge>
													)}
												</div>
											</div>
										</div>
									);
								})}
							</div>
						)}
					</CardContent>
				</Card>
			</div>
		</div>
	);
}

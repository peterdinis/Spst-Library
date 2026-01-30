import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion, Variants } from "framer-motion";
import {
	CalendarDays,
	BookOpen,
	Globe,
	Building,
	MapPin,
	Tag,
	User,
	Folder,
	Copy,
	AlertCircle,
	ArrowLeft,
	Calendar,
	User as UserIcon,
	Mail,
	Clock,
	CheckCircle,
	CalendarRange,
} from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { toast } from "sonner";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

export const Route = createFileRoute("/books/$bookId")({
	component: BookDetailPage,
});

function BookDetailPage() {
	const { bookId } = Route.useParams();
	const navigate = useNavigate();
	const { user } = useAuth();
	const createReservation = useMutation(api.orders.createReservation);
	const [, setIsReservationOpen] = useState(false);
	const [customPeriodEnabled, setCustomPeriodEnabled] = useState(false);
	const [reservationData, setReservationData] = useState({
		name: "",
		email: "",
		phone: "",
		note: "",
		period: "7",
		customPeriod: "14", // Predvolená hodnota pre vlastnú dobu
	});

	const book = useQuery(api.books.getById, { id: bookId as Id<"books"> });

	const containerVariants = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: {
				staggerChildren: 0.1,
				delayChildren: 0.2,
			},
		},
	};

	const itemVariants = {
		hidden: { y: 20, opacity: 0 },
		visible: {
			y: 0,
			opacity: 1,
			transition: {
				type: "spring",
				stiffness: 100,
			},
		},
	};

	const dialogVariants = {
		hidden: {
			opacity: 0,
			scale: 0.8,
			y: -20,
		},
		visible: {
			opacity: 1,
			scale: 1,
			y: 0,
			transition: {
				type: "spring",
				stiffness: 300,
				damping: 25,
				duration: 0.3,
			},
		},
		exit: {
			opacity: 0,
			scale: 0.9,
			transition: {
				duration: 0.2,
			},
		},
	};

	const successVariants = {
		hidden: { scale: 0.8, opacity: 0 },
		visible: {
			scale: 1,
			opacity: 1,
			transition: {
				type: "spring",
				stiffness: 400,
				damping: 20,
			},
		},
	};

	const [reservationStep, setReservationStep] = useState<"form" | "success">(
		"form",
	);
	const [isLoading, setIsLoading] = useState(false);

	const handleReservationSubmit = async () => {
		if (!user) {
			toast.error("Musíte byť prihlásený", {
				description: "Pre rezerváciu knihy sa prosím najskôr prihláste.",
			});
			navigate({
				to: "/login",
				search: {
					redirect: `/books/${bookId}`,
				},
			});
			return;
		}

		setIsLoading(true);

		try {
			await createReservation({
				userId: user._id,
				bookId: bookId as Id<"books">,
				notes: reservationData.note || undefined,
			});

			setReservationStep("success");
			toast.success("Rezervácia úspešná", {
				description: `Kniha "${book?.title}" bola rezervovaná. Potvrdenie sme vám poslali emailom.`,
			});

			// Reset formulára po 3 sekundách
			setTimeout(() => {
				setIsReservationOpen(false);
				setReservationStep("form");
				setCustomPeriodEnabled(false);
				setReservationData({
					name: "",
					email: "",
					phone: "",
					note: "",
					period: "7",
					customPeriod: "14",
				});
			}, 3000);
		} catch (error: any) {
			console.error("Reservation error:", error);
			toast.error("Chyba pri rezervácii", {
				description:
					error.message ||
					"Nepodarilo sa vytvoriť rezerváciu. Skúste to znova.",
			});
		} finally {
			setIsLoading(false);
		}
	};

	const handleCustomPeriodChange = (value: string) => {
		// Validácia: len čísla od 1 do 365
		const numValue = parseInt(value);
		if (isNaN(numValue)) {
			setReservationData({ ...reservationData, customPeriod: "" });
			return;
		}

		if (numValue < 1) {
			setReservationData({ ...reservationData, customPeriod: "1" });
		} else if (numValue > 365) {
			setReservationData({ ...reservationData, customPeriod: "365" });
		} else {
			setReservationData({ ...reservationData, customPeriod: value });
		}
	};

	const getReservationPeriod = () => {
		return customPeriodEnabled
			? reservationData.customPeriod
			: reservationData.period;
	};

	const getReservationPeriodLabel = () => {
		const period = parseInt(getReservationPeriod());
		if (period === 1) return "1 deň";
		if (period >= 2 && period <= 4) return `${period} dni`;
		return `${period} dní`;
	};

	if (book === undefined) {
		return (
			<div className="container mx-auto px-4 py-8">
				<div className="max-w-4xl mx-auto">
					<Skeleton className="h-8 w-48 mb-6" />
					<div className="grid md:grid-cols-3 gap-8">
						<div className="md:col-span-1">
							<Skeleton className="h-100 w-full rounded-lg" />
						</div>
						<div className="md:col-span-2 space-y-4">
							<Skeleton className="h-10 w-3/4" />
							<Skeleton className="h-6 w-1/2" />
							<Skeleton className="h-4 w-full" />
							<Skeleton className="h-4 w-5/6" />
							<Skeleton className="h-4 w-4/6" />
							<div className="space-y-2 pt-4">
								<Skeleton className="h-6 w-32" />
								<Skeleton className="h-8 w-24" />
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}

	if (!book) {
		return (
			<div className="container mx-auto px-4 py-8">
				<motion.div
					initial={{ opacity: 0, scale: 0.95 }}
					animate={{ opacity: 1, scale: 1 }}
					className="max-w-md mx-auto text-center"
				>
					<AlertCircle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
					<h2 className="text-2xl font-bold mb-2">Kniha nebola nájdená</h2>
					<p className="text-muted-foreground mb-6">
						Požadovaná kniha neexistuje alebo bola odstránená.
					</p>
					<Button onClick={() => navigate({ to: "/books" })}>
						Späť na zoznam kníh
					</Button>
				</motion.div>
			</div>
		);
	}

	const statusColors = {
		available: "bg-green-100 text-green-800 hover:bg-green-100",
		reserved: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
		maintenance: "bg-blue-100 text-blue-800 hover:bg-blue-100",
		lost: "bg-red-100 text-red-800 hover:bg-red-100",
	};

	const statusLabels = {
		available: "Dostupná",
		reserved: "Rezervovaná",
		maintenance: "V údržbe",
		lost: "Stratená",
	};

	return (
		<div className="container mx-auto px-4 py-8">
			<motion.div
				variants={containerVariants}
				initial="hidden"
				animate="visible"
				className="max-w-6xl mx-auto"
			>
				{/* Header s navigáciou späť */}
				<motion.div
					variants={itemVariants as unknown as Variants}
					className="mb-6"
				>
					<Button
						variant="ghost"
						onClick={() => navigate({ to: "/books" })}
						className="mb-4"
					>
						<ArrowLeft className="mr-2 h-4 w-4" />
						Späť na zoznam kníh
					</Button>
				</motion.div>

				<div className="grid lg:grid-cols-3 gap-8">
					{/* Ľavý stĺpec - Obrázok a základné info */}
					<motion.div
						variants={itemVariants as unknown as Variants}
						className="lg:col-span-1"
					>
						<Card className="overflow-hidden">
							<div className="aspect-3/4 relative bg-linear-to-br from-muted/50 to-muted">
								{book.coverFileId ? (
									<div className="w-full h-full flex items-center justify-center">
										<img
											loading="lazy"
											src={book.coverFile?.url!}
											alt={book.title}
										/>
									</div>
								) : (
									<div className="w-full h-full flex items-center justify-center">
										<BookOpen className="h-24 w-24 text-muted-foreground/50" />
									</div>
								)}
								<div className="absolute top-4 right-4">
									<Badge
										className={`${
											statusColors[book.status]
										} font-semibold px-3 py-1`}
									>
										{statusLabels[book.status]}
									</Badge>
								</div>
							</div>

							<CardContent className="p-6">
								<div className="space-y-4">
									{/* Informácie o dostupnosti */}
									<div className="grid grid-cols-2 gap-4">
										<div className="text-center p-3 bg-muted rounded-lg">
											<p className="text-sm text-muted-foreground">Celkovo</p>
											<p className="text-2xl font-bold">{book.totalCopies}</p>
											<p className="text-xs text-muted-foreground">výtlačkov</p>
										</div>
										<div className="text-center p-3 bg-green-50 rounded-lg">
											<p className="text-sm text-muted-foreground">
												Dostupných
											</p>
											<p className="text-2xl font-bold text-green-600">
												{book.availableCopies}
											</p>
											<p className="text-xs text-muted-foreground">výtlačkov</p>
										</div>
									</div>

									{/* Rýchle akcie */}
									{book.availableCopies > 0 && book.status === "available" && (
										<motion.div
											initial={{ opacity: 0, y: 10 }}
											animate={{ opacity: 1, y: 0 }}
											transition={{ delay: 0.5 }}
										>
											<Dialog>
												<DialogTrigger asChild>
													<Button size="lg" className="w-full">
														Rezervovať knihu
													</Button>
												</DialogTrigger>
												<DialogContent className="sm:max-w-md p-0 overflow-hidden border-0 bg-transparent">
													<motion.div
														variants={dialogVariants as unknown as Variants}
														initial="hidden"
														animate="visible"
														exit="exit"
														className="bg-background rounded-lg shadow-lg overflow-hidden"
													>
														{reservationStep === "form" ? (
															<>
																<DialogHeader className="p-6 pb-0">
																	<DialogTitle className="text-2xl font-bold flex items-center gap-2">
																		<Calendar className="h-6 w-6" />
																		Rezervácia knihy
																	</DialogTitle>
																	<DialogDescription className="pt-2">
																		Vyplňte formulár pre rezerváciu knihy "
																		<span className="font-semibold">
																			{book.title}
																		</span>
																		"
																	</DialogDescription>
																</DialogHeader>

																<div className="p-6">
																	<div className="space-y-4">
																		{/* Osobný údaje */}
																		<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
																			<div className="space-y-2">
																				<Label htmlFor="name">
																					<UserIcon className="h-4 w-4 inline mr-2" />
																					Meno a priezvisko *
																				</Label>
																				<Input
																					id="name"
																					placeholder="Zadajte vaše meno"
																					value={reservationData.name}
																					onChange={(e) =>
																						setReservationData({
																							...reservationData,
																							name: e.target.value,
																						})
																					}
																				/>
																			</div>

																			<div className="space-y-2">
																				<Label htmlFor="email">
																					<Mail className="h-4 w-4 inline mr-2" />
																					Email *
																				</Label>
																				<Input
																					id="email"
																					type="email"
																					placeholder="vas@email.com"
																					value={reservationData.email}
																					onChange={(e) =>
																						setReservationData({
																							...reservationData,
																							email: e.target.value,
																						})
																					}
																				/>
																			</div>
																		</div>

																		<div className="space-y-2">
																			<Label htmlFor="phone">
																				Telefónne číslo
																			</Label>
																			<Input
																				id="phone"
																				placeholder="+421 123 456 789"
																				value={reservationData.phone}
																				onChange={(e) =>
																					setReservationData({
																						...reservationData,
																						phone: e.target.value,
																					})
																				}
																			/>
																		</div>

																		{/* Doba výpožičky */}
																		<div className="space-y-4">
																			<div className="flex items-center justify-between">
																				<Label className="flex items-center gap-2">
																					<Clock className="h-4 w-4" />
																					Doba výpožičky
																				</Label>
																				<div className="flex items-center gap-2">
																					<CalendarRange className="h-4 w-4 text-muted-foreground" />
																					<Switch
																						checked={customPeriodEnabled}
																						onCheckedChange={
																							setCustomPeriodEnabled
																						}
																					/>
																					<span className="text-sm text-muted-foreground">
																						Vlastná doba
																					</span>
																				</div>
																			</div>

																			{!customPeriodEnabled ? (
																				<Select
																					value={reservationData.period}
																					onValueChange={(value) =>
																						setReservationData({
																							...reservationData,
																							period: value,
																						})
																					}
																				>
																					<SelectTrigger>
																						<SelectValue placeholder="Vyberte dobu výpožičky" />
																					</SelectTrigger>
																					<SelectContent>
																						<SelectItem value="1">
																							1 deň
																						</SelectItem>
																						<SelectItem value="3">
																							3 dni
																						</SelectItem>
																						<SelectItem value="7">
																							7 dní (štandard)
																						</SelectItem>
																						<SelectItem value="14">
																							14 dní
																						</SelectItem>
																						<SelectItem value="21">
																							21 dní
																						</SelectItem>
																						<SelectItem value="30">
																							30 dní
																						</SelectItem>
																					</SelectContent>
																				</Select>
																			) : (
																				<div className="space-y-2">
																					<div className="flex items-center gap-2">
																						<Input
																							type="number"
																							min="1"
																							max="365"
																							value={
																								reservationData.customPeriod
																							}
																							onChange={(e) =>
																								handleCustomPeriodChange(
																									e.target.value,
																								)
																							}
																							className="flex-1"
																						/>
																						<span className="text-sm whitespace-nowrap">
																							dní
																						</span>
																					</div>
																					<p className="text-xs text-muted-foreground">
																						Zadajte počet dní od 1 do 365
																					</p>
																				</div>
																			)}
																		</div>

																		{/* Poznámka */}
																		<div className="space-y-2">
																			<Label htmlFor="note">Poznámka</Label>
																			<Textarea
																				id="note"
																				placeholder="Váš komentár k rezervácii..."
																				rows={3}
																				value={reservationData.note}
																				onChange={(e) =>
																					setReservationData({
																						...reservationData,
																						note: e.target.value,
																					})
																				}
																			/>
																		</div>

																		{/* Informácie o rezervácii */}
																		<div className="bg-muted/50 p-4 rounded-lg space-y-2">
																			<div className="flex justify-between">
																				<span className="text-sm text-muted-foreground">
																					Dostupných výtlačkov:
																				</span>
																				<span className="font-semibold">
																					{book.availableCopies}
																				</span>
																			</div>
																			<div className="flex justify-between">
																				<span className="text-sm text-muted-foreground">
																					Autor:
																				</span>
																				<span>{book.author.name}</span>
																			</div>
																			<div className="flex justify-between">
																				<span className="text-sm text-muted-foreground">
																					Doba rezervácie:
																				</span>
																				<span className="font-semibold">
																					{getReservationPeriodLabel()}
																					{customPeriodEnabled && (
																						<span className="ml-1 text-xs text-primary">
																							(vlastná)
																						</span>
																					)}
																				</span>
																			</div>
																		</div>

																		{/* Tlačidlá */}
																		<div className="flex gap-3 pt-4">
																			<Button
																				variant="outline"
																				className="flex-1"
																				onClick={() =>
																					setIsReservationOpen(false)
																				}
																			>
																				Zrušiť
																			</Button>
																			<Button
																				className="flex-1"
																				onClick={handleReservationSubmit}
																				disabled={
																					isLoading ||
																					!reservationData.name ||
																					!reservationData.email ||
																					(customPeriodEnabled &&
																						(!reservationData.customPeriod ||
																							parseInt(
																								reservationData.customPeriod,
																							) < 1))
																				}
																			>
																				{isLoading ? (
																					<>
																						<div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-2" />
																						Spracúvam...
																					</>
																				) : (
																					"Potvrdiť rezerváciu"
																				)}
																			</Button>
																		</div>
																	</div>
																</div>
															</>
														) : (
															// Úspešná rezervácia
															<motion.div
																variants={
																	successVariants as unknown as Variants
																}
																initial="hidden"
																animate="visible"
																className="p-8 text-center"
															>
																<motion.div
																	animate={{
																		scale: [1, 1.2, 1],
																		rotate: [0, 10, -10, 0],
																	}}
																	transition={{
																		duration: 0.5,
																		times: [0, 0.5, 0.8, 1],
																	}}
																	className="mb-4"
																>
																	<CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
																</motion.div>

																<DialogTitle className="text-2xl font-bold mb-2">
																	Rezervácia bola úspešná!
																</DialogTitle>

																<DialogDescription className="mb-6">
																	Kniha "
																	<span className="font-semibold">
																		{book.title}
																	</span>
																	" bola rezervovaná na vaše meno.
																</DialogDescription>

																<div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
																	<div className="text-left space-y-2">
																		<p className="text-sm text-green-800">
																			<strong>Doba výpožičky:</strong>{" "}
																			{getReservationPeriodLabel()}
																			{customPeriodEnabled && " (vlastná)"}
																		</p>
																		<p className="text-sm text-green-800">
																			<strong>Email:</strong>{" "}
																			{reservationData.email}
																		</p>
																		<p className="text-sm text-green-800">
																			<strong>Meno:</strong>{" "}
																			{reservationData.name}
																		</p>
																	</div>
																	<p className="text-xs text-green-600 mt-3">
																		Potvrdenie o rezervácii bolo odoslané na
																		email. Rezerváciu si môžete vyzdvihnúť v
																		priebehu 24 hodín.
																	</p>
																</div>

																<Button
																	variant="outline"
																	onClick={() => setIsReservationOpen(false)}
																	className="w-full"
																>
																	Pokračovať
																</Button>
															</motion.div>
														)}
													</motion.div>
												</DialogContent>
											</Dialog>
										</motion.div>
									)}

									<Separator />

									{/* Tagy */}
									{book.tags && book.tags.length > 0 && (
										<div>
											<h4 className="text-sm font-medium mb-2 flex items-center gap-2">
												<Tag className="h-4 w-4" />
												Štítky
											</h4>
											<div className="flex flex-wrap gap-2">
												{book.tags.map((tag, index) => (
													<Badge
														key={index}
														variant="secondary"
														className="font-normal"
													>
														{tag}
													</Badge>
												))}
											</div>
										</div>
									)}

									{/* Lokácia */}
									{book.location && (
										<div>
											<h4 className="text-sm font-medium mb-2 flex items-center gap-2">
												<MapPin className="h-4 w-4" />
												Umiestnenie
											</h4>
											<p className="text-sm">{book.location}</p>
										</div>
									)}
								</div>
							</CardContent>
						</Card>
					</motion.div>

					{/* Pravý stĺpec - Podrobnosti */}
					<motion.div
						variants={itemVariants as unknown as Variants}
						className="lg:col-span-2 space-y-6"
					>
						{/* Hlavný nadpis a autor */}
						<Card>
							<CardHeader>
								<motion.div
									initial={{ opacity: 0, y: -10 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ delay: 0.2 }}
								>
									<CardTitle className="text-3xl md:text-4xl font-bold tracking-tight">
										{book.title}
									</CardTitle>
									<CardDescription className="text-lg pt-2">
										<div className="flex items-center gap-2">
											<User className="h-4 w-4" />
											<span className="hover:text-primary cursor-pointer transition-colors">
												{book.author.name}
											</span>
										</div>
									</CardDescription>
								</motion.div>
							</CardHeader>
						</Card>

						{/* Taby */}
						<Tabs defaultValue="details" className="w-full">
							<TabsList className="grid w-full grid-cols-3">
								<TabsTrigger value="details">Detaily</TabsTrigger>
								<TabsTrigger value="description">Popis</TabsTrigger>
								<TabsTrigger value="additional">Ďalšie informácie</TabsTrigger>
							</TabsList>

							<TabsContent value="details" className="space-y-4 pt-4">
								<Card>
									<CardContent className="pt-6">
										<div className="grid md:grid-cols-2 gap-6">
											<div className="space-y-4">
												<InfoItem
													icon={<CalendarDays />}
													label="Rok vydania"
													value={book.publishedYear?.toString() || "Neznámy"}
												/>
												<InfoItem
													icon={<Building />}
													label="Vydavateľ"
													value={book.publisher || "Neznámy"}
												/>
												<InfoItem
													icon={<BookOpen />}
													label="Počet strán"
													value={book.pages?.toString() || "Neznámy"}
												/>
											</div>
											<div className="space-y-4">
												<InfoItem
													icon={<Globe />}
													label="Jazyk"
													value={book.language || "Neznámy"}
												/>
												<InfoItem
													icon={<Copy />}
													label="ISBN"
													value={book.isbn || "Neznáme"}
												/>
												<InfoItem
													icon={<Folder />}
													label="Kategória"
													value={
														<Badge
															variant="outline"
															className="font-normal cursor-pointer hover:bg-muted"
														>
															{book.category.name}
														</Badge>
													}
												/>
											</div>
										</div>
									</CardContent>
								</Card>
							</TabsContent>

							<TabsContent value="description" className="pt-4">
								<Card>
									<CardContent className="pt-6">
										<motion.div
											initial={{ opacity: 0 }}
											animate={{ opacity: 1 }}
											transition={{ delay: 0.1 }}
											className="prose prose-sm max-w-none dark:prose-invert"
										>
											{book.description ? (
												<p className="whitespace-pre-line">
													{book.description}
												</p>
											) : (
												<p className="text-muted-foreground italic">
													Táto kniha nemá popis.
												</p>
											)}
										</motion.div>
									</CardContent>
								</Card>
							</TabsContent>

							<TabsContent value="additional" className="pt-4">
								<Card>
									<CardContent className="pt-6">
										<div className="space-y-4">
											<div>
												<h4 className="font-medium mb-2">Dátum pridania</h4>
												<p className="text-sm">
													{new Date(book.addedAt).toLocaleDateString("sk-SK", {
														day: "2-digit",
														month: "2-digit",
														year: "numeric",
														hour: "2-digit",
														minute: "2-digit",
													})}
												</p>
											</div>
											<div>
												<h4 className="font-medium mb-2">
													Počet kníh od autora
												</h4>
												<p className="text-sm">{book.author.bookCount}</p>
											</div>
											<div>
												<h4 className="font-medium mb-2">
													Počet kníh v kategórii
												</h4>
												<p className="text-sm">{book.category.bookCount}</p>
											</div>
										</div>
									</CardContent>
								</Card>
							</TabsContent>
						</Tabs>

						{/* Statistiky */}
						<motion.div
							variants={itemVariants as unknown as Variants}
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ delay: 0.4 }}
						>
							<Card>
								<CardHeader>
									<CardTitle className="text-lg">Štatistiky</CardTitle>
								</CardHeader>
								<CardContent>
									<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
										<StatItem
											label="Celkový počet"
											value={book.totalCopies}
											color="text-blue-600"
										/>
										<StatItem
											label="Dostupné"
											value={book.availableCopies}
											color="text-green-600"
										/>
										<StatItem
											label="Vypožičané"
											value={book.totalCopies - book.availableCopies}
											color="text-yellow-600"
										/>
										<StatItem
											label="Percento dostupnosti"
											value={`${Math.round(
												(book.availableCopies / book.totalCopies) * 100,
											)}%`}
											color="text-purple-600"
										/>
									</div>
								</CardContent>
							</Card>
						</motion.div>
					</motion.div>
				</div>
			</motion.div>
		</div>
	);
}

interface InfoItemProps {
	icon: React.ReactNode;
	label: string;
	value: React.ReactNode;
}

function InfoItem({ icon, label, value }: InfoItemProps) {
	return (
		<div className="flex items-start gap-3">
			<div className="text-muted-foreground mt-0.5">{icon}</div>
			<div>
				<p className="text-sm font-medium">{label}</p>
				<p className="text-sm">{value}</p>
			</div>
		</div>
	);
}

interface StatItemProps {
	label: string;
	value: string | number;
	color: string;
}

function StatItem({ label, value, color }: StatItemProps) {
	return (
		<div className="text-center">
			<p className={`text-2xl font-bold ${color}`}>{value}</p>
			<p className="text-sm text-muted-foreground">{label}</p>
		</div>
	);
}

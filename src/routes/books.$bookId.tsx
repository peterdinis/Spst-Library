import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation } from "convex/react";
import { ConvexError } from "convex/values";
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
		customPeriod: "14",
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
			const errorMessage =
				error instanceof ConvexError || error.data?.message
					? error.data?.message || error.message
					: typeof error === "string"
						? error
						: "Nepodarilo sa vytvoriť rezerváciu. Skúste to znova.";

			toast.error("Chyba pri rezervácii", {
				description: errorMessage,
			});
		} finally {
			setIsLoading(false);
		}
	};

	const handleCustomPeriodChange = (value: string) => {
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
			<div className="container mx-auto px-4 py-6 sm:py-8">
				<div className="max-w-4xl mx-auto">
					<Skeleton className="h-8 w-48 mb-6" />
					<div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
						<div className="md:col-span-1">
							<Skeleton className="h-[280px] sm:h-[320px] w-full rounded-lg" />
						</div>
						<div className="md:col-span-2 space-y-4">
							<Skeleton className="h-8 sm:h-10 w-3/4" />
							<Skeleton className="h-5 sm:h-6 w-1/2" />
							<Skeleton className="h-4 w-full" />
							<Skeleton className="h-4 w-5/6" />
							<Skeleton className="h-4 w-4/6" />
							<div className="space-y-2 pt-4">
								<Skeleton className="h-5 sm:h-6 w-32" />
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
			<div className="container mx-auto px-4 py-8 sm:py-12">
				<motion.div
					initial={{ opacity: 0, scale: 0.95 }}
					animate={{ opacity: 1, scale: 1 }}
					className="max-w-md mx-auto text-center"
				>
					<AlertCircle className="h-12 sm:h-16 w-12 sm:w-16 text-muted-foreground mx-auto mb-4" />
					<h2 className="text-xl sm:text-2xl font-bold mb-2">Kniha nebola nájdená</h2>
					<p className="text-sm sm:text-base text-muted-foreground mb-6">
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
		<div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 md:py-8">
			<motion.div
				variants={containerVariants}
				initial="hidden"
				animate="visible"
				className="max-w-6xl mx-auto"
			>
				{/* Header s navigáciou späť */}
				<motion.div
					variants={itemVariants as unknown as Variants}
					className="mb-4 sm:mb-6"
				>
					<Button
						variant="ghost"
						onClick={() => navigate({ to: "/books" })}
						className="mb-4 px-2 sm:px-4"
						size="sm"
					>
						<ArrowLeft className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
						Späť na zoznam kníh
					</Button>
				</motion.div>

				<div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
					{/* Ľavý stĺpec - Obrázok a základné info */}
					<motion.div
						variants={itemVariants as unknown as Variants}
						className="lg:col-span-1"
					>
						<Card className="overflow-hidden">
							<div className="aspect-3/4 relative bg-linear-to-br from-muted/50 to-muted">
								{book.coverFileId ? (
									<div className="w-full h-full flex items-center justify-center p-4 sm:p-6">
										<img
											loading="lazy"
											src={book.coverFile?.url!}
											alt={book.title}
											className="max-h-full max-w-full object-contain"
										/>
									</div>
								) : (
									<div className="w-full h-full flex items-center justify-center">
										<BookOpen className="h-16 w-16 sm:h-20 sm:w-20 md:h-24 md:w-24 text-muted-foreground/50" />
									</div>
								)}
								<div className="absolute top-2 right-2 sm:top-4 sm:right-4">
									<Badge
										className={`${statusColors[book.status]
											} font-semibold px-2 py-0.5 sm:px-3 sm:py-1 text-xs sm:text-sm`}
									>
										{statusLabels[book.status]}
									</Badge>
								</div>
							</div>

							<CardContent className="p-4 sm:p-6">
								<div className="space-y-3 sm:space-y-4">
									{/* Informácie o dostupnosti */}
									<div className="grid grid-cols-2 gap-3 sm:gap-4">
										<div className="text-center p-3 bg-muted rounded-lg">
											<p className="text-xs sm:text-sm text-muted-foreground">Celkovo</p>
											<p className="text-xl sm:text-2xl font-bold">{book.totalCopies}</p>
											<p className="text-xs text-muted-foreground">výtlačkov</p>
										</div>
										<div className="text-center p-3 bg-green-50 rounded-lg">
											<p className="text-xs sm:text-sm text-muted-foreground">
												Dostupných
											</p>
											<p className="text-xl sm:text-2xl font-bold text-green-600">
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
													<Button size="lg" className="w-full text-sm sm:text-base">
														Rezervovať knihu
													</Button>
												</DialogTrigger>
												<DialogContent className="sm:max-w-md p-0 overflow-hidden border-0 bg-transparent max-w-[95vw]">
													<motion.div
														variants={dialogVariants as unknown as Variants}
														initial="hidden"
														animate="visible"
														exit="exit"
														className="bg-background rounded-lg shadow-lg overflow-hidden"
													>
														{reservationStep === "form" ? (
															<>
																<DialogHeader className="p-4 sm:p-6 pb-0">
																	<DialogTitle className="text-xl sm:text-2xl font-bold flex items-center gap-2">
																		<Calendar className="h-5 w-5 sm:h-6 sm:w-6" />
																		Rezervácia knihy
																	</DialogTitle>
																	<DialogDescription className="pt-2 text-sm sm:text-base">
																		Vyplňte formulár pre rezerváciu knihy "
																		<span className="font-semibold">
																			{book.title}
																		</span>
																		"
																	</DialogDescription>
																</DialogHeader>

																<div className="p-4 sm:p-6">
																	<div className="space-y-3 sm:space-y-4">
																		{/* Osobný údaje */}
																		<div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
																			<div className="space-y-1 sm:space-y-2">
																				<Label htmlFor="name" className="text-xs sm:text-sm">
																					<UserIcon className="h-3 w-3 sm:h-4 sm:w-4 inline mr-1 sm:mr-2" />
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
																					className="text-sm sm:text-base"
																				/>
																			</div>

																			<div className="space-y-1 sm:space-y-2">
																				<Label htmlFor="email" className="text-xs sm:text-sm">
																					<Mail className="h-3 w-3 sm:h-4 sm:w-4 inline mr-1 sm:mr-2" />
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
																					className="text-sm sm:text-base"
																				/>
																			</div>
																		</div>

																		<div className="space-y-1 sm:space-y-2">
																			<Label htmlFor="phone" className="text-xs sm:text-sm">
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
																				className="text-sm sm:text-base"
																			/>
																		</div>

																		{/* Doba výpožičky */}
																		<div className="space-y-3 sm:space-y-4">
																			<div className="flex items-center justify-between">
																				<Label className="flex items-center gap-2 text-xs sm:text-sm">
																					<Clock className="h-3 w-3 sm:h-4 sm:w-4" />
																					Doba výpožičky
																				</Label>
																				<div className="flex items-center gap-2">
																					<CalendarRange className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
																					<Switch
																						checked={customPeriodEnabled}
																						onCheckedChange={
																							setCustomPeriodEnabled
																						}
																						className="h-4 w-7 sm:h-5 sm:w-9"
																					/>
																					<span className="text-xs sm:text-sm text-muted-foreground">
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
																					<SelectTrigger className="text-sm sm:text-base">
																						<SelectValue placeholder="Vyberte dobu výpožičky" />
																					</SelectTrigger>
																					<SelectContent>
																						<SelectItem value="1" className="text-sm sm:text-base">
																							1 deň
																						</SelectItem>
																						<SelectItem value="3" className="text-sm sm:text-base">
																							3 dni
																						</SelectItem>
																						<SelectItem value="7" className="text-sm sm:text-base">
																							7 dní (štandard)
																						</SelectItem>
																						<SelectItem value="14" className="text-sm sm:text-base">
																							14 dní
																						</SelectItem>
																						<SelectItem value="21" className="text-sm sm:text-base">
																							21 dní
																						</SelectItem>
																						<SelectItem value="30" className="text-sm sm:text-base">
																							30 dní
																						</SelectItem>
																					</SelectContent>
																				</Select>
																			) : (
																				<div className="space-y-1 sm:space-y-2">
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
																							className="flex-1 text-sm sm:text-base"
																						/>
																						<span className="text-xs sm:text-sm whitespace-nowrap">
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
																		<div className="space-y-1 sm:space-y-2">
																			<Label htmlFor="note" className="text-xs sm:text-sm">Poznámka</Label>
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
																				className="text-sm sm:text-base"
																			/>
																		</div>

																		{/* Informácie o rezervácii */}
																		<div className="bg-muted/50 p-3 sm:p-4 rounded-lg space-y-2">
																			<div className="flex justify-between">
																				<span className="text-xs sm:text-sm text-muted-foreground">
																					Dostupných výtlačkov:
																				</span>
																				<span className="font-semibold text-xs sm:text-sm">
																					{book.availableCopies}
																				</span>
																			</div>
																			<div className="flex justify-between">
																				<span className="text-xs sm:text-sm text-muted-foreground">
																					Autor:
																				</span>
																				<span className="text-xs sm:text-sm">{book.author.name}</span>
																			</div>
																			<div className="flex justify-between">
																				<span className="text-xs sm:text-sm text-muted-foreground">
																					Doba rezervácie:
																				</span>
																				<span className="font-semibold text-xs sm:text-sm">
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
																		<div className="flex gap-2 sm:gap-3 pt-3 sm:pt-4">
																			<Button
																				variant="outline"
																				className="flex-1 text-xs sm:text-sm"
																				onClick={() =>
																					setIsReservationOpen(false)
																				}
																			>
																				Zrušiť
																			</Button>
																			<Button
																				className="flex-1 text-xs sm:text-sm"
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
																						<div className="h-3 w-3 sm:h-4 sm:w-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-1 sm:mr-2" />
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
																className="p-4 sm:p-8 text-center"
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
																	<CheckCircle className="h-12 w-12 sm:h-16 sm:w-16 text-green-500 mx-auto" />
																</motion.div>

																<DialogTitle className="text-xl sm:text-2xl font-bold mb-2">
																	Rezervácia bola úspešná!
																</DialogTitle>

																<DialogDescription className="mb-4 sm:mb-6 text-sm sm:text-base">
																	Kniha "
																	<span className="font-semibold">
																		{book.title}
																	</span>
																	" bola rezervovaná na vaše meno.
																</DialogDescription>

																<div className="bg-green-50 border border-green-200 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6">
																	<div className="text-left space-y-2">
																		<p className="text-xs sm:text-sm text-green-800">
																			<strong>Doba výpožičky:</strong>{" "}
																			{getReservationPeriodLabel()}
																			{customPeriodEnabled && " (vlastná)"}
																		</p>
																		<p className="text-xs sm:text-sm text-green-800">
																			<strong>Email:</strong>{" "}
																			{reservationData.email}
																		</p>
																		<p className="text-xs sm:text-sm text-green-800">
																			<strong>Meno:</strong>{" "}
																			{reservationData.name}
																		</p>
																	</div>
																	<p className="text-xs text-green-600 mt-2 sm:mt-3">
																		Potvrdenie o rezervácii bolo odoslané na
																		email. Rezerváciu si môžete vyzdvihnúť v
																		priebehu 24 hodín.
																	</p>
																</div>

																<Button
																	variant="outline"
																	onClick={() => setIsReservationOpen(false)}
																	className="w-full text-xs sm:text-sm"
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

									<Separator className="my-3 sm:my-4" />

									{/* Tagy */}
									{book.tags && book.tags.length > 0 && (
										<div>
											<h4 className="text-xs sm:text-sm font-medium mb-1 sm:mb-2 flex items-center gap-1 sm:gap-2">
												<Tag className="h-3 w-3 sm:h-4 sm:w-4" />
												Štítky
											</h4>
											<div className="flex flex-wrap gap-1 sm:gap-2">
												{book.tags.map((tag, index) => (
													<Badge
														key={index}
														variant="secondary"
														className="font-normal text-xs"
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
											<h4 className="text-xs sm:text-sm font-medium mb-1 sm:mb-2 flex items-center gap-1 sm:gap-2">
												<MapPin className="h-3 w-3 sm:h-4 sm:w-4" />
												Umiestnenie
											</h4>
											<p className="text-xs sm:text-sm">{book.location}</p>
										</div>
									)}
								</div>
							</CardContent>
						</Card>
					</motion.div>

					{/* Pravý stĺpec - Podrobnosti */}
					<motion.div
						variants={itemVariants as unknown as Variants}
						className="lg:col-span-2 space-y-4 sm:space-y-6"
					>
						{/* Hlavný nadpis a autor */}
						<Card>
							<CardHeader className="p-4 sm:p-6">
								<motion.div
									initial={{ opacity: 0, y: -10 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ delay: 0.2 }}
								>
									<CardTitle className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight">
										{book.title}
									</CardTitle>
									<CardDescription className="text-sm sm:text-base md:text-lg pt-1 sm:pt-2">
										<div className="flex items-center gap-1 sm:gap-2">
											<User className="h-3 w-3 sm:h-4 sm:w-4" />
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
								<TabsTrigger value="details" className="text-xs sm:text-sm">
									Detaily
								</TabsTrigger>
								<TabsTrigger value="description" className="text-xs sm:text-sm">
									Popis
								</TabsTrigger>
								<TabsTrigger value="additional" className="text-xs sm:text-sm">
									Ďalšie
								</TabsTrigger>
							</TabsList>

							<TabsContent value="details" className="space-y-3 sm:space-y-4 pt-3 sm:pt-4">
								<Card>
									<CardContent className="pt-4 sm:pt-6">
										<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
											<div className="space-y-3 sm:space-y-4">
												<InfoItem
													icon={<CalendarDays className="h-4 w-4 sm:h-5 sm:w-5" />}
													label="Rok vydania"
													value={book.publishedYear?.toString() || "Neznámy"}
												/>
												<InfoItem
													icon={<Building className="h-4 w-4 sm:h-5 sm:w-5" />}
													label="Vydavateľ"
													value={book.publisher || "Neznámy"}
												/>
												<InfoItem
													icon={<BookOpen className="h-4 w-4 sm:h-5 sm:w-5" />}
													label="Počet strán"
													value={book.pages?.toString() || "Neznámy"}
												/>
											</div>
											<div className="space-y-3 sm:space-y-4">
												<InfoItem
													icon={<Globe className="h-4 w-4 sm:h-5 sm:w-5" />}
													label="Jazyk"
													value={book.language || "Neznámy"}
												/>
												<InfoItem
													icon={<Copy className="h-4 w-4 sm:h-5 sm:w-5" />}
													label="ISBN"
													value={book.isbn || "Neznáme"}
												/>
												<InfoItem
													icon={<Folder className="h-4 w-4 sm:h-5 sm:w-5" />}
													label="Kategória"
													value={
														<Badge
															variant="outline"
															className="font-normal cursor-pointer hover:bg-muted text-xs"
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

							<TabsContent value="description" className="pt-3 sm:pt-4">
								<Card>
									<CardContent className="pt-4 sm:pt-6">
										<motion.div
											initial={{ opacity: 0 }}
											animate={{ opacity: 1 }}
											transition={{ delay: 0.1 }}
											className="prose prose-sm max-w-none dark:prose-invert"
										>
											{book.description ? (
												<p className="whitespace-pre-line text-sm sm:text-base">
													{book.description}
												</p>
											) : (
												<p className="text-muted-foreground italic text-sm sm:text-base">
													Táto kniha nemá popis.
												</p>
											)}
										</motion.div>
									</CardContent>
								</Card>
							</TabsContent>

							<TabsContent value="additional" className="pt-3 sm:pt-4">
								<Card>
									<CardContent className="pt-4 sm:pt-6">
										<div className="space-y-3 sm:space-y-4">
											<div>
												<h4 className="font-medium mb-1 sm:mb-2 text-sm sm:text-base">Dátum pridania</h4>
												<p className="text-xs sm:text-sm">
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
												<h4 className="font-medium mb-1 sm:mb-2 text-sm sm:text-base">
													Počet kníh od autora
												</h4>
												<p className="text-xs sm:text-sm">{book.author.bookCount}</p>
											</div>
											<div>
												<h4 className="font-medium mb-1 sm:mb-2 text-sm sm:text-base">
													Počet kníh v kategórii
												</h4>
												<p className="text-xs sm:text-sm">{book.category.bookCount}</p>
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
								<CardHeader className="p-4 sm:p-6">
									<CardTitle className="text-base sm:text-lg">Štatistiky</CardTitle>
								</CardHeader>
								<CardContent className="p-4 sm:p-6 pt-0">
									<div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
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
		<div className="flex items-start gap-2 sm:gap-3">
			<div className="text-muted-foreground mt-0.5">{icon}</div>
			<div>
				<p className="text-xs sm:text-sm font-medium">{label}</p>
				<p className="text-xs sm:text-sm">{value}</p>
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
			<p className={`text-lg sm:text-xl md:text-2xl font-bold ${color}`}>{value}</p>
			<p className="text-xs sm:text-sm text-muted-foreground">{label}</p>
		</div>
	);
}
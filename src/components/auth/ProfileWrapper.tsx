import React, { FC, useState } from "react";
import {
	BookOpen,
	Calendar,
	Clock,
	Eye,
	RefreshCw,
	AlertTriangle,
	Search,
	Heart,
	MoreVertical,
	Award,
	Timer,
	Star,
	Bookmark,
	ArrowUpRight,
	ArrowDownRight,
	Library,
	TrendingUp,
	Zap,
	Flame,
	CheckCircle2,
	User,
	Mail,
	MapPin,
	Phone,
	Edit,
	Settings,
	LogOut,
	Trophy,
	Target,
	BarChart3,
	Activity,
	X,
	CheckCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Toaster, toast } from "sonner";
import { useQuery, useMutation } from "convex/react";
import { api } from "convex/_generated/api";
import { useAuth } from "@/lib/auth-context";

interface Book {
	id: string;
	title: string;
	subtitle: string;
	author: string;
	coverImage: string;
	borrowedDate: string;
	dueDate: string;
	status: "active" | "overdue" | "returned";
	daysRemaining: number;
	renewalsLeft: number;
	isOverdue: boolean;
	fineAmount: number;
	rating: number;
	pages: number;
	category: string;
	progress: number;
	isFavorite: boolean;
	tags: string[];
}



const ProfileWrapper: FC = () => {
	const { user } = useAuth();
	const borrowings = useQuery(
		api.orders.getUserBorrowings,
		user ? { userId: user._id } : "skip",
	);
	const reservations = useQuery(
		api.orders.getUserReservations,
		user ? { userId: user._id, includeBookDetails: true } : "skip",
	);

	const returnBookMutation = useMutation(api.orders.returnBook);
	const renewBookMutation = useMutation(api.orders.renewBook);

	const [activeTab, setActiveTab] = useState("overview");
	const [searchQuery, setSearchQuery] = useState("");
	const [bookToReturn, setBookToReturn] = useState<Book | null>(null);

	const books: Book[] = (borrowings || []).map((b: any) => ({
		id: b._id,
		title: b.book?.title || "Neznáma kniha",
		subtitle: "",
		author: b.author?.name || "Neznámy autor",
		coverImage: b.book?.coverImageUrl || "/api/placeholder/400/600",
		borrowedDate: new Date(b.borrowedAt).toISOString().split("T")[0],
		dueDate: new Date(b.dueDate).toISOString().split("T")[0],
		status: b.status,
		daysRemaining: Math.ceil((b.dueDate - Date.now()) / (1000 * 60 * 60 * 24)),
		renewalsLeft: 3 - (b.renewedCount || 0),
		isOverdue:
			b.status === "overdue" || (b.status === "active" && b.dueDate < Date.now()),
		fineAmount: b.fineAmount || 0,
		rating: 0,
		pages: 0,
		category: "",
		progress: 0,
		isFavorite: false,
		tags: [],
	}));

	const userProfileData = {
		name: user?.fullName || `${user?.firstName} ${user?.lastName}`,
		email: user?.email,
		memberSince: user?.createdAt
			? new Date(user.createdAt).toISOString().split("T")[0]
			: "2024-01-01",
		location: "Slovensko",
		phone: user?.phone || "",
		avatar: user?.imageUrl || "/api/placeholder/150/150",
		totalBooksRead: user?.totalBorrowed || 0,
		currentStreak: 0,
		favoriteGenre: "Programovanie",
		level: user?.membershipType || "Člen",
	};

	if (borrowings === undefined || user === null) {
		return (
			<div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 text-slate-200">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mb-4"></div>
				<p className="text-slate-400 animate-pulse">Načítavam váš profil...</p>
			</div>
		);
	}

	const [showReturnDialog, setShowReturnDialog] = useState(false);
	const [returnStatus, setReturnStatus] = useState<
		"idle" | "processing" | "success" | "error"
	>("idle");
	const [returnMessage, setReturnMessage] = useState("");

	const filteredBooks = books.filter(
		(book) =>
			book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
			book.author.toLowerCase().includes(searchQuery.toLowerCase()),
	);

	const activeBooksCount = books.filter((b) => b.status === "active").length;
	const overdueBooksCount = books.filter((b) => b.status === "overdue").length;

	// Funkcia pre vrátenie knihy
	const handleReturnBook = async () => {
		if (!bookToReturn) return;

		setReturnStatus("processing");

		try {
			await returnBookMutation({ borrowingId: bookToReturn.id as any });

			setReturnMessage("Kniha bola úspešne vrátená!");
			setReturnStatus("success");

			toast.success("Kniha úspešne vrátená", {
				description: "Kniha bola označená ako vrátená.",
				duration: 3000,
				icon: <CheckCircle className="w-5 h-5 text-emerald-500" />,
			});

			setTimeout(() => {
				setShowReturnDialog(false);
				setReturnStatus("idle");
				setBookToReturn(null);
			}, 2000);
		} catch (error) {
			setReturnStatus("error");
			setReturnMessage("Nastala chyba pri vrátení knihy. Skúste to znova.");
			toast.error("Chyba pri vrátení knihy", {
				description: "Skúste to prosím znova neskôr.",
				duration: 3000,
				icon: <X className="w-5 h-5 text-red-500" />,
			});
		}
	};

	// Funkcia pre obnovenie výpožičky
	const handleRenewBook = async (bookId: string) => {
		try {
			await renewBookMutation({ borrowingId: bookId as any });
			toast.success("Kniha obnovená", {
				description: `Výpožička bola úspešne predĺžená.`,
				duration: 3000,
				icon: <RefreshCw className="w-5 h-5 text-blue-500" />,
			});
		} catch (error: any) {
			toast.error("Chyba pri obnovení", {
				description: error.message || "Nepodarilo sa obnoviť výpožičku.",
				duration: 3000,
			});
		}
	};

	// Funkcia pre označenie/odznačenie ako obľúbené
	const handleToggleFavorite = (bookId: string) => {
		const book = books.find((b) => b.id === bookId);

		if (book) {
			toast.info("Funkcia obľúbených bude čoskoro dostupná", {
				description: `"${book.title}" zatiaľ nie je možné pridať do obľúbených.`,
				duration: 2000,
			});
		}
	};

	// Reset všetkých kníh (odstránené, teraz používame reálne dáta)

	return (
		<div className="min-h-screen">
			<Toaster
				position="top-right"
				expand={false}
				richColors
				closeButton
				theme="dark"
				className="font-sans"
				toastOptions={{
					classNames: {
						toast:
							"group toast group-[.toaster]:bg-slate-900 group-[.toaster]:text-slate-200 group-[.toaster]:border-slate-800",
						description: "group-[.toast]:text-slate-400",
						actionButton:
							"group-[.toast]:bg-indigo-600 group-[.toast]:text-white",
						cancelButton:
							"group-[.toast]:bg-slate-800 group-[.toast]:text-slate-300",
					},
				}}
			/>

			{/* Return Book Dialog */}
			<AlertDialog open={showReturnDialog} onOpenChange={setShowReturnDialog}>
				<AlertDialogContent className="bg-slate-900 border-slate-800 text-slate-200">
					<AlertDialogHeader>
						<AlertDialogTitle className="text-xl">
							{returnStatus === "processing"
								? "Vraciam knihu..."
								: returnStatus === "success"
									? "Kniha vrátená!"
									: "Vrátiť knihu?"}
						</AlertDialogTitle>

						{returnStatus === "idle" && bookToReturn && (
							<AlertDialogDescription className="space-y-4">
								<div className="flex items-start gap-4 p-4 bg-slate-800/50 rounded-lg border border-slate-700">
									<div className="w-16 h-24 rounded overflow-hidden bg-slate-700 flex-shrink-0">
										<img
											src={bookToReturn.coverImage}
											alt={bookToReturn.title}
											className="w-full h-full object-cover"
										/>
									</div>
									<div>
										<h4 className="font-bold text-lg text-slate-100 mb-1">
											{bookToReturn.title}
										</h4>
										<p className="text-sm text-slate-400 mb-2">
											{bookToReturn.author}
										</p>
										<div className="flex flex-wrap gap-2 mt-2">
											<Badge className="bg-slate-800 text-slate-300 border-slate-700">
												Splatnosť:{" "}
												{new Date(bookToReturn.dueDate).toLocaleDateString(
													"sk",
												)}
											</Badge>
											{bookToReturn.isOverdue && (
												<Badge className="bg-red-500/20 text-red-400 border-red-500/30">
													Pokuta: €{bookToReturn.fineAmount.toFixed(2)}
												</Badge>
											)}
										</div>
									</div>
								</div>

								{bookToReturn.isOverdue && (
									<div className="p-3 bg-red-900/20 rounded-lg border border-red-800/50">
										<div className="flex items-center gap-2 text-red-400 mb-1">
											<AlertTriangle className="w-4 h-4" />
											<span className="font-semibold">
												Pozor: Omeškaná kniha
											</span>
										</div>
										<p className="text-sm text-red-300">
											Táto kniha je omeškaná. Po vrátení bude k vášmu kontu
											pridaná pokuta €{bookToReturn.fineAmount.toFixed(2)}.
										</p>
									</div>
								)}

								<p className="text-slate-300">
									Ste si istý, že chcete vrátiť túto knihu? Táto akcia sa nedá
									vrátiť späť.
								</p>
							</AlertDialogDescription>
						)}

						{returnStatus === "processing" && (
							<div className="py-8 text-center">
								<div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mb-4"></div>
								<p className="text-slate-400">Prebieha vracanie knihy...</p>
							</div>
						)}

						{returnStatus === "success" && (
							<div className="py-8 text-center">
								<div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-500/20 mb-4">
									<CheckCircle className="w-8 h-8 text-emerald-500" />
								</div>
								<p className="text-slate-300 mb-2">{returnMessage}</p>
								<Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
									Kniha vrátená
								</Badge>
							</div>
						)}

						{returnStatus === "error" && (
							<div className="py-8 text-center">
								<div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-500/20 mb-4">
									<X className="w-8 h-8 text-red-500" />
								</div>
								<p className="text-red-400 mb-2">{returnMessage}</p>
								<p className="text-sm text-slate-400">
									Skúste to prosím znova neskôr.
								</p>
							</div>
						)}
					</AlertDialogHeader>

					<AlertDialogFooter className="gap-2">
						{returnStatus === "idle" && (
							<>
								<AlertDialogCancel className="bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700 hover:text-white">
									Zrušiť
								</AlertDialogCancel>
								<AlertDialogAction
									onClick={handleReturnBook}
									className="bg-indigo-600 hover:bg-indigo-700 text-white"
								>
									<CheckCircle className="w-4 h-4 mr-2" />
									Potvrdiť vrátenie
								</AlertDialogAction>
							</>
						)}

						{(returnStatus === "success" || returnStatus === "error") && (
							<AlertDialogAction
								onClick={() => {
									setShowReturnDialog(false);
									setReturnStatus("idle");
									setBookToReturn(null);
								}}
								className="bg-slate-800 border-slate-700 hover:bg-slate-700"
							>
								Zavrieť
							</AlertDialogAction>
						)}
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>

			<div className="max-w-7xl mx-auto p-4 md:p-8 space-y-6">
				{/* Profile Header */}
				<Card>
					<CardContent className="p-8">
						<div className="flex flex-col md:flex-row items-start md:items-center gap-6">
							<Avatar className="w-24 h-24 border-2 border-slate-700">
								<AvatarImage src={userProfileData.avatar} alt={userProfileData.name} />
								<AvatarFallback className="text-3xl bg-slate-800 text-slate-300">
									{userProfileData.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)}
								</AvatarFallback>
							</Avatar>

							<div className="flex-1 space-y-3">
								<div>
									<h1 className="text-3xl md:text-4xl font-bold text-slate-100 mb-2">
										{userProfileData.name}
									</h1>
									<div className="flex flex-wrap items-center gap-4 text-slate-400">
										<span className="flex items-center gap-2 text-sm">
											<Mail className="w-4 h-4" />
											{userProfileData.email}
										</span>
										<span className="text-slate-700">•</span>
										<span className="flex items-center gap-2 text-sm">
											<MapPin className="w-4 h-4" />
											{userProfileData.location}
										</span>
									</div>
								</div>

								<div className="flex flex-wrap gap-2">
									<Badge className="bg-indigo-900/50 text-indigo-300 border-indigo-800 px-3 py-1">
										<Trophy className="w-3 h-3 mr-1" />
										{userProfileData.level}
									</Badge>
									<Badge className="bg-slate-800 text-slate-300 border-slate-700 px-3 py-1">
										Členstvo od{" "}
										{new Date(userProfileData.memberSince).getFullYear()}
									</Badge>
								</div>
							</div>

							<div className="flex gap-2">
								<Button
									variant="outline"
									size="icon"
									className="bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-300 rounded-xl"
								>
									<Settings className="w-5 h-5" />
								</Button>
								<Button
									variant="outline"
									size="icon"
									className="bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-300 rounded-xl"
								>
									<Edit className="w-5 h-5" />
								</Button>
							</div>
						</div>

						{/* Quick Stats */}
						<div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-8 border-t border-slate-800">
							<div className="text-center p-4 bg-slate-800/50 rounded-xl border border-slate-800">
								<div className="text-3xl font-bold text-slate-100 mb-1">
									{userProfileData.totalBooksRead}
								</div>
								<div className="text-sm text-slate-400">Celkom prečítaných</div>
							</div>
							<div className="text-center p-4 bg-slate-800/50 rounded-xl border border-slate-800">
								<div className="text-3xl font-bold text-slate-100 mb-1">
									{activeBooksCount}
								</div>
								<div className="text-sm text-slate-400">Aktívne výpožičky</div>
							</div>
							<div className="text-center p-4 bg-slate-800/50 rounded-xl border border-slate-800">
								<div className="text-3xl font-bold text-slate-100 mb-1">
									{userProfileData.currentStreak}
								</div>
								<div className="text-sm text-slate-400">Dní série</div>
							</div>
							<div className="text-center p-4 bg-slate-800/50 rounded-xl border border-slate-800">
								<div className="text-3xl font-bold text-slate-100 mb-1">
									€
									{books
										.reduce(
											(sum, book) =>
												sum + (book.isOverdue ? book.fineAmount : 0),
											0,
										)
										.toFixed(2)}
								</div>
								<div className="text-sm text-slate-400">Celková pokuta</div>
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Main Content Tabs */}
				<Tabs
					value={activeTab}
					onValueChange={setActiveTab}
					className="space-y-6"
				>
					<TabsList className="bg-slate-900 p-1.5 rounded-2xl border border-slate-800">
						<TabsTrigger
							value="overview"
							className="rounded-xl data-[state=active]:bg-indigo-600 data-[state=active]:text-white text-slate-400 px-6 py-2.5"
						>
							<Activity className="w-4 h-4 mr-2" />
							Prehľad
						</TabsTrigger>
						<TabsTrigger
							value="books"
							className="rounded-xl data-[state=active]:bg-indigo-600 data-[state=active]:text-white text-slate-400 px-6 py-2.5"
						>
							<BookOpen className="w-4 h-4 mr-2" />
							Moje knihy ({books.filter((b) => b.status !== "returned").length})
						</TabsTrigger>
						<TabsTrigger
							value="stats"
							className="rounded-xl data-[state=active]:bg-indigo-600 data-[state=active]:text-white text-slate-400 px-6 py-2.5"
						>
							<BarChart3 className="w-4 h-4 mr-2" />
							Štatistiky
						</TabsTrigger>
					</TabsList>

					{/* Overview Tab */}
					<TabsContent value="overview" className="space-y-6">
						<div className="grid md:grid-cols-3 gap-6">
							{/* Active Borrows */}
							<Card className="bg-slate-900 border-slate-800">
								<CardHeader>
									<CardTitle className="text-lg text-slate-200 flex items-center gap-2">
										<div className="p-2 bg-blue-500/20 rounded-lg">
											<BookOpen className="w-5 h-5 text-blue-400" />
										</div>
										Aktívne výpožičky
									</CardTitle>
								</CardHeader>
								<CardContent>
									<div className="text-4xl font-bold text-slate-100 mb-2">
										{activeBooksCount}
									</div>
									<div className="flex items-center gap-2 text-sm text-emerald-400">
										<ArrowUpRight className="w-4 h-4" />
										<span>+2 tento týždeň</span>
									</div>
								</CardContent>
							</Card>

							{/* Overdue */}
							<Card className="bg-slate-900 border-slate-800">
								<CardHeader>
									<CardTitle className="text-lg text-slate-200 flex items-center gap-2">
										<div className="p-2 bg-red-500/20 rounded-lg">
											<AlertTriangle className="w-5 h-5 text-red-400" />
										</div>
										Omeškané
									</CardTitle>
								</CardHeader>
								<CardContent>
									<div className="text-4xl font-bold text-slate-100 mb-2">
										{overdueBooksCount}
									</div>
									<div className="flex items-center gap-2 text-sm text-red-400">
										<span>
											Pokuta: €
											{books
												.filter((b) => b.isOverdue)
												.reduce((sum, book) => sum + book.fineAmount, 0)
												.toFixed(2)}
										</span>
									</div>
								</CardContent>
							</Card>

							{/* Reading Streak */}
							<Card className="bg-slate-900 border-slate-800">
								<CardHeader>
									<CardTitle className="text-lg text-slate-200 flex items-center gap-2">
										<div className="p-2 bg-orange-500/20 rounded-lg">
											<Flame className="w-5 h-5 text-orange-400" />
										</div>
										Séria čítania
									</CardTitle>
								</CardHeader>
								<CardContent>
									<div className="text-4xl font-bold text-slate-100 mb-2">
										{userProfileData.currentStreak}
									</div>
									<div className="flex items-center gap-2 text-sm text-orange-400">
										<span>dní po sebe</span>
									</div>
								</CardContent>
							</Card>
						</div>

						{/* Recent Activity */}
						<Card className="bg-slate-900 border-slate-800">
							<CardHeader>
								<CardTitle className="text-xl text-slate-200">
									Aktuálne čítanie
								</CardTitle>
							</CardHeader>
							<CardContent className="space-y-4">
								{books
									.filter((b) => b.status === "active")
									.slice(0, 3)
									.map((book) => (
										<div
											key={book.id}
											className="flex items-center gap-4 p-4 bg-slate-800/50 rounded-xl border border-slate-800 hover:border-indigo-600 transition-all group"
										>
											<div className="h-20 w-14 rounded-lg overflow-hidden bg-slate-700 flex-shrink-0">
												<img
													src={book.coverImage}
													alt={book.title}
													className="w-full h-full object-cover"
												/>
											</div>
											<div className="flex-1 min-w-0">
												<h4 className="font-semibold text-slate-200 truncate mb-1">
													{book.title}
												</h4>
												<p className="text-sm text-slate-400 truncate mb-2">
													{book.author}
												</p>
												<Progress
													value={book.progress}
													className="h-2 bg-slate-700"
												/>
											</div>
											<div className="text-right flex-shrink-0">
												<div className="text-2xl font-bold text-indigo-400">
													{book.progress}%
												</div>
												<div className="text-xs text-slate-500">
													{book.daysRemaining} dní
												</div>
											</div>
										</div>
									))}
							</CardContent>
						</Card>
					</TabsContent>

					{/* Books Tab */}
					<TabsContent value="books" className="space-y-6">
						{/* Search Bar */}
						<div className="relative">
							<Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
							<Input
								placeholder="Vyhľadať knihy..."
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								className="pl-12 h-14 bg-slate-900 border-slate-800 text-slate-200 rounded-2xl focus:border-indigo-600"
							/>
						</div>

						{/* Filter Buttons */}
						<div className="flex flex-wrap gap-2">
							<Button
								variant="outline"
								size="sm"
								className={`rounded-xl ${activeTab === "books" ? "border-indigo-600 text-indigo-400" : "border-slate-700 text-slate-400"}`}
								onClick={() => setActiveTab("books")}
							>
								Všetky ({books.length})
							</Button>
							<Button
								variant="outline"
								size="sm"
								className="rounded-xl border-slate-700 text-slate-400"
							>
								Aktívne ({activeBooksCount})
							</Button>
							<Button
								variant="outline"
								size="sm"
								className="rounded-xl border-slate-700 text-slate-400"
							>
								Omeškané ({overdueBooksCount})
							</Button>
							<Button
								variant="outline"
								size="sm"
								className="rounded-xl border-slate-700 text-slate-400"
							>
								Obľúbené ({books.filter((b) => b.isFavorite).length})
							</Button>
						</div>

						{/* Books Grid */}
						<div className="grid gap-6">
							{filteredBooks
								.filter((book) => book.status !== "returned")
								.map((book) => (
									<Card
										key={book.id}
										className="bg-slate-900 border-slate-800 overflow-hidden hover:border-indigo-600 transition-all group"
									>
										<CardContent className="p-0">
											<div className="flex flex-col md:flex-row">
												{/* Book Cover */}
												<div className="md:w-48 relative overflow-hidden bg-slate-800">
													<div className="aspect-[3/4] md:aspect-auto md:h-full relative">
														<img
															src={book.coverImage}
															alt={book.title}
															className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
														/>
														<div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>

														{book.isOverdue && (
															<div className="absolute top-3 left-3">
																<Badge className="bg-red-500 text-white border-0">
																	<AlertTriangle className="w-3 h-3 mr-1" />
																	Omeškané
																</Badge>
															</div>
														)}

														{book.isFavorite && (
															<div className="absolute top-3 right-3">
																<div
																	className="bg-slate-900/80 backdrop-blur-sm p-2 rounded-full border border-slate-800 cursor-pointer hover:bg-red-500/20"
																	onClick={() => handleToggleFavorite(book.id)}
																>
																	<Heart className="w-4 h-4 fill-red-500 text-red-500" />
																</div>
															</div>
														)}

														<div className="absolute bottom-3 left-3">
															<Badge className="bg-slate-900/80 backdrop-blur-sm text-white border-slate-800">
																<Star className="w-3 h-3 fill-yellow-500 text-yellow-500 mr-1" />
																{book.rating}
															</Badge>
														</div>
													</div>
												</div>

												{/* Book Details */}
												<div className="flex-1 p-6">
													<div className="space-y-5">
														<div>
															<h3 className="text-2xl font-bold text-slate-100 mb-1">
																{book.title}
															</h3>
															{book.subtitle && (
																<p className="text-sm text-slate-400 mb-2">
																	{book.subtitle}
																</p>
															)}
															<p className="text-slate-400">{book.author}</p>
														</div>

														<div className="flex flex-wrap gap-2">
															{book.tags.map((tag, i) => (
																<Badge
																	key={i}
																	className="bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700"
																>
																	#{tag}
																</Badge>
															))}
															<Badge className="bg-indigo-900/50 text-indigo-300 border-indigo-800">
																{book.category}
															</Badge>
															{book.status === "returned" && (
																<Badge className="bg-emerald-900/50 text-emerald-300 border-emerald-800">
																	<CheckCircle className="w-3 h-3 mr-1" />
																	Vrátené
																</Badge>
															)}
														</div>

														<div className="grid md:grid-cols-2 gap-4">
															<div className="space-y-3">
																<div className="flex items-center justify-between text-sm">
																	<span className="text-slate-400">
																		Požičané:
																	</span>
																	<span className="text-slate-200 font-medium">
																		{new Date(
																			book.borrowedDate,
																		).toLocaleDateString("sk")}
																	</span>
																</div>
																<div className="flex items-center justify-between text-sm">
																	<span className="text-slate-400">
																		Splatnosť:
																	</span>
																	<span
																		className={`font-medium ${book.isOverdue ? "text-red-400" : "text-slate-200"}`}
																	>
																		{new Date(book.dueDate).toLocaleDateString(
																			"sk",
																		)}
																	</span>
																</div>
																{book.fineAmount > 0 && (
																	<div className="flex items-center justify-between text-sm p-3 bg-red-900/20 rounded-lg border border-red-800/50">
																		<span className="text-red-400">
																			Pokuta:
																		</span>
																		<span className="font-bold text-red-400">
																			€{book.fineAmount.toFixed(2)}
																		</span>
																	</div>
																)}
															</div>

															<div className="space-y-3">
																<div>
																	<div className="flex justify-between text-sm mb-2">
																		<span className="text-slate-400">
																			Pokrok
																		</span>
																		<span className="text-slate-200 font-medium">
																			{book.progress}%
																		</span>
																	</div>
																	<Progress
																		value={book.progress}
																		className="h-2 bg-slate-800"
																	/>
																</div>
																<div>
																	<div className="flex justify-between text-sm mb-2">
																		<span className="text-slate-400">
																			Obnovenia
																		</span>
																		<span className="text-slate-200 font-medium">
																			{book.renewalsLeft} / 3
																		</span>
																	</div>
																	<Progress
																		value={(book.renewalsLeft / 3) * 100}
																		className="h-2 bg-slate-800"
																	/>
																</div>
															</div>
														</div>

														<div className="flex flex-wrap gap-3 pt-4 border-t border-slate-800">
															<Button
																onClick={() => handleRenewBook(book.id)}
																disabled={
																	book.renewalsLeft === 0 || book.isOverdue
																}
																className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
																title={
																	book.isOverdue
																		? "Omeškané knihy nemožno obnoviť"
																		: `Zostáva ${book.renewalsLeft} obnovení`
																}
															>
																<RefreshCw className="w-4 h-4 mr-2" />
																Obnoviť ({book.renewalsLeft})
															</Button>

															<Button
																onClick={() => {
																	setBookToReturn(book);
																	setShowReturnDialog(true);
																}}
																variant="outline"
																className="rounded-xl border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white"
															>
																<CheckCircle className="w-4 h-4 mr-2" />
																Vrátiť knihu
															</Button>

															<Button
																variant="ghost"
																className="rounded-xl text-slate-400 hover:text-white hover:bg-slate-800"
																onClick={() => handleToggleFavorite(book.id)}
															>
																{book.isFavorite ? (
																	<>
																		<Heart className="w-4 h-4 mr-2 fill-red-500 text-red-500" />
																		Odobrať
																	</>
																) : (
																	<>
																		<Heart className="w-4 h-4 mr-2" />
																		Pridať
																	</>
																)}
															</Button>
														</div>
													</div>
												</div>
											</div>
										</CardContent>
									</Card>
								))}
						</div>

						{/* Returned Books Section */}
						{filteredBooks.filter((book) => book.status === "returned").length >
							0 && (
								<div className="mt-12">
									<h3 className="text-xl font-bold text-slate-200 mb-4 flex items-center gap-2">
										<CheckCircle className="w-5 h-5 text-emerald-500" />
										Vrátené knihy
									</h3>
									<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
										{filteredBooks
											.filter((book) => book.status === "returned")
											.map((book) => (
												<Card
													key={book.id}
													className="bg-slate-900/50 border-slate-800"
												>
													<CardContent className="p-4">
														<div className="flex items-start gap-3">
															<div className="w-16 h-24 rounded overflow-hidden bg-slate-800 flex-shrink-0">
																<img
																	src={book.coverImage}
																	alt={book.title}
																	className="w-full h-full object-cover"
																/>
															</div>
															<div>
																<h4 className="font-semibold text-slate-200 mb-1">
																	{book.title}
																</h4>
																<p className="text-sm text-slate-400 mb-2">
																	{book.author}
																</p>
																<Badge className="bg-emerald-900/30 text-emerald-400 border-emerald-800">
																	Vrátené {new Date().toLocaleDateString("sk")}
																</Badge>
															</div>
														</div>
													</CardContent>
												</Card>
											))}
									</div>
								</div>
							)}
					</TabsContent>

					{/* Stats Tab */}
					<TabsContent value="stats" className="space-y-6">
						<div className="grid md:grid-cols-2 gap-6">
							<Card className="bg-slate-900 border-slate-800">
								<CardHeader>
									<CardTitle className="text-xl text-slate-200 flex items-center gap-2">
										<Award className="w-5 h-5 text-amber-400" />
										Štatistiky čítania
									</CardTitle>
								</CardHeader>
								<CardContent className="space-y-4">
									<div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl border border-slate-800">
										<span className="text-slate-300">Celkom prečítaných</span>
										<span className="text-2xl font-bold text-slate-100">
											{userProfileData.totalBooksRead}
										</span>
									</div>
									<div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl border border-slate-800">
										<span className="text-slate-300">Aktívne výpožičky</span>
										<span className="text-xl font-semibold text-blue-400">
											{activeBooksCount}
										</span>
									</div>
									<div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl border border-slate-800">
										<span className="text-slate-300">Priemerný čas</span>
										<span className="text-2xl font-bold text-slate-100">
											14 dní
										</span>
									</div>
								</CardContent>
							</Card>

							<Card className="bg-slate-900 border-slate-800">
								<CardHeader>
									<CardTitle className="text-xl text-slate-200 flex items-center gap-2">
										<Target className="w-5 h-5 text-emerald-400" />
										Ciele a úspechy
									</CardTitle>
								</CardHeader>
								<CardContent className="space-y-4">
									<div className="space-y-2">
										<div className="flex justify-between text-sm">
											<span className="text-slate-300">Ročný cieľ</span>
											<span className="text-slate-400">42 / 50 kníh</span>
										</div>
										<Progress value={84} className="h-3 bg-slate-800" />
									</div>
									<div className="grid grid-cols-2 gap-3 pt-2">
										<div className="text-center p-4 bg-slate-800/50 rounded-xl border border-slate-800">
											<Trophy className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
											<div className="text-lg font-bold text-slate-100">12</div>
											<div className="text-xs text-slate-400">Odznaky</div>
										</div>
										<div className="text-center p-4 bg-slate-800/50 rounded-xl border border-slate-800">
											<Flame className="w-6 h-6 text-orange-400 mx-auto mb-2" />
											<div className="text-lg font-bold text-slate-100">
												{userProfileData.currentStreak}
											</div>
											<div className="text-xs text-slate-400">Dní série</div>
										</div>
									</div>
								</CardContent>
							</Card>
						</div>

						{/* Recent Returns */}
						<Card className="bg-slate-900 border-slate-800">
							<CardHeader>
								<CardTitle className="text-xl text-slate-200 flex items-center gap-2">
									<CheckCircle className="w-5 h-5 text-emerald-400" />
									Nedávno vrátené knihy
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="space-y-3">
									{books
										.filter((book) => book.status === "returned")
										.slice(0, 3)
										.map((book) => (
											<div
												key={book.id}
												className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg border border-slate-800"
											>
												<div className="flex items-center gap-3">
													<div className="w-10 h-14 rounded overflow-hidden bg-slate-700">
														<img
															src={book.coverImage}
															alt={book.title}
															className="w-full h-full object-cover"
														/>
													</div>
													<div>
														<h4 className="font-medium text-slate-200">
															{book.title}
														</h4>
														<p className="text-sm text-slate-400">
															{book.author}
														</p>
													</div>
												</div>
												<Badge className="bg-emerald-900/30 text-emerald-400 border-emerald-800">
													Vrátené
												</Badge>
											</div>
										))}

									{books.filter((book) => book.status === "returned").length ===
										0 && (
											<div className="text-center py-8 text-slate-500">
												<CheckCircle className="w-12 h-12 mx-auto mb-3 text-slate-700" />
												<p>Zatiaľ žiadne vrátené knihy</p>
											</div>
										)}
								</div>
							</CardContent>
						</Card>
					</TabsContent>
				</Tabs>
			</div>
		</div>
	);
};

export default ProfileWrapper;

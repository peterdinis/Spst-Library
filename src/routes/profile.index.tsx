import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import {
	BookOpen,
	Calendar,
	Clock,
	Download,
	Eye,
	RefreshCw,
	AlertTriangle,
	CheckCircle,
	Search,
	Filter,
	ChevronDown,
	Star,
	Heart,
	MoreVertical,
	TrendingUp,
	Users,
	Award,
	BookCheck,
	BookX,
	CalendarClock,
	Shield,
	Bookmark,
	Zap,
	Bell,
	ArrowUpRight,
	ArrowDownRight,
	Library,
	Flame,
	Timer,
} from "lucide-react";
import { format } from "date-fns";
import { sk } from "date-fns/locale";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

// Enhanced mock data
const mockBorrowedBooks = [
	{
		id: "1",
		bookId: "book_1",
		title: "Clean Code",
		subtitle: "A Handbook of Agile Software Craftsmanship",
		author: "Robert C. Martin",
		coverImage: "/api/placeholder/400/600",
		borrowedDate: "2024-01-10",
		dueDate: "2024-01-24",
		returnDate: null,
		status: "active",
		daysRemaining: 4,
		renewalsLeft: 2,
		isOverdue: false,
		fineAmount: 0,
		rating: 4.8,
		pages: 464,
		category: "Programming",
		progress: 75,
		isFavorite: true,
		tags: ["clean-code", "best-practices"],
		popularity: "high",
	},
	{
		id: "2",
		bookId: "book_2",
		title: "The Pragmatic Programmer",
		subtitle: "Your Journey to Mastery",
		author: "David Thomas, Andrew Hunt",
		coverImage: "/api/placeholder/400/600",
		borrowedDate: "2024-01-05",
		dueDate: "2024-01-19",
		returnDate: null,
		status: "overdue",
		daysRemaining: -2,
		renewalsLeft: 0,
		isOverdue: true,
		fineAmount: 1.5,
		rating: 4.7,
		pages: 352,
		category: "Programming",
		progress: 90,
		isFavorite: true,
		tags: ["pragmatic", "career"],
		popularity: "high",
	},
	{
		id: "3",
		bookId: "book_3",
		title: "Design Patterns",
		subtitle: "Elements of Reusable Object-Oriented Software",
		author: "Erich Gamma et al.",
		coverImage: "/api/placeholder/400/600",
		borrowedDate: "2024-01-12",
		dueDate: "2024-01-26",
		returnDate: null,
		status: "active",
		daysRemaining: 10,
		renewalsLeft: 3,
		isOverdue: false,
		fineAmount: 0,
		rating: 4.6,
		pages: 395,
		category: "Software Engineering",
		progress: 30,
		isFavorite: false,
		tags: ["patterns", "gang-of-four"],
		popularity: "medium",
	},
	{
		id: "4",
		bookId: "book_4",
		title: "JavaScript: The Good Parts",
		subtitle: "",
		author: "Douglas Crockford",
		coverImage: "/api/placeholder/400/600",
		borrowedDate: "2023-12-20",
		dueDate: "2024-01-03",
		returnDate: "2024-01-02",
		status: "returned",
		daysRemaining: 0,
		renewalsLeft: 0,
		isOverdue: false,
		fineAmount: 0,
		rating: 4.5,
		pages: 176,
		category: "JavaScript",
		progress: 100,
		isFavorite: true,
		tags: ["javascript", "essentials"],
		popularity: "high",
	},
	{
		id: "5",
		bookId: "book_5",
		title: "You Don't Know JS",
		subtitle: "Scope & Closures",
		author: "Kyle Simpson",
		coverImage: "/api/placeholder/400/600",
		borrowedDate: "2024-01-15",
		dueDate: "2024-01-29",
		returnDate: null,
		status: "active",
		daysRemaining: 12,
		renewalsLeft: 3,
		isOverdue: false,
		fineAmount: 0,
		rating: 4.9,
		pages: 98,
		category: "JavaScript",
		progress: 20,
		isFavorite: false,
		tags: ["deep-dive", "advanced"],
		popularity: "medium",
	},
];

// Query function
async function fetchBorrowedBooks(userId: string) {
	await new Promise((resolve) => setTimeout(resolve, 500));
	return mockBorrowedBooks;
}

export const Route = createFileRoute("/profile/")({
	component: BorrowedBooksPage,
});

// Custom icon components
const DollarSign = ({ className }: { className?: string }) => (
	<svg
		className={className}
		fill="none"
		stroke="currentColor"
		viewBox="0 0 24 24"
	>
		<path
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth={2}
			d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
		/>
	</svg>
);

// Minimal Stats Component
const StatsOverview = () => {
	const stats = [
		{
			title: "Aktívne výpožičky",
			value: "4",
			change: "+2",
			icon: BookOpen,
			color: "text-blue-600",
			bgColor: "bg-blue-50",
			trend: "up",
		},
		{
			title: "Omeškané",
			value: "1",
			change: "-1",
			icon: AlertTriangle,
			color: "text-red-600",
			bgColor: "bg-red-50",
			trend: "down",
		},
		{
			title: "Celková pokuta",
			value: "€1.50",
			change: "€0.50",
			icon: DollarSign,
			color: "text-amber-600",
			bgColor: "bg-amber-50",
			trend: "up",
		},
		{
			title: "Priemerný čas",
			value: "14 dní",
			change: "-2 dni",
			icon: Clock,
			color: "text-emerald-600",
			bgColor: "bg-emerald-50",
			trend: "down",
		},
	];

	return (
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
			{stats.map((stat, index) => (
				<Card
					key={index}
					className="border-0 shadow-sm hover:shadow transition-all"
				>
					<CardContent className="p-6">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm font-medium text-muted-foreground mb-1">
									{stat.title}
								</p>
								<div className="flex items-baseline gap-2">
									<p className="text-2xl font-semibold">{stat.value}</p>
									<span
										className={cn(
											"text-xs font-medium px-2 py-1 rounded-full",
											stat.trend === "up"
												? "bg-green-100 text-green-700"
												: "bg-red-100 text-red-700",
										)}
									>
										{stat.trend === "up" ? (
											<ArrowUpRight className="inline h-3 w-3 mr-1" />
										) : (
											<ArrowDownRight className="inline h-3 w-3 mr-1" />
										)}
										{stat.change}
									</span>
								</div>
							</div>
							<div
								className={cn(
									"h-12 w-12 rounded-lg flex items-center justify-center",
									stat.bgColor,
								)}
							>
								<stat.icon className={cn("h-5 w-5", stat.color)} />
							</div>
						</div>
					</CardContent>
				</Card>
			))}
		</div>
	);
};

// Clean Book Card Component
interface BookCardProps {
	book: (typeof mockBorrowedBooks)[0];
	onAction: (action: string, bookId: string) => void;
}

const BookCard = ({ book, onAction }: BookCardProps) => {
	const getStatusColor = () => {
		if (book.isOverdue) return "text-red-600";
		if (book.status === "active") {
			if (book.daysRemaining <= 3) return "text-amber-600";
			return "text-emerald-600";
		}
		return "text-gray-600";
	};

	const getStatusIcon = () => {
		if (book.isOverdue) return <AlertTriangle className="h-4 w-4" />;
		if (book.daysRemaining <= 3) return <Timer className="h-4 w-4" />;
		return <Clock className="h-4 w-4" />;
	};

	const getStatusText = () => {
		if (book.isOverdue) return `Omeškané ${Math.abs(book.daysRemaining)} dní`;
		if (book.status === "active")
			return `${book.daysRemaining} dní do splatnosti`;
		return "Vrátené";
	};

	return (
		<Card className="border hover:border-gray-300 transition-all hover:shadow-lg">
			<CardContent className="p-6">
				<div className="flex flex-col lg:flex-row gap-6">
					{/* Book Cover */}
					<div className="lg:w-32">
						<div className="relative aspect-[2/3] w-full overflow-hidden rounded-lg bg-gradient-to-br from-gray-100 to-gray-200">
							<img
								src={book.coverImage}
								alt={book.title}
								className="object-cover w-full h-full"
							/>
							{book.isOverdue && (
								<div className="absolute top-2 right-2">
									<div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
								</div>
							)}
							{book.isFavorite && (
								<div className="absolute top-2 left-2">
									<Heart className="h-4 w-4 fill-red-500 text-red-500" />
								</div>
							)}
						</div>
					</div>

					{/* Book Details */}
					<div className="flex-1">
						<div className="space-y-4">
							{/* Header */}
							<div>
								<div className="flex items-start justify-between mb-2">
									<div>
										<h3 className="text-lg font-semibold tracking-tight">
											{book.title}
										</h3>
										{book.subtitle && (
											<p className="text-sm text-muted-foreground">
												{book.subtitle}
											</p>
										)}
										<p className="text-sm text-muted-foreground mt-1">
											{book.author}
										</p>
									</div>
									<div className="flex items-center gap-2">
										<Badge
											variant={book.isOverdue ? "destructive" : "secondary"}
											className={cn("gap-1", getStatusColor())}
										>
											{getStatusIcon()}
											{getStatusText()}
										</Badge>
									</div>
								</div>

								{/* Tags */}
								<div className="flex flex-wrap gap-2 mt-3">
									{book.tags.map((tag, index) => (
										<Badge
											key={index}
											variant="outline"
											className="text-xs px-2 py-1"
										>
											#{tag}
										</Badge>
									))}
									<Badge variant="outline" className="text-xs px-2 py-1 gap-1">
										<Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
										{book.rating}
									</Badge>
								</div>
							</div>

							{/* Dates & Progress */}
							<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
								<div className="space-y-3">
									<div className="flex items-center justify-between text-sm">
										<span className="text-muted-foreground">Požičané:</span>
										<span className="font-medium">
											{format(new Date(book.borrowedDate), "d. MMM yyyy", {
												locale: sk,
											})}
										</span>
									</div>
									<div className="flex items-center justify-between text-sm">
										<span className="text-muted-foreground">Splatnosť:</span>
										<span
											className={cn(
												"font-medium",
												book.isOverdue && "text-red-600 font-semibold",
											)}
										>
											{format(new Date(book.dueDate), "d. MMM yyyy", {
												locale: sk,
											})}
										</span>
									</div>
									{book.fineAmount > 0 && (
										<div className="flex items-center justify-between text-sm">
											<span className="text-muted-foreground">Pokuta:</span>
											<span className="font-semibold text-red-600">
												€{book.fineAmount.toFixed(2)}
											</span>
										</div>
									)}
								</div>

								<div className="space-y-3">
									<div className="space-y-1">
										<div className="flex items-center justify-between text-sm">
											<span className="text-muted-foreground">
												Pokrok čítania
											</span>
											<span className="font-medium">{book.progress}%</span>
										</div>
										<Progress value={book.progress} className="h-2" />
									</div>
									{book.status !== "returned" && (
										<div className="space-y-1">
											<div className="flex items-center justify-between text-sm">
												<span className="text-muted-foreground">Obnovenia</span>
												<span className="font-medium">
													{book.renewalsLeft} / 3
												</span>
											</div>
											<Progress
												value={(book.renewalsLeft / 3) * 100}
												className="h-2"
											/>
										</div>
									)}
								</div>
							</div>

							{/* Actions */}
							<div className="flex flex-wrap gap-2 pt-4 border-t">
								<Button
									size="sm"
									variant="default"
									className="gap-2"
									disabled={
										book.status === "returned" || book.renewalsLeft === 0
									}
									onClick={() => onAction("renew", book.id)}
								>
									<RefreshCw className="h-3 w-3" />
									Obnoviť
								</Button>
								<Button
									size="sm"
									variant="outline"
									className="gap-2"
									onClick={() => onAction("details", book.id)}
								>
									<Eye className="h-3 w-3" />
									Detaily
								</Button>
								{book.fineAmount > 0 && (
									<Button
										size="sm"
										variant="destructive"
										className="gap-2"
										onClick={() => onAction("payFine", book.id)}
									>
										<Shield className="h-3 w-3" />
										Zaplatiť pokutu
									</Button>
								)}
								<Button
									size="sm"
									variant="ghost"
									className="gap-2"
									onClick={() => onAction("toggleFavorite", book.id)}
								>
									<Bookmark className="h-3 w-3" />
									{book.isFavorite ? "Odobrať" : "Pridať"}
								</Button>
								<Button
									size="sm"
									variant="ghost"
									size="icon"
									onClick={() => onAction("more", book.id)}
								>
									<MoreVertical className="h-4 w-4" />
								</Button>
							</div>
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	);
};

// Reading Stats Component
const ReadingStats = () => {
	const stats = [
		{ label: "Celkom prečítaných", value: "42", change: "+5" },
		{ label: "Priemerný čas", value: "14 dní", change: "-2 dni" },
		{ label: "Obľúbený žáner", value: "Programovanie" },
		{ label: "Členstvo od", value: "2022" },
	];

	return (
		<Card>
			<CardHeader>
				<CardTitle className="text-lg font-semibold">
					Štatistiky čítania
				</CardTitle>
				<CardDescription>Vaše čitateľské návyky a preferencie</CardDescription>
			</CardHeader>
			<CardContent>
				<div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
					{stats.map((stat, index) => (
						<div key={index} className="text-center space-y-2">
							<div className="h-12 w-12 rounded-lg bg-gray-50 mx-auto flex items-center justify-center">
								{index === 0 && <BookCheck className="h-6 w-6 text-gray-700" />}
								{index === 1 && <Timer className="h-6 w-6 text-gray-700" />}
								{index === 2 && <Award className="h-6 w-6 text-gray-700" />}
								{index === 3 && <Users className="h-6 w-6 text-gray-700" />}
							</div>
							<div>
								<p className="text-2xl font-bold">{stat.value}</p>
								<p className="text-sm text-muted-foreground">{stat.label}</p>
								{stat.change && (
									<p
										className={cn(
											"text-xs mt-1",
											stat.change.startsWith("+")
												? "text-green-600"
												: "text-red-600",
										)}
									>
										{stat.change}
									</p>
								)}
							</div>
						</div>
					))}
				</div>
			</CardContent>
		</Card>
	);
};

// Empty State Component
const EmptyState = ({
	activeTab,
	searchQuery,
	onClearSearch,
}: {
	activeTab: string;
	searchQuery: string;
	onClearSearch: () => void;
}) => {
	const getMessage = () => {
		if (searchQuery) return "Nenašli sa žiadne knihy pre váš hľadaný výraz";
		if (activeTab === "overdue") return "Žiadne omeškané knihy! 🎉";
		if (activeTab === "favorites") return "Nemáte žiadne obľúbené knihy";
		return "Momentálne nemáte žiadne knihy v tejto kategórii";
	};

	return (
		<Card className="text-center">
			<CardContent className="py-12">
				<div className="h-16 w-16 rounded-full bg-gray-100 mx-auto flex items-center justify-center mb-4">
					<BookX className="h-8 w-8 text-gray-400" />
				</div>
				<h3 className="text-lg font-semibold mb-2">
					{activeTab === "overdue" && !searchQuery
						? "Žiadne omeškané knihy!"
						: "Žiadne knihy"}
				</h3>
				<p className="text-muted-foreground max-w-md mx-auto mb-6">
					{getMessage()}
				</p>
				{searchQuery ? (
					<Button onClick={onClearSearch}>
						<Search className="h-4 w-4 mr-2" />
						Vyčistiť hľadanie
					</Button>
				) : (
					<Button>
						<Library className="h-4 w-4 mr-2" />
						Prezrieť knižnicu
					</Button>
				)}
			</CardContent>
		</Card>
	);
};

// Main Component
function BorrowedBooksPage() {
	const [activeTab, setActiveTab] = useState("all");
	const [searchQuery, setSearchQuery] = useState("");
	const [sortBy, setSortBy] = useState("dueDate");

	const {
		data: books = mockBorrowedBooks,
		isLoading,
		error,
	} = useQuery({
		queryKey: ["borrowedBooks", "current"],
		queryFn: () => fetchBorrowedBooks("user_123"),
	});

	const filteredBooks = books
		.filter((book) => {
			if (activeTab === "active") return book.status === "active";
			if (activeTab === "overdue") return book.isOverdue;
			if (activeTab === "returned") return book.status === "returned";
			if (activeTab === "favorites") return book.isFavorite;
			return true;
		})
		.filter(
			(book) =>
				book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
				book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
				book.tags.some((tag) =>
					tag.toLowerCase().includes(searchQuery.toLowerCase()),
				),
		)
		.sort((a, b) => {
			if (sortBy === "dueDate") return a.daysRemaining - b.daysRemaining;
			if (sortBy === "title") return a.title.localeCompare(b.title);
			if (sortBy === "progress") return b.progress - a.progress;
			return 0;
		});

	const handleAction = (action: string, bookId: string) => {
		console.log(`${action} on book ${bookId}`);
	};

	const renewAll = () => {
		console.log("Renew all books");
	};

	if (isLoading) {
		return (
			<div className="space-y-6">
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
					{[...Array(4)].map((_, i) => (
						<Card key={i} className="border-0">
							<CardContent className="p-6">
								<div className="space-y-3">
									<Skeleton className="h-4 w-1/2" />
									<Skeleton className="h-8 w-3/4" />
									<Skeleton className="h-4 w-1/3" />
								</div>
							</CardContent>
						</Card>
					))}
				</div>
				{[...Array(3)].map((_, i) => (
					<Card key={i} className="animate-pulse">
						<CardContent className="p-6">
							<div className="flex gap-4">
								<Skeleton className="h-48 w-32 rounded-lg" />
								<div className="flex-1 space-y-3">
									<Skeleton className="h-6 w-3/4" />
									<Skeleton className="h-4 w-1/2" />
									<Skeleton className="h-4 w-1/3" />
									<div className="grid grid-cols-2 gap-4 pt-4">
										<Skeleton className="h-16 w-full" />
										<Skeleton className="h-16 w-full" />
									</div>
								</div>
							</div>
						</CardContent>
					</Card>
				))}
			</div>
		);
	}

	if (error) {
		return (
			<Card>
				<CardContent className="p-12 text-center">
					<AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
					<h3 className="text-lg font-semibold mb-2">
						Chyba pri načítaní kníh
					</h3>
					<p className="text-muted-foreground mb-6">Skúste to prosím neskôr</p>
					<Button onClick={() => window.location.reload()}>Skúsiť znova</Button>
				</CardContent>
			</Card>
		);
	}

	return (
		<div className="space-y-8">
			{/* Header */}
			<div className="space-y-4">
				<div>
					<h1 className="text-3xl font-bold tracking-tight">Moje výpožičky</h1>
					<p className="text-muted-foreground mt-2">
						Spravujte svoje požičané knihy, sledujte splatnosti a objavujte nové
						čítanie
					</p>
				</div>

				{/* Stats */}
				<StatsOverview />
			</div>

			{/* Search and Filter Bar */}
			<div className="flex flex-col lg:flex-row gap-4">
				<div className="relative flex-1">
					<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
					<Input
						placeholder="Hľadať knihy, autora alebo žánre..."
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						className="pl-10"
					/>
				</div>
				<div className="flex gap-2">
					<Select value={sortBy} onValueChange={setSortBy}>
						<SelectTrigger className="w-[180px]">
							<SelectValue placeholder="Zoradiť podľa" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="dueDate">Splatnosti</SelectItem>
							<SelectItem value="title">Názvu</SelectItem>
							<SelectItem value="progress">Pokroku</SelectItem>
						</SelectContent>
					</Select>
					<Button
						variant="outline"
						onClick={renewAll}
						disabled={filteredBooks.length === 0}
					>
						<RefreshCw className="h-4 w-4 mr-2" />
						Obnoviť všetky
					</Button>
				</div>
			</div>

			{/* Tabs */}
			<Tabs
				value={activeTab}
				onValueChange={setActiveTab}
				className="space-y-6"
			>
				<TabsList className="w-full">
					<TabsTrigger value="all" className="flex-1">
						Všetky ({books.length})
					</TabsTrigger>
					<TabsTrigger value="active" className="flex-1">
						Aktívne ({books.filter((b) => b.status === "active").length})
					</TabsTrigger>
					<TabsTrigger value="overdue" className="flex-1">
						Omeškané ({books.filter((b) => b.isOverdue).length})
					</TabsTrigger>
					<TabsTrigger value="returned" className="flex-1">
						Vrátené ({books.filter((b) => b.status === "returned").length})
					</TabsTrigger>
					<TabsTrigger value="favorites" className="flex-1">
						<Heart className="h-4 w-4 mr-2 fill-red-500 text-red-500" />
						Obľúbené ({books.filter((b) => b.isFavorite).length})
					</TabsTrigger>
				</TabsList>

				<TabsContent value={activeTab} className="space-y-6">
					{filteredBooks.length === 0 ? (
						<EmptyState
							activeTab={activeTab}
							searchQuery={searchQuery}
							onClearSearch={() => setSearchQuery("")}
						/>
					) : (
						<div className="space-y-6">
							{filteredBooks.map((book) => (
								<BookCard key={book.id} book={book} onAction={handleAction} />
							))}
						</div>
					)}
				</TabsContent>
			</Tabs>

			{/* Stats and Upcoming Due Dates */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				{/* Reading Stats */}
				<ReadingStats />

				{/* Upcoming Due Dates */}
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<CalendarClock className="h-5 w-5 text-amber-600" />
							Najbližšie splatnosti
						</CardTitle>
						<CardDescription>Knihy, ktoré treba čoskoro vrátiť</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="space-y-4">
							{books
								.filter((b) => b.status === "active" && !b.isOverdue)
								.sort((a, b) => a.daysRemaining - b.daysRemaining)
								.slice(0, 3)
								.map((book) => (
									<div
										key={book.id}
										className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors"
									>
										<div className="h-12 w-9 rounded overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
											<img
												src={book.coverImage}
												alt={book.title}
												className="h-full w-full object-cover"
											/>
										</div>
										<div className="flex-1 min-w-0">
											<p className="font-medium text-sm truncate">
												{book.title}
											</p>
											<p className="text-xs text-muted-foreground truncate">
												{book.author}
											</p>
										</div>
										<div className="text-right">
											<div className="font-medium text-sm">
												{book.daysRemaining} dní
											</div>
											<div className="text-xs text-muted-foreground">
												{format(new Date(book.dueDate), "d. MMM")}
											</div>
										</div>
									</div>
								))}
						</div>
					</CardContent>
					<CardFooter>
						<Button variant="ghost" className="w-full">
							Zobraziť všetky splatnosti
							<ChevronDown className="h-4 w-4 ml-2" />
						</Button>
					</CardFooter>
				</Card>
			</div>
		</div>
	);
}

export default BorrowedBooksPage;

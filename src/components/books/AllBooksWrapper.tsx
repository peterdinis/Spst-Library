import { FC, useState } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { useQuery } from "convex/react";
import { BookCard } from "@/components/books/BookCard";
import { 
	BookOpen, 
	Filter, 
	Search,
	X,
	SlidersHorizontal,
	TrendingUp,
	Sparkles
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { BooksSearch } from "./BookSearch";
import { BooksPagination } from "./BookPagination";
import { BooksFilters } from "./BookFilters";
import { api } from "convex/_generated/api";

const AllBooksWrapper: FC = () => {
	const [searchQuery, setSearchQuery] = useState("");
	const [status, setStatus] = useState<string>("all");
	const [category, setCategory] = useState<string>("all");
	const [author, setAuthor] = useState<string>("all");
	const [sortBy, setSortBy] = useState<string>("newest");
	const [page, setPage] = useState(1);
	const [showFilters, setShowFilters] = useState(false);
	const itemsPerPage = 12;

	// Queries
	const booksData = useQuery(api.books.getAll, {
		search: searchQuery.trim() || undefined,
		status: status !== "all" ? (status as any) : undefined,
		categoryId: category !== "all" ? (category as any) : undefined,
		authorId: author !== "all" ? (author as any) : undefined,
		sortBy: sortBy as any,
		paginationOpts: {
			numItems: itemsPerPage,
			cursor: page > 1 ? ((page - 1) * itemsPerPage).toString() : undefined,
		},
	});

	const books = booksData?.page;
	const categories = useQuery(api.categories.listAllActive);
	const authors = useQuery(api.authors.listAll);
	const stats = useQuery(api.books.getStats);

	// Loading states
	const isLoadingBooks = booksData === undefined;
	const isLoadingStats = stats === undefined;
	const isLoadingFilters = categories === undefined || authors === undefined;
	const isLoading = isLoadingBooks || isLoadingStats || isLoadingFilters;
	const isEmpty = !isLoadingBooks && (!books || books.length === 0);

	// Animation variants
	const containerVariants = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: {
				staggerChildren: 0.03,
				delayChildren: 0.1,
			},
		},
	};

	const itemVariants = {
		hidden: { opacity: 0, y: 20 },
		visible: {
			opacity: 1,
			y: 0,
			transition: {
				type: "spring",
				stiffness: 100,
				damping: 12,
			},
		},
	};

	const handleSearch = (query: string) => {
		setSearchQuery(query);
		setPage(1);
	};

	const handleClearFilters = () => {
		setSearchQuery("");
		setStatus("all");
		setCategory("all");
		setAuthor("all");
		setSortBy("newest");
		setPage(1);
	};

	const hasActiveFilters =
		searchQuery ||
		status !== "all" ||
		category !== "all" ||
		author !== "all" ||
		sortBy !== "newest";

	const activeFilterCount = [
		searchQuery && "search",
		status !== "all" && "status",
		category !== "all" && "category",
		author !== "all" && "author",
		sortBy !== "newest" && "sort",
	].filter(Boolean).length;

	const totalItems =
		booksData && "total" in booksData
			? (booksData.total as number)
			: stats?.totalBooks || 0;

	const totalPages = Math.ceil(totalItems / itemsPerPage);

	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			transition={{ duration: 0.3 }}
			className="space-y-6 px-4 sm:px-6"
		>
			{/* Modern Header */}
			<div className="relative">
				<motion.div
					initial={{ y: -20, opacity: 0 }}
					animate={{ y: 0, opacity: 1 }}
					className="text-center sm:text-left space-y-2 mb-6"
				>
					<h1 className="text-3xl sm:text-4xl font-bold tracking-tight bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
						Knižnica
					</h1>
					<p className="text-sm sm:text-base text-muted-foreground">
						Objavte {stats?.totalBooks || "..."} kníh v našej zbierke
					</p>
				</motion.div>

				{/* Enhanced Search Bar */}
				<motion.div
					initial={{ y: 20, opacity: 0 }}
					animate={{ y: 0, opacity: 1 }}
					transition={{ delay: 0.1 }}
					className="relative"
				>
					<div className="relative group">
						<Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
						<Input
							type="text"
							placeholder="Hľadať knihy, autorov, ISBN..."
							value={searchQuery}
							onChange={(e) => handleSearch(e.target.value)}
							className="h-14 pl-12 pr-12 text-base border-2 focus-visible:ring-2 focus-visible:ring-primary/20 transition-all"
						/>
						{searchQuery && (
							<Button
								variant="ghost"
								size="sm"
								onClick={() => handleSearch("")}
								className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
							>
								<X className="h-4 w-4" />
							</Button>
						)}
					</div>

					{/* Filter Button */}
					<div className="flex items-center gap-3 mt-4">
						<Button
							variant={showFilters ? "default" : "outline"}
							onClick={() => setShowFilters(!showFilters)}
							className="gap-2 relative"
							disabled={isLoading}
						>
							<SlidersHorizontal className="h-4 w-4" />
							<span className="hidden sm:inline">Filtre a zoradenie</span>
							<span className="sm:hidden">Filtre</span>
							{activeFilterCount > 0 && (
								<Badge 
									variant="secondary" 
									className="ml-1 h-5 w-5 p-0 flex items-center justify-center bg-primary text-primary-foreground"
								>
									{activeFilterCount}
								</Badge>
							)}
						</Button>

						{hasActiveFilters && (
							<Button
								variant="ghost"
								size="sm"
								onClick={handleClearFilters}
								className="gap-2 text-muted-foreground hover:text-destructive"
								disabled={isLoading}
							>
								<X className="h-4 w-4" />
								<span className="hidden sm:inline">Vymazať filtre</span>
							</Button>
						)}
					</div>
				</motion.div>

				{/* Collapsible Filters */}
				<AnimatePresence>
					{showFilters && (
						<motion.div
							initial={{ height: 0, opacity: 0, marginTop: 0 }}
							animate={{ height: "auto", opacity: 1, marginTop: 16 }}
							exit={{ height: 0, opacity: 0, marginTop: 0 }}
							transition={{ duration: 0.3, ease: "easeInOut" }}
							className="overflow-hidden"
						>
							<Card className="border-2 border-primary/10 bg-gradient-to-br from-background to-secondary/5">
								<CardContent className="p-4 sm:p-6">
									<BooksFilters
										categories={categories || []}
										authors={authors || []}
										selectedCategory={category}
										selectedAuthor={author}
										selectedStatus={status}
										sortBy={sortBy}
										onCategoryChange={setCategory}
										onAuthorChange={setAuthor}
										onStatusChange={setStatus}
										onSortChange={setSortBy}
										onClear={handleClearFilters}
									/>
								</CardContent>
							</Card>
						</motion.div>
					)}
				</AnimatePresence>
			</div>

			{/* Quick Stats */}
			{isLoadingStats ? (
				<motion.div
					initial={{ y: 10, opacity: 0 }}
					animate={{ y: 0, opacity: 1 }}
					className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4"
				>
					{Array.from({ length: 4 }).map((_, i) => (
						<Card key={i} className="bg-gradient-to-br from-background to-secondary/5">
							<CardContent className="p-4 sm:p-6 text-center">
								<Skeleton className="h-8 w-16 mx-auto mb-2" />
								<Skeleton className="h-4 w-24 mx-auto" />
							</CardContent>
						</Card>
					))}
				</motion.div>
			) : (
				stats && (
					<motion.div
						initial={{ y: 10, opacity: 0 }}
						animate={{ y: 0, opacity: 1 }}
						transition={{ delay: 0.2 }}
						className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4"
					>
						<StatCard
							value={stats.totalBooks}
							label="Celkom kníh"
							color="primary"
							icon={BookOpen}
						/>
						<StatCard
							value={stats.availableBooks}
							label="Dostupných"
							color="green"
							icon={Sparkles}
						/>
						<StatCard
							value={stats.reservedBooks}
							label="Rezervovaných"
							color="amber"
							icon={TrendingUp}
						/>
						<StatCard
							value={stats.totalCopies}
							label="Celkom kópií"
							color="purple"
							icon={BookOpen}
						/>
					</motion.div>
				)
			)}

			{/* Active Filters Chips */}
			<AnimatePresence>
				{hasActiveFilters && (
					<motion.div
						initial={{ y: -10, opacity: 0 }}
						animate={{ y: 0, opacity: 1 }}
						exit={{ y: -10, opacity: 0 }}
						className="flex flex-wrap gap-2"
					>
						{searchQuery && (
							<FilterChip
								label={`"${searchQuery}"`}
								onRemove={() => setSearchQuery("")}
								variant="default"
							/>
						)}
						{status !== "all" && (
							<FilterChip
								label={`Stav: ${getStatusLabel(status)}`}
								onRemove={() => setStatus("all")}
								variant="indigo"
							/>
						)}
						{category !== "all" && (
							<FilterChip
								label={`Kategória: ${
									categories?.find((c: any) => c._id === category)?.name || category
								}`}
								onRemove={() => setCategory("all")}
								variant="purple"
							/>
						)}
						{author !== "all" && (
							<FilterChip
								label={`Autor: ${
									authors?.find((a: any) => a._id === author)?.name || author
								}`}
								onRemove={() => setAuthor("all")}
								variant="emerald"
							/>
						)}
						{sortBy !== "newest" && (
							<FilterChip
								label={`Zoradenie: ${getSortLabel(sortBy)}`}
								onRemove={() => setSortBy("newest")}
								variant="amber"
							/>
						)}
					</motion.div>
				)}
			</AnimatePresence>

			{/* Loading State */}
			{isLoadingBooks && (
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6"
				>
					{Array.from({ length: itemsPerPage }).map((_, i) => (
						<motion.div
							key={i}
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: i * 0.05 }}
						>
							<Card className="overflow-hidden h-full">
								<CardContent className="p-4 sm:p-6">
									<Skeleton className="h-6 w-3/4 mb-4" />
									<Skeleton className="h-4 w-1/2 mb-2" />
									<Skeleton className="h-4 w-2/3 mb-2" />
									<Skeleton className="h-4 w-1/3 mb-4" />
									<Skeleton className="h-10 w-full" />
								</CardContent>
							</Card>
						</motion.div>
					))}
				</motion.div>
			)}

			{/* Empty State */}
			{isEmpty && !isLoadingBooks && (
				<motion.div
					initial={{ opacity: 0, scale: 0.95 }}
					animate={{ opacity: 1, scale: 1 }}
					className="flex flex-col items-center justify-center py-12 sm:py-16 text-center px-4"
				>
					<motion.div
						animate={{
							y: [0, -10, 0],
							rotate: [0, 5, -5, 0],
						}}
						transition={{
							duration: 3,
							repeat: Infinity,
							repeatType: "reverse",
						}}
					>
						<BookOpen className="h-20 w-20 sm:h-24 sm:w-24 text-muted-foreground/30 mb-6" />
					</motion.div>
					<h3 className="text-xl sm:text-2xl font-semibold mb-2">
						Nenašli sa žiadne knihy
					</h3>
					<p className="text-sm sm:text-base text-muted-foreground max-w-md mb-6">
						{searchQuery
							? `Pre hľadaný výraz "${searchQuery}" neexistujú žiadne výsledky.`
							: "Skúste zmeniť filtre alebo hľadať iný výraz."}
					</p>
					{hasActiveFilters && (
						<Button onClick={handleClearFilters} disabled={isLoading}>
							Vymazať filtre
						</Button>
					)}
				</motion.div>
			)}

			{/* Books Grid */}
			{!isLoadingBooks && !isEmpty && books && (
				<motion.div
					variants={containerVariants}
					initial="hidden"
					animate="visible"
					className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6"
				>
					<AnimatePresence mode="popLayout">
						{books.map((book, index) => (
							<motion.div
								key={book._id}
								layout
								variants={itemVariants as unknown as Variants}
								initial="hidden"
								animate="visible"
								exit={{ opacity: 0, scale: 0.9, y: -10 }}
								transition={{
									type: "spring",
									stiffness: 100,
									damping: 15,
									delay: index * 0.03,
								}}
								whileHover={{
									y: -4,
									transition: { duration: 0.2 },
								}}
							>
								<BookCard book={book} />
							</motion.div>
						))}
					</AnimatePresence>
				</motion.div>
			)}

			{/* Pagination */}
			{!isLoadingBooks && !isEmpty && books && books.length > 0 && (
				<motion.div
					initial={{ y: 20, opacity: 0 }}
					animate={{ y: 0, opacity: 1 }}
					transition={{ delay: 0.3 }}
				>
					<BooksPagination
						currentPage={page}
						totalPages={totalPages}
						onPageChange={setPage}
					/>
				</motion.div>
			)}
		</motion.div>
	);
};

// Helper Components
const StatCard: FC<{
	value: number;
	label: string;
	color: "primary" | "green" | "amber" | "purple";
	icon: any;
}> = ({ value, label, color, icon: Icon }) => {
	const colorClasses = {
		primary: "text-primary",
		green: "text-green-600 dark:text-green-400",
		amber: "text-amber-600 dark:text-amber-400",
		purple: "text-purple-600 dark:text-purple-400",
	};

	return (
		<Card className="bg-gradient-to-br from-background to-secondary/5 border-border/50 hover:border-border transition-all hover:shadow-md">
			<CardContent className="p-4 sm:p-6 text-center">
				<div className="flex items-center justify-center gap-2 mb-2">
					<Icon className={`h-5 w-5 ${colorClasses[color]}`} />
					<p className={`text-2xl sm:text-3xl font-bold ${colorClasses[color]}`}>
						{value}
					</p>
				</div>
				<p className="text-xs sm:text-sm text-muted-foreground">{label}</p>
			</CardContent>
		</Card>
	);
};

const FilterChip: FC<{
	label: string;
	onRemove: () => void;
	variant: "default" | "indigo" | "purple" | "emerald" | "amber";
}> = ({ label, onRemove, variant }) => {
	const variantClasses = {
		default: "bg-secondary/50 text-foreground border-border",
		indigo: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20",
		purple: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
		emerald: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
		amber: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
	};

	return (
		<Badge
			variant="secondary"
			className={`${variantClasses[variant]} gap-2 pr-1 pl-3 py-1.5 text-sm font-medium border`}
		>
			{label}
			<Button
				variant="ghost"
				size="sm"
				className="h-5 w-5 p-0 ml-1 hover:bg-destructive/20 rounded-full"
				onClick={onRemove}
			>
				<X className="h-3 w-3" />
			</Button>
		</Badge>
	);
};

// Helper Functions
const getStatusLabel = (status: string) => {
	const labels: Record<string, string> = {
		available: "Dostupné",
		reserved: "Rezervované",
		maintenance: "V údržbe",
		lost: "Stratené",
	};
	return labels[status] || status;
};

const getSortLabel = (sort: string) => {
	const labels: Record<string, string> = {
		oldest: "Najstaršie",
		title_asc: "Názov (A-Z)",
		title_desc: "Názov (Z-A)",
	};
	return labels[sort] || sort;
};

export default AllBooksWrapper;
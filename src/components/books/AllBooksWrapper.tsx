import { FC, useState } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { useQuery } from "convex/react";
import { BookCard } from "@/components/books/BookCard";
import { BookOpen, Filter } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
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

	// Opravený input pre books query
	const books = useQuery(api.books.getAll, {
		search: searchQuery.trim() || undefined,
		status: status !== "all" ? (status as any) : undefined,
		categoryId: category !== "all" ? (category as any) : undefined,
		authorId: author !== "all" ? (author as any) : undefined,
		sortBy: sortBy as any,
		limit: itemsPerPage,
		offset: (page - 1) * itemsPerPage,
	});

	// Fetch filters data
	const categories = useQuery(api.categories.getCategoriesWithStats);
	const authors = useQuery(api.authors.list, {
		paginationOpts: { numItems: 100 },
	});

	// Štatistiky kníh
	const stats = useQuery(api.books.getStats);

	// Loading states - opravené na správne overovanie
	const isLoadingBooks = books === undefined;
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

	// Počet strán pre pagináciu - berie do úvahy search
	const totalPages = searchQuery.trim()
		? Math.ceil((books?.length || 0) / itemsPerPage)
		: Math.ceil((stats?.totalBooks || 0) / itemsPerPage);

	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			transition={{ duration: 0.3 }}
			className="space-y-6"
		>
			{/* Header with Search and Stats */}
			<Card className="overflow-hidden border-border/50 bg-linear-to-br from-background to-secondary/5">
				<CardContent className="p-6">
					<div className="space-y-4">
						{/* Title and Search */}
						<div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
							<div>
								<motion.h1
									initial={{ y: -10, opacity: 0 }}
									animate={{ y: 0, opacity: 1 }}
									className="text-3xl font-bold tracking-tight"
								>
									Knižnica
								</motion.h1>
								<motion.p
									initial={{ y: -5, opacity: 0 }}
									animate={{ y: 0, opacity: 1 }}
									transition={{ delay: 0.1 }}
									className="text-muted-foreground"
								>
									Prehľad dostupných kníh
								</motion.p>
							</div>

							<div className="w-full md:w-auto">
								<BooksSearch
									onSearch={handleSearch}
									value={searchQuery}
									placeholder="Hľadať knihy, autorov, ISBN..."
								/>
							</div>
						</div>

						<Separator />

						{/* Quick Stats - Loading state */}
						{isLoadingStats ? (
							<motion.div
								initial={{ y: 10, opacity: 0 }}
								animate={{ y: 0, opacity: 1 }}
								className="grid grid-cols-2 md:grid-cols-4 gap-4"
							>
								{Array.from({ length: 4 }).map((_, i) => (
									<Card key={i} className="bg-background/50 border-border/30">
										<CardContent className="p-4 text-center">
											<Skeleton className="h-7 w-12 mx-auto mb-2" />
											<Skeleton className="h-4 w-20 mx-auto" />
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
									className="grid grid-cols-2 md:grid-cols-4 gap-4"
								>
									<Card className="bg-background/50 border-border/30">
										<CardContent className="p-4 text-center">
											<p className="text-2xl font-bold text-primary">
												{stats.totalBooks}
											</p>
											<p className="text-sm text-muted-foreground">
												Celkom kníh
											</p>
										</CardContent>
									</Card>
									<Card className="bg-background/50 border-border/30">
										<CardContent className="p-4 text-center">
											<p className="text-2xl font-bold text-green-600">
												{stats.availableBooks}
											</p>
											<p className="text-sm text-muted-foreground">
												Dostupných
											</p>
										</CardContent>
									</Card>
									<Card className="bg-background/50 border-border/30">
										<CardContent className="p-4 text-center">
											<p className="text-2xl font-bold text-amber-600">
												{stats.reservedBooks}
											</p>
											<p className="text-sm text-muted-foreground">
												Rezervovaných
											</p>
										</CardContent>
									</Card>
									<Card className="bg-background/50 border-border/30">
										<CardContent className="p-4 text-center">
											<p className="text-2xl font-bold text-purple-600">
												{stats.totalCopies}
											</p>
											<p className="text-sm text-muted-foreground">
												Celkom kópií
											</p>
										</CardContent>
									</Card>
								</motion.div>
							)
						)}

						{/* Filter Toggle */}
						<motion.div
							initial={{ y: 5, opacity: 0 }}
							animate={{ y: 0, opacity: 1 }}
							transition={{ delay: 0.3 }}
						>
							<Button
								variant="outline"
								size="sm"
								onClick={() => setShowFilters(!showFilters)}
								className="gap-2"
								disabled={isLoading}
							>
								<Filter className="h-4 w-4" />
								Filtre{" "}
								{hasActiveFilters &&
									`(${
										[
											searchQuery,
											status !== "all" && "stav",
											category !== "all" && "kategória",
											author !== "all" && "autor",
											sortBy !== "newest" && "zoradenie",
										].filter(Boolean).length
									})`}
							</Button>
						</motion.div>

						<AnimatePresence>
							{showFilters && (
								<motion.div
									initial={{ height: 0, opacity: 0 }}
									animate={{ height: "auto", opacity: 1 }}
									exit={{ height: 0, opacity: 0 }}
									transition={{ duration: 0.2 }}
									className="overflow-hidden"
								>
									<div className="pt-4">
										<BooksFilters
											categories={(categories as any) || []}
											authors={(authors?.page as any) || []}
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
									</div>
								</motion.div>
							)}
						</AnimatePresence>
					</div>
				</CardContent>
			</Card>

			{/* Active Filters Badges */}
			<AnimatePresence>
				{hasActiveFilters && (
					<motion.div
						initial={{ y: -10, opacity: 0 }}
						animate={{ y: 0, opacity: 1 }}
						exit={{ y: -10, opacity: 0 }}
						className="flex flex-wrap gap-2"
					>
						{searchQuery && (
							<Badge variant="secondary" className="gap-1">
								Hľadanie: {searchQuery}
								<Button
									variant="ghost"
									size="sm"
									className="h-4 w-4 p-0 ml-1"
									onClick={() => setSearchQuery("")}
									disabled={isLoading}
								>
									✕
								</Button>
							</Badge>
						)}
						{status !== "all" && (
							<Badge
								variant="secondary"
								className="bg-indigo-500/10 text-indigo-400 border-indigo-500/20 gap-1 pr-1 py-1"
							>
								Stav:{" "}
								{status === "available"
									? "Dostupné"
									: status === "reserved"
										? "Rezervované"
										: status === "maintenance"
											? "V údržbe"
											: status === "lost"
												? "Stratené"
												: status}
								<Button
									variant="ghost"
									size="sm"
									className="h-5 w-5 p-0 ml-1 hover:bg-indigo-500/20 rounded-full"
									onClick={() => setStatus("all")}
									disabled={isLoading}
								>
									✕
								</Button>
							</Badge>
						)}
						{category !== "all" && (
							<Badge
								variant="secondary"
								className="bg-purple-500/10 text-purple-400 border-purple-500/20 gap-1 pr-1 py-1"
							>
								Kategória:{" "}
								{categories?.find((c: any) => c._id === category)?.name ||
									category}
								<Button
									variant="ghost"
									size="sm"
									className="h-5 w-5 p-0 ml-1 hover:bg-purple-500/20 rounded-full"
									onClick={() => setCategory("all")}
									disabled={isLoading}
								>
									✕
								</Button>
							</Badge>
						)}
						{author !== "all" && (
							<Badge
								variant="secondary"
								className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 gap-1 pr-1 py-1"
							>
								Autor:{" "}
								{authors?.page.find((a: any) => a._id === author)?.name ||
									author}
								<Button
									variant="ghost"
									size="sm"
									className="h-5 w-5 p-0 ml-1 hover:bg-emerald-500/20 rounded-full"
									onClick={() => setAuthor("all")}
									disabled={isLoading}
								>
									✕
								</Button>
							</Badge>
						)}
						{sortBy !== "newest" && (
							<Badge
								variant="secondary"
								className="bg-amber-500/10 text-amber-400 border-amber-500/20 gap-1 pr-1 py-1"
							>
								Zoradenie:{" "}
								{sortBy === "oldest"
									? "Najstaršie"
									: sortBy === "title_asc"
										? "Názov (A-Z)"
										: sortBy === "title_desc"
											? "Názov (Z-A)"
											: sortBy}
								<Button
									variant="ghost"
									size="sm"
									className="h-5 w-5 p-0 ml-1 hover:bg-amber-500/20 rounded-full"
									onClick={() => setSortBy("newest")}
									disabled={isLoading}
								>
									✕
								</Button>
							</Badge>
						)}
						<Button
							variant="ghost"
							size="sm"
							onClick={handleClearFilters}
							className="h-8 text-xs text-slate-500 hover:text-white"
							disabled={isLoading}
						>
							Vymazať všetko
						</Button>
					</motion.div>
				)}
			</AnimatePresence>

			{/* Loading State for Books */}
			{isLoadingBooks && (
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
				>
					{Array.from({ length: itemsPerPage }).map((_, i) => (
						<motion.div
							key={i}
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: i * 0.05 }}
						>
							<Card className="overflow-hidden">
								<CardContent className="p-6">
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
					className="flex flex-col items-center justify-center py-16 text-center"
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
						<BookOpen className="h-24 w-24 text-muted-foreground/30 mb-6" />
					</motion.div>
					<h3 className="text-2xl font-semibold mb-2">
						Nenašli sa žiadne knihy
					</h3>
					<p className="text-muted-foreground max-w-md mb-6">
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
					className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
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

export default AllBooksWrapper;

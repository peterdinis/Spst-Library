import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
	Pagination,
	PaginationContent,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from "@/components/ui/pagination";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Search, BookOpen, MapPin, X, Loader2 } from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import { useQuery } from "convex/react";
import { api } from "convex/_generated/api";

export function AllAuthorsWrapper() {
	const [searchQuery, setSearchQuery] = useState("");
	const [currentPage, setCurrentPage] = useState(1);
	const [itemsPerPage, setItemsPerPage] = useState(6);
	const [nationalityFilter, setNationalityFilter] = useState<string>("all");
	const [sortBy, setSortBy] = useState<string>("name_asc");

	// Convex queries
	const authorsResult = useQuery(api.authors.list, {
		paginationOpts: { numItems: 100 }, // Load more for client-side filtering
	});
	const nationalities = useQuery(api.authors.getNationalities);
	const stats = useQuery(api.authors.getStats);

	const isLoading = authorsResult === undefined;

	// Transform authors data
	const authors = useMemo(() => {
		if (!authorsResult?.page) return [];

		return authorsResult.page.map((author) => ({
			...author,
			id: author._id,
			fullName: author.name,
			nationality: author.nationality || "Neznáme",
			photoUrl:
				author.photoFileId ||
				`https://ui-avatars.com/api/?name=${encodeURIComponent(author.name)}&background=random&size=128`,
		}));
	}, [authorsResult]);

	// Filter and search authors
	const filteredAuthors = useMemo(() => {
		let result = authors.filter((author) => {
			const matchesSearch =
				searchQuery === "" ||
				author.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
				(author.biography &&
					author.biography.toLowerCase().includes(searchQuery.toLowerCase()));

			const matchesNationality =
				nationalityFilter === "all" || author.nationality === nationalityFilter;

			return matchesSearch && matchesNationality;
		});

		// Apply sorting
		result.sort((a, b) => {
			if (sortBy === "name_asc") return a.name.localeCompare(b.name);
			if (sortBy === "name_desc") return b.name.localeCompare(a.name);
			if (sortBy === "books_desc") return (b.bookCount || 0) - (a.bookCount || 0);
			if (sortBy === "books_asc") return (a.bookCount || 0) - (b.bookCount || 0);
			return 0;
		});

		return result;
	}, [authors, searchQuery, nationalityFilter, sortBy]);

	// Calculate pagination
	const totalPages = Math.ceil(filteredAuthors.length / itemsPerPage);
	const startIndex = (currentPage - 1) * itemsPerPage;
	const endIndex = startIndex + itemsPerPage;
	const paginatedAuthors = filteredAuthors.slice(startIndex, endIndex);

	// Reset to first page when filters change
	useEffect(() => {
		setCurrentPage(1);
	}, [searchQuery, nationalityFilter, sortBy, itemsPerPage]);

	const containerVariants = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: {
				staggerChildren: 0.1,
			},
		},
	};

	const itemVariants = {
		hidden: { opacity: 0, y: 20 },
		visible: {
			opacity: 1,
			y: 0,
			transition: {
				duration: 0.5,
			},
		},
	};

	const handleSearchClear = () => {
		setSearchQuery("");
	};

	const handlePageChange = (page: number) => {
		setCurrentPage(page);
		window.scrollTo({ top: 0, behavior: "smooth" });
	};

	const ITEMS_PER_PAGE_OPTIONS = [6, 12, 24, 48];

	if (isLoading) {
		return (
			<section className="py-16 bg-linear-to-b from-background to-muted/30">
				<div className="container mx-auto px-4">
					<div className="flex flex-col items-center justify-center py-20">
						<Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
						<h3 className="text-xl font-semibold mb-2">
							Načítavanie autorov...
						</h3>
						<p className="text-muted-foreground">Prosím čakajte</p>
					</div>
				</div>
			</section>
		);
	}

	return (
		<section className="py-16 bg-linear-to-b from-background to-muted/30">
			<div className="container mx-auto px-4">
				{/* Header */}
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6 }}
					className="text-center mb-12"
				>
					<div className="flex justify-between items-center mb-4">
						<div className="flex-1"></div>
						<div className="flex-1 text-center">
							<h1 className="text-4xl md:text-5xl font-bold tracking-tight">
								Naši autori
							</h1>
						</div>
						<div className="flex-1 flex justify-end" />
					</div>
					<p className="text-lg text-muted-foreground max-w-2xl mx-auto">
						Spoznajte autorov kníh v našej knižnici. Máme celkovo{" "}
						{stats?.totalAuthors || 0} autorov z {stats?.topNationalities.length || 0} krajín.
					</p>
				</motion.div>

				{/* Search and Filter Controls */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: 0.2 }}
					className="mb-8"
				>
					<div className="flex flex-col lg:flex-row gap-4">
						{/* Search Input */}
						<div className="relative flex-1">
							<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
							<Input
								type="text"
								placeholder="Hľadať autorov..."
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								className="pl-10 pr-10 h-12 bg-background/50 border-border/50 rounded-xl"
							/>
							{searchQuery && (
								<Button
									variant="ghost"
									size="sm"
									onClick={handleSearchClear}
									className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
								>
									<X className="h-4 w-4" />
								</Button>
							)}
						</div>

						{/* Filters Grid */}
						<div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full lg:w-auto">
							<Select
								value={nationalityFilter}
								onValueChange={setNationalityFilter}
							>
								<SelectTrigger className="w-full h-12 bg-background/50 border-border/50 rounded-xl sm:w-48">
									<SelectValue placeholder="Národnosť" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="all">Všetky národnosti</SelectItem>
									{nationalities?.map((nationality) => (
										<SelectItem key={nationality} value={nationality}>
											{nationality}
										</SelectItem>
									))}
								</SelectContent>
							</Select>

							<Select value={sortBy} onValueChange={setSortBy}>
								<SelectTrigger className="w-full h-12 bg-background/50 border-border/50 rounded-xl sm:w-48">
									<SelectValue placeholder="Zoradiť podľa" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="name_asc">Meno (A-Z)</SelectItem>
									<SelectItem value="name_desc">Meno (Z-A)</SelectItem>
									<SelectItem value="books_desc">Počet kníh (max)</SelectItem>
									<SelectItem value="books_asc">Počet kníh (min)</SelectItem>
								</SelectContent>
							</Select>

							<Select
								value={itemsPerPage.toString()}
								onValueChange={(value) => setItemsPerPage(parseInt(value))}
							>
								<SelectTrigger className="w-full h-12 bg-background/50 border-border/50 rounded-xl sm:w-32">
									<SelectValue placeholder="Na stranu" />
								</SelectTrigger>
								<SelectContent>
									{ITEMS_PER_PAGE_OPTIONS.map((option) => (
										<SelectItem key={option} value={option.toString()}>
											{option} za stranu
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
					</div>

					{/* Results Count */}
					<div className="mt-4 text-sm text-muted-foreground">
						{filteredAuthors.length === 0 ? (
							"Nenašli sa žiadni autori"
						) : (
							<>
								Nájdených {filteredAuthors.length}{" "}
								{filteredAuthors.length === 1
									? "autor"
									: filteredAuthors.length >= 2 && filteredAuthors.length <= 4
										? "autori"
										: "autorov"}
								{searchQuery && ` pre "${searchQuery}"`}
								{nationalityFilter !== "all" && ` (${nationalityFilter})`}
							</>
						)}
					</div>
				</motion.div>

				{/* Authors Grid */}
				{filteredAuthors.length > 0 ? (
					<>
						<motion.div
							variants={containerVariants}
							initial="hidden"
							animate="visible"
							className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
						>
							{paginatedAuthors.map((author) => (
								<motion.div
									key={author.id}
									variants={itemVariants}
									whileHover={{ y: -5, scale: 1.02 }}
									transition={{ duration: 0.2 }}
									className="cursor-pointer"
								>
									<Link
										to="/authors/$authorId"
										params={{ authorId: author.id }}
										className="block"
									>
										<Card className="h-full hover:shadow-lg transition-all duration-300 border-border/50">
											<CardHeader>
												<div className="flex items-start gap-4 mb-3">
													<img
														src={author.photoUrl}
														alt={author.name}
														className="w-16 h-16 rounded-full object-cover ring-2 ring-muted"
														loading="lazy"
														onError={(e) => {
															const target = e.target as HTMLImageElement;
															target.onerror = null;
															target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(author.name)}&background=6b7280&color=fff&size=128`;
														}}
													/>
													<div className="flex-1">
														<CardTitle className="text-xl mb-1">
															{author.name}
														</CardTitle>
														{author.nationality && (
															<div className="flex items-center gap-1 text-sm text-muted-foreground">
																<MapPin className="h-3 w-3" />
																{author.nationality}
															</div>
														)}
													</div>
												</div>
												<CardDescription className="line-clamp-3">
													{author.biography || "Životopis nie je k dispozícii"}
												</CardDescription>
											</CardHeader>
											<CardContent>
												<div className="flex items-center justify-between">
													<div className="flex items-center gap-2 text-sm">
														<BookOpen className="h-4 w-4 text-muted-foreground" />
														<span className="text-muted-foreground">
															{author.bookCount || 0}{" "}
															{(author.bookCount || 0) === 1
																? "kniha"
																: (author.bookCount || 0) >= 2 &&
																	(author.bookCount || 0) <= 4
																	? "knihy"
																	: "kníh"}
														</span>
													</div>
													<Badge variant="secondary" className="font-normal">
														Zobraziť profil
													</Badge>
												</div>
											</CardContent>
										</Card>
									</Link>
								</motion.div>
							))}
						</motion.div>

						{/* Pagination */}
						{totalPages > 1 && (
							<motion.div
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.5, delay: 0.3 }}
								className="mt-8"
							>
								<Pagination>
									<PaginationContent>
										<PaginationItem>
											<PaginationPrevious
												onClick={() =>
													handlePageChange(Math.max(1, currentPage - 1))
												}
												className={
													currentPage === 1
														? "pointer-events-none opacity-50"
														: "cursor-pointer"
												}
											/>
										</PaginationItem>

										{Array.from({ length: totalPages }, (_, i) => i + 1)
											.filter((page) => {
												// Show first, last, current, and pages around current
												if (totalPages <= 7) return true;
												if (page === 1 || page === totalPages) return true;
												if (Math.abs(page - currentPage) <= 1) return true;
												return false;
											})
											.map((page, index, array) => {
												// Add ellipsis for gaps
												const showEllipsis =
													index > 0 && page - array[index - 1] > 1;
												return (
													<div key={page} className="flex items-center">
														{showEllipsis && (
															<span className="px-2 text-muted-foreground">
																...
															</span>
														)}
														<PaginationItem>
															<PaginationLink
																onClick={() => handlePageChange(page)}
																isActive={currentPage === page}
																className="cursor-pointer"
															>
																{page}
															</PaginationLink>
														</PaginationItem>
													</div>
												);
											})}

										<PaginationItem>
											<PaginationNext
												onClick={() =>
													handlePageChange(
														Math.min(totalPages, currentPage + 1),
													)
												}
												className={
													currentPage === totalPages
														? "pointer-events-none opacity-50"
														: "cursor-pointer"
												}
											/>
										</PaginationItem>
									</PaginationContent>
								</Pagination>

								{/* Page Info */}
								<div className="text-center text-sm text-muted-foreground mt-4">
									Strana {currentPage} z {totalPages} • Zobrazené{" "}
									{startIndex + 1}-{Math.min(endIndex, filteredAuthors.length)}{" "}
									z {filteredAuthors.length} autorov
								</div>
							</motion.div>
						)}
					</>
				) : (
					// No Results State
					<motion.div
						initial={{ opacity: 0, scale: 0.9 }}
						animate={{ opacity: 1, scale: 1 }}
						className="text-center py-12"
					>
						<div className="mx-auto max-w-md">
							<div className="rounded-full bg-muted p-6 w-24 h-24 flex items-center justify-center mx-auto mb-6">
								<Search className="h-12 w-12 text-muted-foreground" />
							</div>
							<h3 className="text-xl font-semibold mb-2">
								Nenašli sa žiadni autori
							</h3>
							<p className="text-muted-foreground mb-6">
								Skúste zmeniť kritériá vyhľadávania alebo vymazať filtre
							</p>
							<Button
								variant="outline"
								onClick={() => {
									setSearchQuery("");
									setNationalityFilter("all");
								}}
							>
								<X className="mr-2 h-4 w-4" />
								Vymazať všetky filtre
							</Button>
						</div>
					</motion.div>
				)}

				{/* Stats */}
				{stats && (
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6, delay: 0.4 }}
						className="text-center mt-12"
					>
						<div className="grid grid-cols-2 md:grid-cols-3 gap-6 max-w-xl mx-auto">
							<div className="text-center p-4 rounded-lg border bg-card">
								<div className="text-2xl font-bold text-primary">
									{stats.totalAuthors}
								</div>
								<div className="text-sm text-muted-foreground">
									Celkom autorov
								</div>
							</div>
							<div className="text-center p-4 rounded-lg border bg-card">
								<div className="text-2xl font-bold text-green-600">
									{stats.totalBooks}
								</div>
								<div className="text-sm text-muted-foreground">Celkom kníh</div>
							</div>
							<div className="text-center p-4 rounded-lg border bg-card">
								<div className="text-2xl font-bold text-purple-600">
									{stats.topNationalities.length}
								</div>
								<div className="text-sm text-muted-foreground">Krajín</div>
							</div>
						</div>
					</motion.div>
				)}
			</div>
		</section>
	);
}

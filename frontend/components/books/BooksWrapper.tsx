"use client";

import { FC, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
	Pagination,
	PaginationContent,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from "@/components/ui/pagination";
import { Search, BookOpen, User, Calendar, Filter, X } from "lucide-react";
import { Book } from "@/lib/types";
import { mockBooks } from "@/lib/mockData";

const BooksWrapper: FC = () => {
	const router = useRouter();
	const [books, setBooks] = useState<Book[]>([]);
	const [searchTerm, setSearchTerm] = useState("");
	const [currentPage, setCurrentPage] = useState(1);
	const [showFilters, setShowFilters] = useState(false);
	const [selectedCategory, setSelectedCategory] = useState<string>("all");
	const [availability, setAvailability] = useState<string>("all");
	const booksPerPage = 6;

	useEffect(() => {
		setBooks(mockBooks);
	}, []);

	// Get all unique categories
	const categories = [
		"all",
		...new Set(books.map((book) => book.categoryName)),
	];

	// Filter books based on search and filters
	const filteredBooks = books.filter((book) => {
		const matchesSearch =
			book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
			book.authorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
			book.categoryName.toLowerCase().includes(searchTerm.toLowerCase());

		const matchesCategory =
			selectedCategory === "all" || book.categoryName === selectedCategory;

		const matchesAvailability =
			availability === "all" ||
			(availability === "available" && book.availableCopies > 0) ||
			(availability === "unavailable" && book.availableCopies === 0);

		return matchesSearch && matchesCategory && matchesAvailability;
	});

	// Pagination
	const indexOfLastBook = currentPage * booksPerPage;
	const indexOfFirstBook = indexOfLastBook - booksPerPage;
	const currentBooks = filteredBooks.slice(indexOfFirstBook, indexOfLastBook);
	const totalPages = Math.ceil(filteredBooks.length / booksPerPage);

	const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearchTerm(e.target.value);
		setCurrentPage(1);
	};

	const handleFilterToggle = () => {
		setShowFilters(!showFilters);
	};

	const clearFilters = () => {
		setSelectedCategory("all");
		setAvailability("all");
		setCurrentPage(1);
	};

	const hasActiveFilters = selectedCategory !== "all" || availability !== "all";

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

	return (
		<section className="py-16 bg-gradient-to-b from-background to-muted/30">
			<div className="container mx-auto px-4">
				{/* Header */}
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6 }}
					className="text-center mb-12"
				>
					<h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
						Knižný Katalóg
					</h1>
					<p className="text-lg text-muted-foreground max-w-2xl mx-auto">
						Preskúmajte našu rozsiahlu zbierku kníh. Vyhľadávajte podľa názvu,
						autora alebo kategórie.
					</p>
				</motion.div>

				{/* Search and Filters */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6, delay: 0.2 }}
					className="mb-8"
				>
					<div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
						<div className="relative w-full sm:w-96">
							<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
							<Input
								type="text"
								placeholder="Hľadať knihy, autorov, kategórie..."
								value={searchTerm}
								onChange={handleSearch}
								className="pl-10 pr-4 py-2 w-full"
							/>
						</div>
						<div className="flex gap-2">
							{hasActiveFilters && (
								<Button
									variant="outline"
									onClick={clearFilters}
									className="flex items-center gap-2"
								>
									<X className="h-4 w-4" />
									Vymazať filtre
								</Button>
							)}
							<Button
								variant="outline"
								onClick={handleFilterToggle}
								className="flex items-center gap-2"
							>
								<Filter className="h-4 w-4" />
								Filtre {hasActiveFilters && "•"}
							</Button>
						</div>
					</div>

					{/* Filter Panel */}
					<AnimatePresence>
						{showFilters && (
							<motion.div
								initial={{ opacity: 0, height: 0 }}
								animate={{ opacity: 1, height: "auto" }}
								exit={{ opacity: 0, height: 0 }}
								transition={{ duration: 0.3 }}
								className="mt-4 p-6 border rounded-lg bg-background"
							>
								<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
									{/* Category Filter */}
									<div>
										<label className="text-sm font-medium mb-2 block">
											Kategória
										</label>
										<select
											value={selectedCategory}
											onChange={(e) => {
												setSelectedCategory(e.target.value);
												setCurrentPage(1);
											}}
											className="w-full p-2 border rounded-md bg-background"
										>
											{categories.map((category) => (
												<option key={category} value={category}>
													{category === "all" ? "Všetky kategórie" : category}
												</option>
											))}
										</select>
									</div>

									{/* Availability Filter */}
									<div>
										<label className="text-sm font-medium mb-2 block">
											Dostupnosť
										</label>
										<select
											value={availability}
											onChange={(e) => {
												setAvailability(e.target.value);
												setCurrentPage(1);
											}}
											className="w-full p-2 border rounded-md bg-background"
										>
											<option value="all">Všetky</option>
											<option value="available">Dostupné</option>
											<option value="unavailable">Vypožičané</option>
										</select>
									</div>
								</div>
							</motion.div>
						)}
					</AnimatePresence>
				</motion.div>

				{/* Active Filters Badges */}
				{hasActiveFilters && (
					<motion.div
						initial={{ opacity: 0, y: -10 }}
						animate={{ opacity: 1, y: 0 }}
						className="mb-6 flex flex-wrap gap-2"
					>
						{selectedCategory !== "all" && (
							<Badge variant="secondary" className="flex items-center gap-1">
								Kategória: {selectedCategory}
								<X
									className="h-3 w-3 cursor-pointer"
									onClick={() => setSelectedCategory("all")}
								/>
							</Badge>
						)}
						{availability !== "all" && (
							<Badge variant="secondary" className="flex items-center gap-1">
								{availability === "available" ? "Dostupné" : "Vypožičané"}
								<X
									className="h-3 w-3 cursor-pointer"
									onClick={() => setAvailability("all")}
								/>
							</Badge>
						)}
					</motion.div>
				)}

				{/* Books Grid */}
				<motion.div
					variants={containerVariants}
					initial="hidden"
					whileInView="visible"
					className="mb-12"
				>
					<AnimatePresence>
						{currentBooks.length > 0 ? (
							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
								{currentBooks.map((book) => (
									<motion.div
										key={book.id}
										variants={itemVariants}
										layout
										whileHover={{ y: -5, transition: { duration: 0.2 } }}
										onClick={() => router.push(`/books/${book.id}`)}
										className="cursor-pointer"
									>
										<Card className="h-full hover:shadow-lg transition-shadow duration-300">
											<CardHeader className="pb-3">
												<div className="flex justify-between items-start mb-2">
													<Badge
														variant={
															book.availableCopies > 0
																? "success"
																: "destructive"
														}
													>
														{book.availableCopies > 0
															? `Dostupné: ${book.availableCopies}`
															: "Vypožičané"}
													</Badge>
													<Badge variant="outline">{book.categoryName}</Badge>
												</div>
												<CardTitle className="text-xl line-clamp-2">
													{book.title}
												</CardTitle>
												<CardDescription className="flex items-center gap-2 mt-2">
													<User className="h-4 w-4" />
													{book.authorName}
												</CardDescription>
											</CardHeader>
											<CardContent className="pb-3">
												<p className="text-sm text-muted-foreground line-clamp-3">
													{book.description}
												</p>
												<div className="flex items-center gap-2 mt-3 text-xs text-muted-foreground">
													<Calendar className="h-3 w-3" />
													Rok vydania: {book.publishedYear}
												</div>
											</CardContent>
											<CardFooter>
												<Button
													className="w-full"
													disabled={book.availableCopies === 0}
													onClick={(e) => {
														e.stopPropagation();
														router.push(`/books/${book.id}`);
													}}
												>
													{book.availableCopies > 0
														? "Zobraziť detail"
														: "Nedostupné"}
												</Button>
											</CardFooter>
										</Card>
									</motion.div>
								))}
							</div>
						) : (
							<motion.div
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								className="text-center py-12"
							>
								<BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
								<h3 className="text-xl font-semibold mb-2">
									Nenašli sa žiadne knihy
								</h3>
								<p className="text-muted-foreground">
									Skúste zmeniť vyhľadávací výraz alebo filtrovanie.
								</p>
							</motion.div>
						)}
					</AnimatePresence>
				</motion.div>

				{/* Pagination */}
				{totalPages > 1 && (
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6, delay: 0.4 }}
					>
						<Pagination>
							<PaginationContent>
								<PaginationItem>
									<PaginationPrevious
										href="#"
										onClick={(e) => {
											e.preventDefault();
											setCurrentPage((prev) => Math.max(prev - 1, 1));
										}}
										className={
											currentPage === 1 ? "pointer-events-none opacity-50" : ""
										}
									/>
								</PaginationItem>

								{Array.from({ length: totalPages }, (_, i) => i + 1).map(
									(page) => (
										<PaginationItem key={page}>
											<PaginationLink
												href="#"
												onClick={(e) => {
													e.preventDefault();
													setCurrentPage(page);
												}}
												isActive={currentPage === page}
											>
												{page}
											</PaginationLink>
										</PaginationItem>
									),
								)}

								<PaginationItem>
									<PaginationNext
										href="#"
										onClick={(e) => {
											e.preventDefault();
											setCurrentPage((prev) => Math.min(prev + 1, totalPages));
										}}
										className={
											currentPage === totalPages
												? "pointer-events-none opacity-50"
												: ""
										}
									/>
								</PaginationItem>
							</PaginationContent>
						</Pagination>
					</motion.div>
				)}

				{/* Stats */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6, delay: 0.6 }}
					className="text-center mt-12"
				>
					<div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto">
						<div className="text-center">
							<div className="text-2xl font-bold text-primary">
								{filteredBooks.length}
							</div>
							<div className="text-sm text-muted-foreground">Nájdené knihy</div>
						</div>
						<div className="text-center">
							<div className="text-2xl font-bold text-green-600">
								{filteredBooks.filter((b) => b.availableCopies > 0).length}
							</div>
							<div className="text-sm text-muted-foreground">Dostupné</div>
						</div>
						<div className="text-center">
							<div className="text-2xl font-bold text-orange-600">
								{filteredBooks.filter((b) => b.availableCopies === 0).length}
							</div>
							<div className="text-sm text-muted-foreground">Vypožičané</div>
						</div>
						<div className="text-center">
							<div className="text-2xl font-bold text-purple-600">
								{new Set(filteredBooks.map((b) => b.categoryName)).size}
							</div>
							<div className="text-sm text-muted-foreground">Kategórií</div>
						</div>
					</div>
				</motion.div>
			</div>
		</section>
	);
};

export default BooksWrapper;

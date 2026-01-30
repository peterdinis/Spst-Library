import { FC } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "@tanstack/react-router";
import { useQuery } from "convex/react";
import { api } from "convex/_generated/api";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Grid, BookOpen, Loader2, Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useState, useMemo } from "react";

const AllCategoriesWrapper: FC = () => {
	const navigate = useNavigate();
	const [searchQuery, setSearchQuery] = useState("");
	const [sortBy, setSortBy] = useState<string>("name_asc");

	// Fetch categories with stats using Convex
	const categoriesData = useQuery(api.categories.getCategoriesWithStats);

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

	// Loading state
	const isLoading = categoriesData === undefined;

	// Filter and sort categories
	const filteredCategories = useMemo(() => {
		if (!categoriesData) return [];

		let result = [...categoriesData];

		// Search
		if (searchQuery.trim()) {
			result = result.filter(
				(c) =>
					c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
					(c.description &&
						c.description.toLowerCase().includes(searchQuery.toLowerCase())),
			);
		}

		// Sort
		result.sort((a, b) => {
			if (sortBy === "name_asc") return a.name.localeCompare(b.name);
			if (sortBy === "name_desc") return b.name.localeCompare(a.name);
			if (sortBy === "books_desc")
				return (b.totalBooks || 0) - (a.totalBooks || 0);
			if (sortBy === "books_asc")
				return (a.totalBooks || 0) - (b.totalBooks || 0);
			return 0;
		});

		return result;
	}, [categoriesData, searchQuery, sortBy]);

	// Early return for loading state MUST be after all hooks
	if (isLoading) {
		return (
			<section className="py-16 bg-linear-to-b from-background to-muted/30">
				<div className="container mx-auto px-4">
					<div className="flex flex-col items-center justify-center py-20">
						<Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
						<h3 className="text-xl font-semibold mb-2">
							Načítavanie kategórií...
						</h3>
						<p className="text-muted-foreground">Prosím čakajte</p>
					</div>
				</div>
			</section>
		);
	}

	// Calculate statistics
	const totalBooksCount =
		categoriesData?.reduce((acc, c) => acc + (c.totalBooks || 0), 0) || 0;
	const availableBooksCount =
		categoriesData?.reduce((acc, c) => acc + (c.availableBooks || 0), 0) || 0;

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
								Kategórie kníh
							</h1>
						</div>
						<div className="flex-1 flex justify-end" />
					</div>
					<p className="text-lg text-muted-foreground max-w-2xl mx-auto">
						Preskúmajte našu zbierku kníh podľa kategórií. Vyberte si z{" "}
						{categoriesData?.length || 0} kategórií a {totalBooksCount} kníh.
					</p>
				</motion.div>

				{/* Search and Filters */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: 0.1 }}
					className="max-w-4xl mx-auto mb-10"
				>
					<div className="flex flex-col md:flex-row gap-4">
						<div className="relative flex-1">
							<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
							<Input
								placeholder="Hľadať kategórie..."
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								className="pl-10 h-12 bg-background/50 border-border/50 rounded-xl"
							/>
							{searchQuery && (
								<Button
									variant="ghost"
									size="sm"
									onClick={() => setSearchQuery("")}
									className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
								>
									<X className="h-4 w-4" />
								</Button>
							)}
						</div>

						<Select value={sortBy} onValueChange={setSortBy}>
							<SelectTrigger className="w-full md:w-56 h-12 bg-background/50 border-border/50 rounded-xl">
								<SelectValue placeholder="Zoradiť podľa" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="name_asc">Názov (A-Z)</SelectItem>
								<SelectItem value="name_desc">Názov (Z-A)</SelectItem>
								<SelectItem value="books_desc">Počet kníh (najviac)</SelectItem>
								<SelectItem value="books_asc">Počet kníh (najmenej)</SelectItem>
							</SelectContent>
						</Select>
					</div>

					<div className="mt-4 text-center text-sm text-muted-foreground">
						{filteredCategories.length === 0 ? (
							"Nenašli sa žiadne kategórie"
						) : (
							<>
								Nájdených {filteredCategories.length}{" "}
								{filteredCategories.length === 1
									? "kategória"
									: filteredCategories.length >= 2 &&
										filteredCategories.length <= 4
										? "kategórie"
										: "kategórií"}
							</>
						)}
					</div>
				</motion.div>

				{/* Categories Content */}
				{filteredCategories.length === 0 ? (
					<motion.div
						initial={{ opacity: 0, scale: 0.9 }}
						animate={{ opacity: 1, scale: 1 }}
						className="text-center py-16"
					>
						<div className="mx-auto max-w-md">
							<div className="rounded-full bg-muted p-8 w-28 h-28 flex items-center justify-center mx-auto mb-6 shadow-sm border border-border/50">
								<Search className="h-12 w-12 text-muted-foreground/50" />
							</div>
							<h3 className="text-2xl font-bold mb-3">
								{searchQuery
									? "Nenašli sa žiadne kategórie"
									: "Žiadne kategórie"}
							</h3>
							<p className="text-muted-foreground mb-8">
								{searchQuery
									? `Pre hľadaný výraz "${searchQuery}" neexistujú žiadne kategórie.`
									: "V knižnici sa momentálne nenachádzajú žiadne kategórie."}
							</p>
							{searchQuery && (
								<Button
									variant="outline"
									onClick={() => setSearchQuery("")}
									className="rounded-xl px-6"
								>
									<X className="mr-2 h-4 w-4" />
									Zmazať hľadanie
								</Button>
							)}
						</div>
					</motion.div>
				) : (
					<motion.div
						variants={containerVariants}
						initial="hidden"
						whileInView="visible"
						className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
					>
						{filteredCategories.map((category: any) => {
							const bookCount = category.totalBooks || 0;
							const availableCount = category.availableBooks || 0;
							const categoryColor = category.color || "#6366f1";

							return (
								<motion.div
									key={category._id}
									variants={itemVariants}
									whileHover={{
										y: -8,
										scale: 1.03,
										transition: { duration: 0.2 },
									}}
									onClick={() =>
										navigate({ to: `/categories/${category._id}` })
									}
									className="cursor-pointer group"
								>
									<Card className="h-full hover:shadow-xl transition-all duration-300 border-border/50">
										<CardHeader className="pb-4">
											<div className="flex items-start justify-between mb-3">
												<div
													className="p-3 rounded-xl shadow-sm"
													style={{
														backgroundColor: `${categoryColor}15`,
														border: `1px solid ${categoryColor}30`,
													}}
												>
													<Grid
														className="h-6 w-6"
														style={{ color: categoryColor }}
													/>
												</div>
												<Badge
													variant="secondary"
													className="font-semibold px-3 py-1"
												>
													{bookCount}{" "}
													{bookCount === 1
														? "kniha"
														: bookCount >= 2 && bookCount <= 4
															? "knihy"
															: "kníh"}
												</Badge>
											</div>
											<CardTitle
												className="text-xl mb-2"
												style={{ color: categoryColor }}
											>
												{category.name}
											</CardTitle>
											<CardDescription className="text-sm line-clamp-3">
												{category.description || "Žiadny popis"}
											</CardDescription>
										</CardHeader>
										<CardContent className="pt-0">
											<div className="flex items-center gap-2 text-xs text-muted-foreground">
												<BookOpen className="h-3.5 w-3.5" />
												<span>
													Kliknite pre zobrazenie kníh v tejto kategórii
												</span>
											</div>

											{bookCount > 0 && (
												<div className="mt-4 pt-3 border-t border-muted">
													<div className="text-xs text-muted-foreground">
														Dostupné knihy:{" "}
														<span className="font-medium text-foreground">
															{availableCount}
														</span>
													</div>
													{category.subcategoryCount > 0 && (
														<div className="text-xs text-muted-foreground mt-1">
															Podkategórie:{" "}
															<span className="font-medium text-foreground">
																{category.subcategoryCount}
															</span>
														</div>
													)}
												</div>
											)}
										</CardContent>
									</Card>
								</motion.div>
							);
						})}
					</motion.div>
				)}

				{/* Stats */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6, delay: 0.4 }}
					className="text-center mt-12"
				>
					<div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto">
						<div className="text-center p-4 rounded-lg border bg-card">
							<div className="text-2xl font-bold text-primary">
								{filteredCategories.length}
							</div>
							<div className="text-sm text-muted-foreground">Kategórií</div>
						</div>
						<div className="text-center p-4 rounded-lg border bg-card">
							<div className="text-2xl font-bold text-green-600">
								{totalBooksCount}
							</div>
							<div className="text-sm text-muted-foreground">Celkom kníh</div>
						</div>
						<div className="text-center p-4 rounded-lg border bg-card">
							<div className="text-2xl font-bold text-purple-600">
								{availableBooksCount}
							</div>
							<div className="text-sm text-muted-foreground">Dostupných</div>
						</div>
						<div className="text-center p-4 rounded-lg border bg-card">
							<div className="text-2xl font-bold text-amber-600">
								{totalBooksCount - availableBooksCount}
							</div>
							<div className="text-sm text-muted-foreground">Vypožičaných</div>
						</div>
					</div>

					{/* Additional Info */}
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ delay: 0.6 }}
						className="mt-8 p-4 bg-muted/30 rounded-lg max-w-lg mx-auto"
					>
						<p className="text-sm text-muted-foreground">
							Naša knižnica ponúka široký výber kníh z rôznych kategórií. Každá
							kategória obsahuje unikátne diela od renomovaných autorov.
						</p>
					</motion.div>
				</motion.div>
			</div>
		</section>
	);
};

export default AllCategoriesWrapper;

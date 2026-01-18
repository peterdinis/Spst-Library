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
import { Grid, BookOpen, Loader2, RefreshCw } from "lucide-react";

interface Category {
	_id: string;
	name: string;
	description?: string;
	color?: string;
	icon?: string;
	bookCount: number;
	subcategoryCount: number;
	isActive: boolean;
}

const AllCategoriesWrapper: FC = () => {
	const navigate = useNavigate();

	// Fetch categories using Convex - bez pagination pre jednoduchosť
	const categoriesData = useQuery(api.categories.getCategories, {
		paginationOpts: { numItems: 100, cursor: null },
		isActive: true,
	});

	// Fetch all books using the correct function
	const booksData = useQuery(api.books.getAll, {});

	// Helper function to generate random colors
	const getRandomColor = () => {
		const colors = [
			"#3B82F6",
			"#8B5CF6",
			"#EF4444",
			"#10B981",
			"#F59E0B",
			"#EC4899",
			"#14B8A6",
			"#6B7280",
		];
		return colors[Math.floor(Math.random() * colors.length)];
	};

	const getCategoryBookCount = (categoryId: string) => {
		if (!booksData) return 0;
		return booksData.filter((book) => book.categoryId === categoryId).length;
	};

	const getAvailableBooksInCategory = (categoryId: string) => {
		if (!booksData) return 0;
		return booksData.filter(
			(book) => book.categoryId === categoryId && book.availableCopies > 0
		).length;
	};

	const getCategoryColor = (category: Category) => {
		return category.color || getRandomColor();
	};

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

	// Calculate statistics
	const totalBooksCount = booksData?.length || 0;
	const availableBooksCount =
		booksData?.filter((b) => b.availableCopies > 0).length || 0;

	// Loading state
	if (categoriesData === undefined || booksData === undefined) {
		return (
			<section className="py-16 bg-gradient-to-b from-background to-muted/30">
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

	const categories = categoriesData?.page || [];

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
					<div className="flex justify-between items-center mb-4">
						<div className="flex-1"></div>
						<div className="flex-1 text-center">
							<h1 className="text-4xl md:text-5xl font-bold tracking-tight">
								Kategórie kníh
							</h1>
						</div>
						<div className="flex-1 flex justify-end">
							<Button
								variant="outline"
								size="icon"
								onClick={() => window.location.reload()}
								className="relative"
							>
								<RefreshCw className="h-4 w-4" />
							</Button>
						</div>
					</div>
					<p className="text-lg text-muted-foreground max-w-2xl mx-auto">
						Preskúmajte našu zbierku kníh podľa kategórií. Vyberte si z{" "}
						{categories.length} kategórií a {totalBooksCount} kníh.
					</p>
				</motion.div>

				{/* Results Count */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: 0.2 }}
					className="mb-8"
				>
					<div className="text-center text-sm text-muted-foreground mt-4">
						{categories.length === 0 ? (
							"Nenašli sa žiadne kategórie"
						) : (
							<>
								Nájdených {categories.length}{" "}
								{categories.length === 1
									? "kategória"
									: categories.length >= 2 && categories.length <= 4
										? "kategórie"
										: "kategórií"}
							</>
						)}
					</div>
				</motion.div>

				{/* Categories Grid */}
				{categories.length === 0 ? (
					<motion.div
						initial={{ opacity: 0, scale: 0.9 }}
						animate={{ opacity: 1, scale: 1 }}
						className="text-center py-12"
					>
						<div className="mx-auto max-w-md">
							<div className="rounded-full bg-muted p-6 w-24 h-24 flex items-center justify-center mx-auto mb-6">
								<Grid className="h-12 w-12 text-muted-foreground" />
							</div>
							<h3 className="text-xl font-semibold mb-2">
								Nenašli sa žiadne kategórie
							</h3>
							<p className="text-muted-foreground mb-6">
								V knižnici sa momentálne nenachádzajú žiadne kategórie.
							</p>
							<Button
								variant="outline"
								onClick={() => window.location.reload()}
							>
								<RefreshCw className="mr-2 h-4 w-4" />
								Skúsiť znova
							</Button>
						</div>
					</motion.div>
				) : (
					<motion.div
						variants={containerVariants}
						initial="hidden"
						whileInView="visible"
						className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
					>
						{categories.map((category) => {
							const bookCount = getCategoryBookCount(category._id);
							const availableCount = getAvailableBooksInCategory(category._id);
							const categoryColor = getCategoryColor(category);

							return (
								<motion.div
									key={category._id}
									variants={itemVariants}
									whileHover={{
										y: -8,
										scale: 1.03,
										transition: { duration: 0.2 },
									}}
									onClick={() => navigate({ to: `/categories/${category._id}` })}
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
								{categories.length}
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
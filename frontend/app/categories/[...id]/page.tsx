"use client";

import { FC, useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { BookOpen, ArrowLeft, Grid } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Category, Book } from "@/lib/types";
import { mockCategories, mockBooks } from "@/lib/mockData";

const CategoryDetailPage: FC = () => {
	const params = useParams();
	const router = useRouter();
	const [category, setCategory] = useState<Category | null>(null);
	const [categoryBooks, setCategoryBooks] = useState<Book[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		loadCategory();
	}, [params.id]);

	const loadCategory = () => {
		const categoryId = Array.isArray(params.id) ? params.id[0] : params.id;
		if (!categoryId) return;

		setIsLoading(true);
		const foundCategory = mockCategories.find((c) => c.id === categoryId);
		const books = mockBooks.filter((b) => b.categoryId === categoryId);

		setCategory(foundCategory || null);
		setCategoryBooks(books);
		setIsLoading(false);
	};

	if (isLoading) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
			</div>
		);
	}

	if (!category) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<Card>
					<CardContent className="p-12 text-center">
						<p className="text-muted-foreground">Kategória nebola nájdená</p>
						<Button onClick={() => router.push("/categories")} className="mt-4">
							Späť na kategórie
						</Button>
					</CardContent>
				</Card>
			</div>
		);
	}

	const stats = {
		total: categoryBooks.length,
		available: categoryBooks.filter((b) => b.availableCopies > 0).length,
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-4 md:p-8">
			<div className="max-w-6xl mx-auto">
				<motion.div
					initial={{ opacity: 0, x: -20 }}
					animate={{ opacity: 1, x: 0 }}
					transition={{ duration: 0.3 }}
				>
					<Button
						variant="ghost"
						className="mb-6"
						onClick={() => router.push("/categories")}
					>
						<ArrowLeft className="mr-2 h-4 w-4" />
						Späť na kategórie
					</Button>
				</motion.div>

				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}
					className="space-y-6"
				>
					{/* Category Header */}
					<Card className="shadow-lg">
						<CardHeader>
							<div className="flex items-start justify-between">
								<div>
									<CardTitle className="text-4xl mb-2">
										{category.name}
									</CardTitle>
									<p className="text-muted-foreground text-lg">
										{category.description}
									</p>
								</div>
								<div className="bg-primary/10 p-4 rounded-full">
									<Grid className="h-8 w-8 text-primary" />
								</div>
							</div>
						</CardHeader>
						<CardContent>
							<div className="grid grid-cols-2 md:grid-cols-3 gap-4">
								<div className="text-center p-4 bg-muted/50 rounded-lg">
									<p className="text-3xl font-bold text-primary">
										{stats.total}
									</p>
									<p className="text-sm text-muted-foreground mt-1">
										Celkom kníh
									</p>
								</div>
								<div className="text-center p-4 bg-muted/50 rounded-lg">
									<p className="text-3xl font-bold text-green-600">
										{stats.available}
									</p>
									<p className="text-sm text-muted-foreground mt-1">
										Dostupných
									</p>
								</div>
								<div className="text-center p-4 bg-muted/50 rounded-lg">
									<p className="text-3xl font-bold text-orange-600">
										{stats.total - stats.available}
									</p>
									<p className="text-sm text-muted-foreground mt-1">
										Vypožičaných
									</p>
								</div>
							</div>
						</CardContent>
					</Card>

					{/* Books in Category */}
					<Card className="shadow-lg">
						<CardHeader>
							<CardTitle className="text-2xl flex items-center gap-2">
								<BookOpen className="h-6 w-6" />
								Knihy v kategórii
							</CardTitle>
						</CardHeader>
						<CardContent>
							{categoryBooks.length === 0 ? (
								<p className="text-muted-foreground text-center py-12">
									Žiadne knihy v tejto kategórii
								</p>
							) : (
								<div className="grid md:grid-cols-2 gap-4">
									{categoryBooks.map((book, index) => (
										<motion.div
											key={book.id}
											initial={{ opacity: 0, y: 20 }}
											animate={{ opacity: 1, y: 0 }}
											transition={{ delay: index * 0.05 }}
										>
											<Card
												className="cursor-pointer hover:shadow-md transition-shadow h-full"
												onClick={() => router.push(`/books/${book.id}`)}
											>
												<CardContent className="p-4">
													<div className="flex gap-4">
														{book.coverUrl && (
															<img
																src={book.coverUrl}
																alt={book.title}
																className="w-20 h-28 object-cover rounded"
															/>
														)}
														<div className="flex-1">
															<h3 className="font-semibold text-lg mb-1">
																{book.title}
															</h3>
															<p className="text-sm text-muted-foreground mb-2">
																{book.authorName}
															</p>
															<p className="text-sm text-muted-foreground mb-2 line-clamp-2">
																{book.description}
															</p>
															<div className="flex items-center gap-2">
																<Badge
																	variant={
																		book.availableCopies > 0
																			? "success"
																			: "destructive"
																	}
																>
																	{book.availableCopies > 0
																		? `Dostupné: ${book.availableCopies}`
																		: "Nedostupné"}
																</Badge>
																<span className="text-xs text-muted-foreground">
																	{book.publishedYear}
																</span>
															</div>
														</div>
													</div>
												</CardContent>
											</Card>
										</motion.div>
									))}
								</div>
							)}
						</CardContent>
					</Card>
				</motion.div>
			</div>
		</div>
	);
};

export default CategoryDetailPage;

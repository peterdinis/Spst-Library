"use client";

import { FC, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Grid, BookOpen } from "lucide-react";
import { Category } from "@/lib/types";
import { mockCategories, mockBooks } from "@/lib/mockData";

const CategoriesWrapper: FC = () => {
	const router = useRouter();
	const [categories, setCategories] = useState<Category[]>([]);

	useEffect(() => {
		setCategories(mockCategories);
	}, []);

	const getCategoryBookCount = (categoryId: string) => {
		return mockBooks.filter((book) => book.categoryId === categoryId).length;
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
						Kategórie kníh
					</h1>
					<p className="text-lg text-muted-foreground max-w-2xl mx-auto">
						Preskúmajte našu zbierku kníh podľa kategórií
					</p>
				</motion.div>

				{/* Categories Grid */}
				<motion.div
					variants={containerVariants}
					initial="hidden"
					whileInView="visible"
					className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
				>
					{categories.map((category) => (
						<motion.div
							key={category.id}
							variants={itemVariants}
							whileHover={{ y: -5, scale: 1.02 }}
							transition={{ duration: 0.2 }}
							onClick={() => router.push(`/categories/${category.id}`)}
							className="cursor-pointer"
						>
							<Card className="h-full hover:shadow-lg transition-all duration-300">
								<CardHeader>
									<div className="flex items-start justify-between mb-2">
										<div className="bg-primary/10 p-3 rounded-full">
											<Grid className="h-6 w-6 text-primary" />
										</div>
										<Badge variant="secondary">
											{getCategoryBookCount(category.id)} kníh
										</Badge>
									</div>
									<CardTitle className="text-2xl">{category.name}</CardTitle>
									<CardDescription className="text-base line-clamp-3">
										{category.description}
									</CardDescription>
								</CardHeader>
								<CardContent>
									<div className="flex items-center gap-2 text-sm text-muted-foreground">
										<BookOpen className="h-4 w-4" />
										<span>Kliknite pre zobrazenie kníh</span>
									</div>
								</CardContent>
							</Card>
						</motion.div>
					))}
				</motion.div>

				{/* Stats */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6, delay: 0.4 }}
					className="text-center mt-12"
				>
					<div className="grid grid-cols-2 md:grid-cols-3 gap-6 max-w-xl mx-auto">
						<div className="text-center">
							<div className="text-2xl font-bold text-primary">
								{categories.length}
							</div>
							<div className="text-sm text-muted-foreground">Kategórií</div>
						</div>
						<div className="text-center">
							<div className="text-2xl font-bold text-green-600">
								{mockBooks.length}
							</div>
							<div className="text-sm text-muted-foreground">Celkom kníh</div>
						</div>
						<div className="text-center">
							<div className="text-2xl font-bold text-purple-600">
								{mockBooks.filter((b) => b.availableCopies > 0).length}
							</div>
							<div className="text-sm text-muted-foreground">Dostupných</div>
						</div>
					</div>
				</motion.div>
			</div>
		</section>
	);
};

export default CategoriesWrapper;

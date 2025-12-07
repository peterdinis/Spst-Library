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
import { User, BookOpen, MapPin } from "lucide-react";
import { Author } from "@/lib/types";
import { mockAuthors, mockBooks } from "@/lib/mockData";

const AuthorsWrapper: FC = () => {
	const router = useRouter();
	const [authors, setAuthors] = useState<Author[]>([]);

	useEffect(() => {
		setAuthors(mockAuthors);
	}, []);

	const getAuthorBookCount = (authorId: string) => {
		return mockBooks.filter((book) => book.authorId === authorId).length;
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
						Naši autori
					</h1>
					<p className="text-lg text-muted-foreground max-w-2xl mx-auto">
						Spoznajte autorov kníh v našej knižnici
					</p>
				</motion.div>

				{/* Authors Grid */}
				<motion.div
					variants={containerVariants}
					initial="hidden"
					whileInView="visible"
					className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
				>
					{authors.map((author) => (
						<motion.div
							key={author.id}
							variants={itemVariants}
							whileHover={{ y: -5, scale: 1.02 }}
							transition={{ duration: 0.2 }}
							onClick={() => router.push(`/authors/${author.id}`)}
							className="cursor-pointer"
						>
							<Card className="h-full hover:shadow-lg transition-all duration-300">
								<CardHeader>
									<div className="flex items-start gap-4 mb-3">
										{author.photoUrl ? (
											<img
												src={author.photoUrl}
												alt={author.name}
												className="w-16 h-16 rounded-full object-cover"
											/>
										) : (
											<div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
												<User className="h-8 w-8 text-white" />
											</div>
										)}
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
										{author.biography}
									</CardDescription>
								</CardHeader>
								<CardContent>
									<div className="flex items-center justify-between">
										<div className="flex items-center gap-2 text-sm text-muted-foreground">
											<BookOpen className="h-4 w-4" />
											<span>{getAuthorBookCount(author.id)} kníh</span>
										</div>
										<Badge variant="secondary">Zobraziť profil</Badge>
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
								{authors.length}
							</div>
							<div className="text-sm text-muted-foreground">Autorov</div>
						</div>
						<div className="text-center">
							<div className="text-2xl font-bold text-green-600">
								{mockBooks.length}
							</div>
							<div className="text-sm text-muted-foreground">Celkom kníh</div>
						</div>
						<div className="text-center">
							<div className="text-2xl font-bold text-purple-600">
								{new Set(mockBooks.map((b) => b.categoryName)).size}
							</div>
							<div className="text-sm text-muted-foreground">Kategórií</div>
						</div>
					</div>
				</motion.div>
			</div>
		</section>
	);
};

export default AuthorsWrapper;

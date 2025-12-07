"use client";

import { FC, useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { User, BookOpen, Calendar, MapPin, ArrowLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Author, Book } from "@/lib/types";
import { mockAuthors, mockBooks } from "@/lib/mockData";

const AuthorDetailPage: FC = () => {
	const params = useParams();
	const router = useRouter();
	const [author, setAuthor] = useState<Author | null>(null);
	const [authorBooks, setAuthorBooks] = useState<Book[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		loadAuthor();
	}, [params.id]);

	const loadAuthor = () => {
		const authorId = Array.isArray(params.id) ? params.id[0] : params.id;
		if (!authorId) return;

		setIsLoading(true);
		const foundAuthor = mockAuthors.find((a) => a.id === authorId);
		const books = mockBooks.filter((b) => b.authorId === authorId);

		setAuthor(foundAuthor || null);
		setAuthorBooks(books);
		setIsLoading(false);
	};

	if (isLoading) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
			</div>
		);
	}

	if (!author) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<Card>
					<CardContent className="p-12 text-center">
						<p className="text-muted-foreground">Autor nebol nájdený</p>
						<Button onClick={() => router.push("/authors")} className="mt-4">
							Späť na autorov
						</Button>
					</CardContent>
				</Card>
			</div>
		);
	}

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
						onClick={() => router.push("/authors")}
					>
						<ArrowLeft className="mr-2 h-4 w-4" />
						Späť na zoznam
					</Button>
				</motion.div>

				<div className="grid md:grid-cols-3 gap-8">
					{/* Author Info Card */}
					<motion.div
						className="md:col-span-1"
						initial={{ opacity: 0, y: 30 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5, delay: 0.1 }}
					>
						<Card className="shadow-lg">
							{author.photoUrl ? (
								<img
									src={author.photoUrl}
									alt={author.name}
									className="w-full h-80 object-cover"
								/>
							) : (
								<div className="bg-gradient-to-br from-blue-600 to-purple-600 h-80 flex items-center justify-center">
									<User className="h-32 w-32 text-white opacity-50" />
								</div>
							)}
							<CardContent className="p-6 space-y-4">
								<div>
									<h1 className="text-2xl font-bold mb-2">{author.name}</h1>
									{author.nationality && (
										<div className="flex items-center gap-2 text-muted-foreground">
											<MapPin className="h-4 w-4" />
											<span>{author.nationality}</span>
										</div>
									)}
								</div>

								{author.birthDate && (
									<div className="flex items-center gap-2 text-sm text-muted-foreground">
										<Calendar className="h-4 w-4" />
										<span>
											Narodený:{" "}
											{new Date(author.birthDate).toLocaleDateString("sk-SK", {
												year: "numeric",
												month: "long",
												day: "numeric",
											})}
										</span>
									</div>
								)}

								<div className="pt-4 border-t">
									<div className="flex items-center justify-between">
										<span className="text-sm text-muted-foreground">
											Počet kníh
										</span>
										<Badge variant="secondary">{authorBooks.length}</Badge>
									</div>
								</div>
							</CardContent>
						</Card>
					</motion.div>

					{/* Biography and Books */}
					<motion.div
						className="md:col-span-2 space-y-6"
						initial={{ opacity: 0, y: 30 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5, delay: 0.2 }}
					>
						<Card className="shadow-lg">
							<CardHeader>
								<CardTitle className="text-2xl">Biografia</CardTitle>
							</CardHeader>
							<CardContent>
								<p className="text-muted-foreground leading-relaxed whitespace-pre-line">
									{author.biography}
								</p>
							</CardContent>
						</Card>

						<Card className="shadow-lg">
							<CardHeader>
								<CardTitle className="text-2xl flex items-center gap-2">
									<BookOpen className="h-6 w-6" />
									Knihy autora
								</CardTitle>
							</CardHeader>
							<CardContent>
								{authorBooks.length === 0 ? (
									<p className="text-muted-foreground text-center py-8">
										Žiadne knihy tohto autora v knižnici
									</p>
								) : (
									<div className="grid gap-4">
										{authorBooks.map((book, index) => (
											<motion.div
												key={book.id}
												initial={{ opacity: 0, x: -20 }}
												animate={{ opacity: 1, x: 0 }}
												transition={{ delay: index * 0.1 }}
											>
												<Card
													className="cursor-pointer hover:shadow-md transition-shadow"
													onClick={() => router.push(`/books/${book.id}`)}
												>
													<CardContent className="p-4">
														<div className="flex gap-4">
															{book.coverUrl && (
																<img
																	src={book.coverUrl}
																	alt={book.title}
																	className="w-16 h-24 object-cover rounded"
																/>
															)}
															<div className="flex-1">
																<h3 className="font-semibold text-lg mb-1">
																	{book.title}
																</h3>
																<p className="text-sm text-muted-foreground mb-2 line-clamp-2">
																	{book.description}
																</p>
																<div className="flex items-center gap-2">
																	<Badge variant="secondary">
																		{book.categoryName}
																	</Badge>
																	<Badge
																		variant={
																			book.availableCopies > 0
																				? "success"
																				: "destructive"
																		}
																	>
																		{book.availableCopies > 0
																			? "Dostupné"
																			: "Nedostupné"}
																	</Badge>
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
		</div>
	);
};

export default AuthorDetailPage;

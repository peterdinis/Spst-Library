import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion, Variants } from "framer-motion";
import {
	CalendarDays,
	BookOpen,
	Globe,
	Building,
	MapPin,
	Tag,
	User,
	Folder,
	Copy,
	AlertCircle,
	ArrowLeft,
} from "lucide-react";
import { useNavigate } from "@tanstack/react-router";

export const Route = createFileRoute("/books/$bookId")({
	component: BookDetailPage,
});

function BookDetailPage() {
	const { bookId } = Route.useParams();
	const navigate = useNavigate();

	const book = useQuery(api.books.getById, { id: bookId as Id<"books"> });

	console.log("Book detail page rendered with book:", book);

	const containerVariants = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: {
				staggerChildren: 0.1,
				delayChildren: 0.2,
			},
		},
	};

	const itemVariants = {
		hidden: { y: 20, opacity: 0 },
		visible: {
			y: 0,
			opacity: 1,
			transition: {
				type: "spring",
				stiffness: 100,
			},
		},
	};

	if (book === undefined) {
		return (
			<div className="container mx-auto px-4 py-8">
				<div className="max-w-4xl mx-auto">
					<Skeleton className="h-8 w-48 mb-6" />
					<div className="grid md:grid-cols-3 gap-8">
						<div className="md:col-span-1">
							<Skeleton className="h-100 w-full rounded-lg" />
						</div>
						<div className="md:col-span-2 space-y-4">
							<Skeleton className="h-10 w-3/4" />
							<Skeleton className="h-6 w-1/2" />
							<Skeleton className="h-4 w-full" />
							<Skeleton className="h-4 w-5/6" />
							<Skeleton className="h-4 w-4/6" />
							<div className="space-y-2 pt-4">
								<Skeleton className="h-6 w-32" />
								<Skeleton className="h-8 w-24" />
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}

	if (!book) {
		return (
			<div className="container mx-auto px-4 py-8">
				<motion.div
					initial={{ opacity: 0, scale: 0.95 }}
					animate={{ opacity: 1, scale: 1 }}
					className="max-w-md mx-auto text-center"
				>
					<AlertCircle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
					<h2 className="text-2xl font-bold mb-2">Kniha nebola nájdená</h2>
					<p className="text-muted-foreground mb-6">
						Požadovaná kniha neexistuje alebo bola odstránená.
					</p>
					<Button onClick={() => navigate({ to: "/books" })}>
						Späť na zoznam kníh
					</Button>
				</motion.div>
			</div>
		);
	}

	const statusColors = {
		available: "bg-green-100 text-green-800 hover:bg-green-100",
		reserved: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
		maintenance: "bg-blue-100 text-blue-800 hover:bg-blue-100",
		lost: "bg-red-100 text-red-800 hover:bg-red-100",
	};

	const statusLabels = {
		available: "Dostupná",
		reserved: "Rezervovaná",
		maintenance: "V údržbe",
		lost: "Stratená",
	};

	return (
		<div className="container mx-auto px-4 py-8">
			<motion.div
				variants={containerVariants}
				initial="hidden"
				animate="visible"
				className="max-w-6xl mx-auto"
			>
				{/* Header s navigáciou späť */}
				<motion.div
					variants={itemVariants as unknown as Variants}
					className="mb-6"
				>
					<Button
						variant="ghost"
						onClick={() => navigate({ to: "/books" })}
						className="mb-4"
					>
						<ArrowLeft className="mr-2 h-4 w-4" />
						Späť na zoznam kníh
					</Button>
				</motion.div>

				<div className="grid lg:grid-cols-3 gap-8">
					{/* Ľavý stĺpec - Obrázok a základné info */}
					<motion.div
						variants={itemVariants as unknown as Variants}
						className="lg:col-span-1"
					>
						<Card className="overflow-hidden">
							<div className="aspect-3/4 relative bg-linear-to-br from-muted/50 to-muted">
								{book.coverFileId ? (
									<div className="w-full h-full flex items-center justify-center">
										<img loading="lazy" src={book.coverFile?.url!} />
									</div>
								) : (
									<div className="w-full h-full flex items-center justify-center">
										<BookOpen className="h-24 w-24 text-muted-foreground/50" />
									</div>
								)}
								<div className="absolute top-4 right-4">
									<Badge
										className={`${statusColors[book.status]
											} font-semibold px-3 py-1`}
									>
										{statusLabels[book.status]}
									</Badge>
								</div>
							</div>

							<CardContent className="p-6">
								<div className="space-y-4">
									{/* Informácie o dostupnosti */}
									<div className="grid grid-cols-2 gap-4">
										<div className="text-center p-3 bg-muted rounded-lg">
											<p className="text-sm text-muted-foreground">Celkovo</p>
											<p className="text-2xl font-bold">{book.totalCopies}</p>
											<p className="text-xs text-muted-foreground">výtlačkov</p>
										</div>
										<div className="text-center p-3 bg-green-50 rounded-lg">
											<p className="text-sm text-muted-foreground">
												Dostupných
											</p>
											<p className="text-2xl font-bold text-green-600">
												{book.availableCopies}
											</p>
											<p className="text-xs text-muted-foreground">výtlačkov</p>
										</div>
									</div>

									{/* Rýchle akcie */}
									{book.availableCopies > 0 && book.status === "available" && (
										<motion.div
											initial={{ opacity: 0, y: 10 }}
											animate={{ opacity: 1, y: 0 }}
											transition={{ delay: 0.5 }}
										>
											<Button size="lg" className="w-full">
												Rezervovať knihu
											</Button>
										</motion.div>
									)}

									<Separator />

									{/* Tagy */}
									{book.tags && book.tags.length > 0 && (
										<div>
											<h4 className="text-sm font-medium mb-2 flex items-center gap-2">
												<Tag className="h-4 w-4" />
												Štítky
											</h4>
											<div className="flex flex-wrap gap-2">
												{book.tags.map((tag, index) => (
													<Badge
														key={index}
														variant="secondary"
														className="font-normal"
													>
														{tag}
													</Badge>
												))}
											</div>
										</div>
									)}

									{/* Lokácia */}
									{book.location && (
										<div>
											<h4 className="text-sm font-medium mb-2 flex items-center gap-2">
												<MapPin className="h-4 w-4" />
												Umiestnenie
											</h4>
											<p className="text-sm">{book.location}</p>
										</div>
									)}
								</div>
							</CardContent>
						</Card>
					</motion.div>

					{/* Pravý stĺpec - Podrobnosti */}
					<motion.div
						variants={itemVariants as unknown as Variants}
						className="lg:col-span-2 space-y-6"
					>
						{/* Hlavný nadpis a autor */}
						<Card>
							<CardHeader>
								<motion.div
									initial={{ opacity: 0, y: -10 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ delay: 0.2 }}
								>
									<CardTitle className="text-3xl md:text-4xl font-bold tracking-tight">
										{book.title}
									</CardTitle>
									<CardDescription className="text-lg pt-2">
										<div className="flex items-center gap-2">
											<User className="h-4 w-4" />
											<span className="hover:text-primary cursor-pointer transition-colors">
												{book.author.name}
											</span>
										</div>
									</CardDescription>
								</motion.div>
							</CardHeader>
						</Card>

						{/* Taby */}
						<Tabs defaultValue="details" className="w-full">
							<TabsList className="grid w-full grid-cols-3">
								<TabsTrigger value="details">Detaily</TabsTrigger>
								<TabsTrigger value="description">Popis</TabsTrigger>
								<TabsTrigger value="additional">Ďalšie informácie</TabsTrigger>
							</TabsList>

							<TabsContent value="details" className="space-y-4 pt-4">
								<Card>
									<CardContent className="pt-6">
										<div className="grid md:grid-cols-2 gap-6">
											<div className="space-y-4">
												<InfoItem
													icon={<CalendarDays />}
													label="Rok vydania"
													value={book.publishedYear?.toString() || "Neznámy"}
												/>
												<InfoItem
													icon={<Building />}
													label="Vydavateľ"
													value={book.publisher || "Neznámy"}
												/>
												<InfoItem
													icon={<BookOpen />}
													label="Počet strán"
													value={book.pages?.toString() || "Neznámy"}
												/>
											</div>
											<div className="space-y-4">
												<InfoItem
													icon={<Globe />}
													label="Jazyk"
													value={book.language || "Neznámy"}
												/>
												<InfoItem
													icon={<Copy />}
													label="ISBN"
													value={book.isbn || "Neznáme"}
												/>
												<InfoItem
													icon={<Folder />}
													label="Kategória"
													value={
														<Badge
															variant="outline"
															className="font-normal cursor-pointer hover:bg-muted"
														>
															{book.category.name}
														</Badge>
													}
												/>
											</div>
										</div>
									</CardContent>
								</Card>
							</TabsContent>

							<TabsContent value="description" className="pt-4">
								<Card>
									<CardContent className="pt-6">
										<motion.div
											initial={{ opacity: 0 }}
											animate={{ opacity: 1 }}
											transition={{ delay: 0.1 }}
											className="prose prose-sm max-w-none dark:prose-invert"
										>
											{book.description ? (
												<p className="whitespace-pre-line">
													{book.description}
												</p>
											) : (
												<p className="text-muted-foreground italic">
													Táto kniha nemá popis.
												</p>
											)}
										</motion.div>
									</CardContent>
								</Card>
							</TabsContent>

							<TabsContent value="additional" className="pt-4">
								<Card>
									<CardContent className="pt-6">
										<div className="space-y-4">
											<div>
												<h4 className="font-medium mb-2">ID záznamu</h4>
												<code className="text-sm bg-muted px-2 py-1 rounded">
													{book._id}
												</code>
											</div>
											<div>
												<h4 className="font-medium mb-2">Dátum pridania</h4>
												<p className="text-sm">
													{new Date(book.addedAt).toLocaleDateString("sk-SK", {
														day: "2-digit",
														month: "2-digit",
														year: "numeric",
														hour: "2-digit",
														minute: "2-digit",
													})}
												</p>
											</div>
											<div>
												<h4 className="font-medium mb-2">
													Počet kníh od autora
												</h4>
												<p className="text-sm">{book.author.bookCount}</p>
											</div>
											<div>
												<h4 className="font-medium mb-2">
													Počet kníh v kategórii
												</h4>
												<p className="text-sm">{book.category.bookCount}</p>
											</div>
										</div>
									</CardContent>
								</Card>
							</TabsContent>
						</Tabs>

						{/* Statistiky */}
						<motion.div
							variants={itemVariants as unknown as Variants}
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ delay: 0.4 }}
						>
							<Card>
								<CardHeader>
									<CardTitle className="text-lg">Štatistiky</CardTitle>
								</CardHeader>
								<CardContent>
									<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
										<StatItem
											label="Celkový počet"
											value={book.totalCopies}
											color="text-blue-600"
										/>
										<StatItem
											label="Dostupné"
											value={book.availableCopies}
											color="text-green-600"
										/>
										<StatItem
											label="Vypožičané"
											value={book.totalCopies - book.availableCopies}
											color="text-yellow-600"
										/>
										<StatItem
											label="Percento dostupnosti"
											value={`${Math.round(
												(book.availableCopies / book.totalCopies) * 100,
											)}%`}
											color="text-purple-600"
										/>
									</div>
								</CardContent>
							</Card>
						</motion.div>
					</motion.div>
				</div>
			</motion.div>
		</div>
	);
}

interface InfoItemProps {
	icon: React.ReactNode;
	label: string;
	value: React.ReactNode;
}

function InfoItem({ icon, label, value }: InfoItemProps) {
	return (
		<div className="flex items-start gap-3">
			<div className="text-muted-foreground mt-0.5">{icon}</div>
			<div>
				<p className="text-sm font-medium">{label}</p>
				<p className="text-sm">{value}</p>
			</div>
		</div>
	);
}

interface StatItemProps {
	label: string;
	value: string | number;
	color: string;
}

function StatItem({ label, value, color }: StatItemProps) {
	return (
		<div className="text-center">
			<p className={`text-2xl font-bold ${color}`}>{value}</p>
			<p className="text-sm text-muted-foreground">{label}</p>
		</div>
	);
}

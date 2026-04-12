"use client";

import { trpc } from "@/trpc/client";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useMemo } from "react";
import { Input } from "@/components/ui/input";
import {
	Search,
	ChevronLeft,
	ChevronRight,
	BookOpen,
	ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

const ITEMS_PER_PAGE = 8;

export function BookCatalog() {
	const [searchQuery, setSearchQuery] = useState("");
	const [debouncedSearch, setDebouncedSearch] = useState("");
	const [selectedAuthor, setSelectedAuthor] = useState<string>("all");
	const [selectedCategory, setSelectedCategory] = useState<string>("all");
	const [tempAuthor, setTempAuthor] = useState<string>("all");
	const [tempCategory, setTempCategory] = useState<string>("all");
	const [currentPage, setCurrentPage] = useState(1);

	// Debounce search
	useEffect(() => {
		const timer = setTimeout(() => setDebouncedSearch(searchQuery), 500);
		return () => clearTimeout(timer);
	}, [searchQuery]);

	const { data: authors } = trpc.authors.getAll.useQuery();
	const { data: categories } = trpc.categories.getAll.useQuery();

	const authorNameForQuery =
		selectedAuthor === "all"
			? undefined
			: authors?.find((a) => a.id === selectedAuthor)?.name;

	const { data, isLoading } = trpc.books.getAll.useQuery({
		search: debouncedSearch || undefined,
		authorName: authorNameForQuery,
		categoryId: selectedCategory === "all" ? undefined : selectedCategory,
		limit: ITEMS_PER_PAGE,
		offset: (currentPage - 1) * ITEMS_PER_PAGE,
	});

	const books = data?.items || [];
	const totalItems = data?.total || 0;
	const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

	const rangeLabel = useMemo(() => {
		if (totalItems === 0) return null;
		const from = (currentPage - 1) * ITEMS_PER_PAGE + 1;
		const to = Math.min(currentPage * ITEMS_PER_PAGE, totalItems);
		return `${from}–${to} z ${totalItems}`;
	}, [currentPage, totalItems]);

	const visiblePages = useMemo(() => {
		if (totalPages <= 1) return [] as number[];
		if (totalPages <= 7) {
			return Array.from({ length: totalPages }, (_, i) => i + 1);
		}
		const s = new Set<number>([1, totalPages]);
		for (let i = currentPage - 1; i <= currentPage + 1; i++) {
			if (i >= 1 && i <= totalPages) s.add(i);
		}
		return [...s].sort((a, b) => a - b);
	}, [totalPages, currentPage]);

	if (isLoading)
		return (
			<div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-8">
				{[...Array(4)].map((_, i) => (
					<div
						key={i}
						className="h-[400px] bg-slate-200/50 dark:bg-slate-800/50 animate-pulse rounded-3xl"
					/>
				))}
			</div>
		);

	return (
		<div className="space-y-12">
			{/* Filtre a Vyhľadávanie */}
			<div className="space-y-8">
				<div className="relative max-w-4xl mx-auto group">
					<div className="absolute -inset-1 bg-gradient-to-r from-violet-500/20 via-purple-500/20 to-violet-500/20 rounded-[2.5rem] blur-2xl opacity-20 group-hover:opacity-100 transition duration-1000" />
					<div className="relative flex items-center bg-white/80 dark:bg-slate-950/80 backdrop-blur-2xl rounded-[2rem] border border-slate-200/50 dark:border-slate-800/50 shadow-2xl pl-8 pr-3 py-3">
						<Search className="h-6 w-6 text-violet-500 mr-4" />
						<Input
							value={searchQuery}
							onChange={(e) => {
								setSearchQuery(e.target.value);
								setCurrentPage(1);
							}}
							placeholder="Hľadať v tisíckach príbehov..."
							className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent text-xl shadow-none flex-1 font-medium placeholder:text-slate-400"
						/>
						<div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-violet-50 dark:bg-violet-900/30 text-violet-600 rounded-2xl border border-violet-100/50 dark:border-violet-800/30">
							<span className="text-xs font-black uppercase tracking-widest">
								Katalóg
							</span>
						</div>
					</div>
				</div>

				<div className="flex flex-col items-center gap-6">
					<div className="flex flex-wrap items-center justify-center gap-4 p-2 bg-slate-50/50 dark:bg-slate-900/50 rounded-3xl border border-slate-200/50 dark:border-slate-800/50 backdrop-blur-sm">
						<Select
							value={tempAuthor}
							onValueChange={(val: string | null) =>
								setTempAuthor(val || "all")
							}
						>
							<SelectTrigger className="w-[220px] h-12 rounded-2xl border-none bg-white dark:bg-slate-950 shadow-sm font-bold text-slate-600">
								<SelectValue placeholder="Všetci autori">
									{(value) => {
										const v = value as string | null | undefined;
										if (v == null || v === "" || v === "all") {
											return "Všetci autori";
										}
										return authors?.find((a) => a.id === v)?.name ?? v;
									}}
								</SelectValue>
							</SelectTrigger>
							<SelectContent className="rounded-2xl shadow-2xl border-slate-200/50">
								<SelectItem value="all" className="rounded-xl">
									Všetci autori
								</SelectItem>
								{authors?.map((a) => (
									<SelectItem key={a.id} value={a.id} className="rounded-xl">
										{a.name}
									</SelectItem>
								))}
							</SelectContent>
						</Select>

						<div className="h-6 w-[1px] bg-slate-200 dark:bg-slate-800 hidden md:block" />

						<Select
							value={tempCategory}
							onValueChange={(val: string | null) =>
								setTempCategory(val || "all")
							}
						>
							<SelectTrigger className="w-[220px] h-12 rounded-2xl border-none bg-white dark:bg-slate-950 shadow-sm font-bold text-slate-600">
								<SelectValue placeholder="Všetky kategórie">
									{(value) => {
										const v = value as string | null | undefined;
										if (v == null || v === "" || v === "all") {
											return "Všetky kategórie";
										}
										return categories?.find((c) => c.id === v)?.name ?? v;
									}}
								</SelectValue>
							</SelectTrigger>
							<SelectContent className="rounded-2xl shadow-2xl border-slate-200/50">
								<SelectItem value="all" className="rounded-xl">
									Všetky kategórie
								</SelectItem>
								{categories?.map((c) => (
									<SelectItem key={c.id} value={c.id} className="rounded-xl">
										{c.name}
									</SelectItem>
								))}
							</SelectContent>
						</Select>

						<Button
							onClick={() => {
								setSelectedAuthor(tempAuthor);
								setSelectedCategory(tempCategory);
								setCurrentPage(1);
							}}
							disabled={
								tempAuthor === selectedAuthor &&
								tempCategory === selectedCategory
							}
							className="rounded-2xl h-12 px-8 bg-violet-600 hover:bg-violet-700 text-white font-bold transition-all shadow-lg hover:shadow-violet-500/25 border-none"
						>
							Použiť filtre
						</Button>
					</div>

					{/* Active Filters Pills */}
					<AnimatePresence>
						{(selectedAuthor !== "all" ||
							selectedCategory !== "all" ||
							searchQuery) && (
							<motion.div
								initial={{ opacity: 0, y: -10 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: -10 }}
								className="flex flex-wrap items-center justify-center gap-2"
							>
								{searchQuery && (
									<Badge
										variant="secondary"
										className="pl-3 pr-1 py-1 gap-1 rounded-full bg-violet-50 border-violet-100 text-violet-600 hover:bg-violet-100 transition-colors"
									>
										<span className="text-[10px] font-bold uppercase tracking-tight opacity-50">
											Hľadať:
										</span>
										{searchQuery}
										<button
											onClick={() => setSearchQuery("")}
											className="hover:bg-violet-200 rounded-full p-0.5 ml-1"
										>
											<ChevronRight className="h-3 w-3 rotate-45 transform" />
										</button>
									</Badge>
								)}
								{selectedAuthor !== "all" && authorNameForQuery && (
									<Badge
										variant="secondary"
										className="pl-3 pr-1 py-1 gap-1 rounded-full bg-emerald-50 border-emerald-100 text-emerald-600 hover:bg-emerald-100 transition-colors"
									>
										<span className="text-[10px] font-bold uppercase tracking-tight opacity-50">
											Autor:
										</span>
										{authorNameForQuery}
										<button
											onClick={() => {
												setSelectedAuthor("all");
												setTempAuthor("all");
											}}
											className="hover:bg-emerald-200 rounded-full p-0.5 ml-1"
										>
											<ChevronRight className="h-3 w-3 rotate-45 transform" />
										</button>
									</Badge>
								)}
								{selectedCategory !== "all" && (
									<Badge
										variant="secondary"
										className="pl-3 pr-1 py-1 gap-1 rounded-full bg-purple-50 border-purple-100 text-purple-600 hover:bg-purple-100 transition-colors"
									>
										<span className="text-[10px] font-bold uppercase tracking-tight opacity-50">
											Kategória:
										</span>
										{categories?.find((c) => c.id === selectedCategory)?.name}
										<button
											onClick={() => {
												setSelectedCategory("all");
												setTempCategory("all");
											}}
											className="hover:bg-purple-200 rounded-full p-0.5 ml-1"
										>
											<ChevronRight className="h-3 w-3 rotate-45 transform" />
										</button>
									</Badge>
								)}
								<Button
									variant="ghost"
									size="sm"
									onClick={() => {
										setSearchQuery("");
										setSelectedAuthor("all");
										setSelectedCategory("all");
										setTempAuthor("all");
										setTempCategory("all");
										setCurrentPage(1);
									}}
									className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-rose-500"
								>
									Vymazať všetko
								</Button>
							</motion.div>
						)}
					</AnimatePresence>
				</div>
			</div>

			{rangeLabel && (
				<p className="text-center text-sm font-medium text-slate-500 dark:text-slate-400">
					Zobrazené knihy: <span className="font-semibold text-slate-700 dark:text-slate-200">{rangeLabel}</span>
				</p>
			)}

			{/* Zoznam Kníh */}
			{books.length > 0 ? (
				<motion.div
					layout
					className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8"
				>
					<AnimatePresence mode="popLayout">
						{books.map((book, index) => (
							<motion.div
								key={book.id}
								layout
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, scale: 0.9 }}
								transition={{ duration: 0.3 }}
								className="h-full"
							>
								<Link href={`/books/${book.id}`} className="block h-full group">
									<Card className="flex h-full flex-col overflow-hidden rounded-3xl border border-slate-200/80 bg-white ring-1 ring-slate-950/5 transition-all duration-300 hover:-translate-y-1 hover:border-violet-300/60 hover:shadow-xl hover:shadow-violet-500/10 dark:border-slate-800/80 dark:bg-slate-950 dark:ring-white/10 dark:hover:border-violet-500/40">
										<CardHeader className="relative w-full p-0">
											{book.coverUrl ? (
												<div className="relative aspect-[3/4] w-full overflow-hidden bg-slate-100 dark:bg-slate-900">
													<Image
														src={book.coverUrl}
														alt={book.title}
														fill
														sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
														className="object-cover transition duration-500 group-hover:scale-[1.03]"
														priority={index < 4}
													/>
												</div>
											) : (
												<div className="relative flex aspect-[3/4] w-full items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-900 dark:to-slate-800">
													<BookOpen className="h-16 w-16 text-slate-300 dark:text-slate-600" />
												</div>
											)}

											<div className="absolute left-4 top-4 max-w-[calc(100%-2rem)] rounded-2xl border border-white/60 bg-white/90 px-3 py-1.5 shadow-sm backdrop-blur-md dark:border-slate-700/60 dark:bg-slate-900/90">
												<span className="line-clamp-1 text-[10px] font-bold uppercase tracking-wider text-violet-600 dark:text-violet-400">
													{book.category?.name ?? "Kniha"}
												</span>
											</div>
										</CardHeader>

										<CardContent className="flex flex-1 flex-col p-6 pt-5">
											<div className="mb-3 space-y-1">
												<CardTitle className="line-clamp-2 text-xl font-bold leading-snug text-slate-900 transition-colors group-hover:text-violet-600 dark:text-white">
													{book.title}
												</CardTitle>
												<CardDescription className="text-xs font-semibold uppercase tracking-wide text-slate-500">
													{book.author?.name ?? "Neznámy autor"}
												</CardDescription>
											</div>
											<p className="line-clamp-3 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
												{book.description || "Bez popisu."}
											</p>
										</CardContent>

										<CardFooter className="flex flex-col gap-4 p-6 pt-0">
											<div className="flex items-center justify-between gap-2 text-xs">
												<span className="font-semibold uppercase tracking-wider text-slate-400">
													Sklad
												</span>
												<span
													className={`rounded-lg px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide ${book.availableCopies > 0 ? "border border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-400" : "border border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-400"}`}
												>
													{book.availableCopies > 0
														? `${book.availableCopies} ks`
														: "Vypredané"}
												</span>
											</div>
											<span className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 text-sm font-bold text-white shadow-md transition group-hover:bg-violet-600 dark:bg-slate-800 dark:group-hover:bg-violet-600">
												Otvoriť detail
												<ExternalLink className="h-4 w-4 opacity-80" />
											</span>
										</CardFooter>
									</Card>
								</Link>
							</motion.div>
						))}
					</AnimatePresence>
				</motion.div>
			) : (
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					className="text-center py-32 px-4 bg-slate-50/50 dark:bg-slate-900/50 rounded-[3rem] border border-dashed border-slate-200 dark:border-slate-800"
				>
					<div className="bg-white dark:bg-slate-950 h-24 w-24 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl border border-slate-100 dark:border-slate-800">
						<Search className="h-10 w-10 text-slate-300" />
					</div>
					<h3 className="text-3xl font-black text-slate-900 dark:text-white">
						Žiadne výsledky
					</h3>
					<p className="text-slate-500 mt-4 max-w-md mx-auto font-medium">
						Nenašli sme žiadne knihy zodpovedajúce vašim filtrom. Skúste ich
						upraviť alebo zrušiť.
					</p>
					<Button
						variant="outline"
						onClick={() => {
							setSearchQuery("");
							setSelectedAuthor("all");
							setSelectedCategory("all");
							setTempAuthor("all");
							setTempCategory("all");
							setCurrentPage(1);
						}}
						className="mt-8 rounded-2xl px-8 h-12 border-slate-200 hover:bg-slate-50"
					>
						Zrušiť všetky filtre
					</Button>
				</motion.div>
			)}

			{/* Paginácia */}
			{totalPages > 1 && (
				<div className="flex flex-col items-center gap-4 pt-10">
					<p className="text-sm text-slate-500">
						Stránka{" "}
						<span className="font-semibold text-slate-800 dark:text-slate-200">{currentPage}</span> z{" "}
						{totalPages}
					</p>
					<div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4">
						<Button
							variant="ghost"
							onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
							disabled={currentPage === 1}
							className="h-12 gap-2 rounded-2xl px-6 font-bold text-slate-600 hover:bg-slate-100 disabled:opacity-30"
						>
							<ChevronLeft className="h-5 w-5" />
							Predošlá
						</Button>

						<div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
							{visiblePages.map((page, idx) => {
								const prev = visiblePages[idx - 1];
								const showEllipsis = prev !== undefined && page - prev > 1;
								return (
									<span key={page} className="flex items-center gap-1.5">
										{showEllipsis && (
											<span className="px-1 text-slate-400" aria-hidden>
												…
											</span>
										)}
										<button
											type="button"
											onClick={() => setCurrentPage(page)}
											className={`flex h-9 min-w-[2.25rem] items-center justify-center rounded-xl px-2 text-sm font-bold transition-all ${currentPage === page ? "scale-105 bg-slate-900 text-white shadow-md dark:bg-violet-600" : "text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"}`}
											aria-current={currentPage === page ? "page" : undefined}
										>
											{page}
										</button>
									</span>
								);
							})}
						</div>

						<Button
							variant="ghost"
							onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
							disabled={currentPage === totalPages}
							className="h-12 gap-2 rounded-2xl px-6 font-bold text-slate-600 hover:bg-slate-100 disabled:opacity-30"
						>
							Nasledovná
							<ChevronRight className="h-5 w-5" />
						</Button>
					</div>
				</div>
			)}
		</div>
	);
}

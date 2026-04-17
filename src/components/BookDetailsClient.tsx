"use client";

import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
	ArrowLeft,
	BookOpen,
	Star,
	User,
	Library,
	Calendar,
	CheckCircle2,
	AlertCircle,
	Clock,
	Loader2,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAction } from "next-safe-action/hooks";
import { borrowBookAction } from "@/lib/actions";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { useMemo, useState } from "react";

type BookForDetails = {
	id: string;
	title: string;
	description: string | null;
	coverUrl: string | null;
	isbn: string | null;
	availableCopies: number;
	author: string | null;
	authorId: string | null;
	category: string | null;
};

type BookDetailsClientProps = {
	book: BookForDetails;
	user: { name?: string | null; email?: string | null } | null;
};

export function BookDetailsClient({
	book,
	user,
}: BookDetailsClientProps) {
	const [isModalOpen, setIsModalOpen] = useState(false);

	const { execute, isExecuting } = useAction(borrowBookAction, {
		onSuccess: () => {
			toast.success("Kniha bola úspešne vypožičaná!");
			setIsModalOpen(false);
		},
		onError: (error) => {
			toast.error(error.error.serverError || "Zlyhalo vypožičanie knihy.");
		},
	});

	const handleConfirmBorrow = () => {
		execute({ bookId: book.id });
	};

	const dueDateLabel = useMemo(() => {
		const d = new Date();
		d.setDate(d.getDate() + 14);
		return d.toLocaleDateString("sk-SK", {
			weekday: "long",
			day: "numeric",
			month: "long",
			year: "numeric",
		});
	}, [isModalOpen]);

	return (
		<div className="max-w-6xl mx-auto space-y-12 pb-16">
			<Link href="/books">
				<Button
					variant="ghost"
					className="mb-4 rounded-full pl-2 hover:bg-primary/10 hover:text-primary transition-colors"
				>
					<ArrowLeft className="mr-2 h-4 w-4" />
					Katalóg Kníh
				</Button>
			</Link>

			<div className="grid grid-cols-1 lg:grid-cols-12 gap-12 sm:gap-16">
				<div className="lg:col-span-4 perspective-1000">
					<motion.div
						initial={{ rotateY: -15, rotateX: 5, opacity: 0, scale: 0.9 }}
						animate={{ rotateY: 0, rotateX: 0, opacity: 1, scale: 1 }}
						transition={{ type: "spring", stiffness: 100, damping: 20 }}
						className="relative"
					>
						<Card className="overflow-hidden border-0 shadow-2xl rounded-3xl bg-slate-900/5 dark:bg-slate-900 ring-1 ring-slate-900/10 dark:ring-white/10 group">
							{book.coverUrl ? (
								<div className="relative w-full aspect-[2/3]">
									<Image
										src={book.coverUrl}
										alt={book.title}
										fill
										sizes="(max-width: 1024px) 100vw, 33vw"
										className="object-cover transition-transform duration-700 group-hover:scale-105"
									/>
									<div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
								</div>
							) : (
								<div className="w-full aspect-[2/3] bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-800 dark:to-slate-900 flex items-center justify-center text-slate-400 group-hover:brightness-110 transition-all">
									<BookOpen className="h-24 w-24 opacity-50 drop-shadow-lg" />
								</div>
							)}
						</Card>
					</motion.div>
				</div>

				<div className="lg:col-span-8 flex flex-col justify-center space-y-8">
					<motion.div
						initial={{ opacity: 0, x: 20 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ delay: 0.1, duration: 0.5 }}
						className="space-y-4"
					>
						<div className="flex flex-wrap gap-2 mb-4">
							<Badge
								variant="outline"
								className="px-3 py-1 rounded-full border-primary/30 text-primary bg-primary/5 hover:bg-primary/10 transition-colors uppercase tracking-widest text-xs font-bold"
							>
								{book.category ?? "Nezaradené"}
							</Badge>
							<Badge
								variant={book.availableCopies > 0 ? "secondary" : "destructive"}
								className="px-3 py-1 rounded-full uppercase tracking-widest text-xs font-bold"
							>
								{book.availableCopies > 0
									? `${book.availableCopies} Na Sklade`
									: "Vypredané"}
							</Badge>
						</div>

						<h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight leading-tight text-foreground">
							{book.title}
						</h1>

						<div className="flex items-center gap-3 text-2xl text-slate-600 dark:text-slate-400 font-medium">
							<span className="text-primary italic">Napísal(a):</span>{" "}
							{book.author ?? "Neznámy autor"}
						</div>
					</motion.div>

					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.2, duration: 0.5 }}
						className="py-6 border-t border-b border-slate-200/50 dark:border-slate-800/50"
					>
						<h3 className="font-bold text-xl mb-4 text-foreground flex items-center gap-2">
							<BookOpen className="h-5 w-5 text-primary" /> O Knihe
						</h3>
						<p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
							{book.description || "Popis nie je k dispozícii."}
						</p>
					</motion.div>

					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.3, duration: 0.5 }}
						className="grid grid-cols-2 md:grid-cols-4 gap-4"
					>
						<div className="bg-muted/50 rounded-2xl p-4 flex flex-col gap-1 border border-slate-200/50 dark:border-slate-800/50">
							<span className="text-sm font-semibold text-slate-500 uppercase flex items-center gap-1.5">
								<Calendar className="h-3.5 w-3.5" /> ISBN
							</span>
							<span className="font-mono text-foreground font-bold">
								{book.isbn || "N/A"}
							</span>
						</div>
						<div className="bg-muted/50 rounded-2xl p-4 flex flex-col gap-1 border border-slate-200/50 dark:border-slate-800/50">
							<span className="text-sm font-semibold text-slate-500 uppercase flex items-center gap-1.5">
								<Library className="h-3.5 w-3.5" /> Žáner
							</span>
							<span className="text-foreground font-bold">{book.category}</span>
						</div>
						<div className="bg-muted/50 rounded-2xl p-4 flex flex-col gap-1 border border-slate-200/50 dark:border-slate-800/50">
							<span className="text-sm font-semibold text-slate-500 uppercase flex items-center gap-1.5">
								<User className="h-3.5 w-3.5" /> Spisovateľ
							</span>
							<span className="text-foreground font-bold line-clamp-1">
								{book.author}
							</span>
						</div>
						<div className="bg-primary/5 rounded-2xl p-4 flex flex-col gap-1 border border-primary/20">
							<span className="text-sm font-bold text-primary uppercase flex items-center gap-1.5">
								<Star className="h-3.5 w-3.5" /> Hodnotenie
							</span>
							<span className="text-primary font-black">Excelentné</span>
						</div>
					</motion.div>

					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.4, duration: 0.5 }}
						className="flex flex-col flex-wrap gap-4 pt-4 sm:flex-row"
					>
						<Button
							type="button"
							size="lg"
							className={`h-16 rounded-2xl px-10 text-lg font-bold shadow-xl transition-all ${!user ? "cursor-not-allowed bg-slate-300 text-slate-500 dark:bg-slate-700" : book.availableCopies > 0 ? "bg-primary text-primary-foreground hover:-translate-y-0.5 hover:bg-primary/90 hover:shadow-primary/25" : "cursor-not-allowed bg-slate-200 text-slate-500 dark:bg-slate-800"}`}
							disabled={!user || book.availableCopies <= 0 || isExecuting}
							onClick={() => setIsModalOpen(true)}
						>
							<BookOpen className="mr-3 h-6 w-6" />
							{!user
								? "Potrebné prihlásenie"
								: book.availableCopies > 0
									? "Požičať knihu"
									: "Momentálne nedostupná"}
						</Button>

						<Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
							<DialogContent className="max-h-[min(90vh,640px)] gap-0 overflow-hidden rounded-3xl border border-slate-200/80 p-0 shadow-2xl sm:max-w-[540px] dark:border-slate-800">
								<div className="relative overflow-hidden bg-gradient-to-br from-violet-600 via-primary to-violet-800 px-6 pb-8 pt-8 text-white">
									<div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
									<DialogHeader className="relative space-y-3 text-left">
										<div className="inline-flex w-fit items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white/90">
											<Library className="h-3.5 w-3.5" />
											Výpožička
										</div>
										<DialogTitle className="text-2xl font-bold leading-tight text-white sm:text-3xl">
											Potvrdiť požičanie
										</DialogTitle>
										<DialogDescription className="text-sm leading-relaxed text-violet-100">
											Skontrolujte údaje. Po potvrdení vám knihu priradíme a pošleme pripomienku pred
											termínom vrátenia.
										</DialogDescription>
									</DialogHeader>
								</div>

								<div className="space-y-5 overflow-y-auto bg-card p-6">
									<div className="flex gap-4 rounded-2xl border border-slate-200/80 bg-muted/40 p-4 dark:border-slate-800">
										{book.coverUrl ? (
											<div className="relative h-[7.5rem] w-14 shrink-0 overflow-hidden rounded-lg shadow-md ring-1 ring-black/5">
												<Image
													src={book.coverUrl}
													alt={book.title}
													fill
													className="object-cover"
													sizes="56px"
												/>
											</div>
										) : (
											<div className="flex h-[7.5rem] w-14 shrink-0 items-center justify-center rounded-lg bg-slate-200 dark:bg-slate-800">
												<BookOpen className="h-8 w-8 text-slate-400" />
											</div>
										)}
										<div className="min-w-0 flex-1 space-y-1">
											<p className="font-semibold leading-snug text-foreground line-clamp-3">
												{book.title}
											</p>
											<p className="text-sm text-muted-foreground">{book.author}</p>
											<div className="flex flex-wrap gap-2 pt-2">
												<Badge
													variant="secondary"
													className="rounded-lg font-normal"
												>
													{book.availableCopies > 0
														? `${book.availableCopies} ks na sklade`
														: "Nedostupná"}
												</Badge>
											</div>
										</div>
									</div>

									<div className="grid gap-3 sm:grid-cols-2">
										<div className="rounded-2xl border border-slate-200/80 bg-muted/30 p-4 dark:border-slate-800">
											<div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
												<Clock className="h-3.5 w-3.5" />
												Dĺžka výpožičky
											</div>
											<p className="text-lg font-bold text-foreground">14 dní</p>
											<p className="mt-1 text-xs text-muted-foreground">
												Štandardná lehota v našej knižnici
											</p>
										</div>
										<div className="rounded-2xl border border-primary/25 bg-primary/5 p-4 dark:border-primary/30">
											<div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-primary">
												<Calendar className="h-3.5 w-3.5" />
												Termín vrátenia
											</div>
											<p className="text-sm font-semibold leading-snug text-foreground capitalize">
												{dueDateLabel}
											</p>
										</div>
									</div>

									<div className="space-y-2">
										<h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
											Údaje čitateľa
										</h4>
										{user ? (
											<div className="flex items-center gap-3 rounded-2xl border border-primary/20 bg-primary/5 p-4">
												<div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/15">
													<User className="h-5 w-5 text-primary" />
												</div>
												<div className="min-w-0">
													<p className="truncate text-sm font-semibold text-foreground">
														{user.name}
													</p>
													<p className="truncate text-xs text-muted-foreground">{user.email}</p>
												</div>
											</div>
										) : (
											<div className="flex items-center gap-3 rounded-2xl border border-destructive/25 bg-destructive/10 p-4 text-destructive">
												<AlertCircle className="h-6 w-6 shrink-0" />
												<p className="text-sm font-medium">Pre požičanie sa musíte prihlásiť.</p>
											</div>
										)}
									</div>
								</div>

								<DialogFooter className="flex-col gap-3 border-t border-slate-200/80 bg-muted/20 p-6 dark:border-slate-800 sm:flex-row sm:justify-end">
									<Button
										type="button"
										variant="ghost"
										onClick={() => setIsModalOpen(false)}
										className="w-full rounded-xl sm:w-auto"
									>
										Zrušiť
									</Button>
									<Button
										type="button"
										onClick={handleConfirmBorrow}
										disabled={isExecuting || !user}
										className="w-full rounded-xl px-8 font-semibold shadow-md shadow-primary/15 sm:w-auto"
									>
										{isExecuting ? (
											<>
												<Loader2 className="mr-2 h-4 w-4 animate-spin" />
												Odosielam…
											</>
										) : (
											<>
												<CheckCircle2 className="mr-2 h-4 w-4" />
												Potvrdiť požičanie
											</>
										)}
									</Button>
								</DialogFooter>
							</DialogContent>
						</Dialog>

						{book.authorId ? (
							<Link href={`/authors/${book.authorId}`}>
								<Button
									size="lg"
									variant="outline"
									className="h-16 w-full sm:w-auto px-8 rounded-2xl text-lg font-bold border-2 hover:bg-muted"
								>
									<User className="mr-2 h-5 w-5" />
									Viac od autora
								</Button>
							</Link>
						) : null}
					</motion.div>
				</div>
			</div>
		</div>
	);
}

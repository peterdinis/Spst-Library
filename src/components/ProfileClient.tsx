"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	User,
	Mail,
	Calendar,
	Settings,
	BookMarked,
	History,
	Star,
	Activity,
	Clock,
	ExternalLink,
} from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { mockUser } from "@/lib/mockData";
import { Progress } from "@/components/ui/progress";
import { trpc } from "@/trpc/client";
import { toast } from "sonner";
import { useAction } from "next-safe-action/hooks";
import { returnBookAction } from "@/lib/actions";
import { useMemo, useState } from "react";
import { CLIENT_STALE_TIME } from "@/trpc/cache-config";

export function ProfileClient({ user }: { user: any }) {
	const isAuthed = Boolean(user?.id);
	const utils = trpc.useUtils();

	const { data: dashboard, isLoading: dashboardLoading } =
		trpc.profile.getDashboard.useQuery(undefined, {
			enabled: isAuthed,
			staleTime: CLIENT_STALE_TIME.profile,
		});

	const { execute: executeReturn, isExecuting: isReturning } = useAction(
		returnBookAction,
		{
			onSuccess: () => {
				toast.success("Kniha bola úspešne vrátená!");
				utils.books.getBorrowedByUser.invalidate();
				utils.profile.getDashboard.invalidate();
			},
			onError: (error) => {
				toast.error(error.error.serverError || "Chyba pri vracaní knihy");
			},
		},
	);

	const userBorrows = dashboard?.borrows;
	const settings = dashboard?.settings;
	const readingGoal = settings?.readingGoal ?? null;

	const borrowsLoading = isAuthed && dashboardLoading;

	const [activeTab, setActiveTab] = useState("overview");

	const displayUser = useMemo(() => {
		const dbUser = dashboard?.user;
		const roleLabel =
			(user as { role?: string })?.role === "admin" ? "Správca" : "Čitateľ";
		return {
			name: dbUser?.name || user?.name || mockUser.name,
			email: dbUser?.email || user?.email || mockUser.email,
			image: dbUser?.image ?? (user as { image?: string | null })?.image ?? null,
			role: isAuthed ? roleLabel : mockUser.role,
		};
	}, [user, isAuthed, dashboard?.user]);

	const activeBorrows = useMemo(
		() => userBorrows?.filter((b) => b.status === "borrowed") ?? [],
		[userBorrows],
	);
	const returnedCount = useMemo(
		() => userBorrows?.filter((b) => b.status === "returned").length ?? 0,
		[userBorrows],
	);

	const booksRead = returnedCount;
	const challengePct =
		readingGoal != null && readingGoal > 0
			? Math.min(100, Math.round((booksRead / readingGoal) * 100))
			: 0;

	const firstActivityDate = useMemo(() => {
		if (!userBorrows?.length) return null;
		const t = Math.min(
			...userBorrows.map((b) => new Date(b.borrowDate).getTime()),
		);
		return new Date(t);
	}, [userBorrows]);

	return (
		<div className="max-w-6xl mx-auto space-y-8 pb-16">
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				className="relative overflow-hidden rounded-[2.5rem] border border-primary/10 bg-gradient-to-r from-primary/10 via-primary/5 to-background p-8 shadow-lg sm:p-12 mb-8"
			>
				<div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/20 blur-[80px]" />

				<div className="relative z-10 flex flex-col items-center gap-8 text-center sm:flex-row sm:text-left">
					<div className="relative group">
						<div className="absolute -inset-1 rounded-full bg-gradient-to-r from-primary to-emerald-400 opacity-40 blur transition duration-500 group-hover:opacity-70" />
						<div className="relative flex h-32 w-32 items-center justify-center overflow-hidden rounded-full border-4 border-background bg-slate-100 dark:bg-slate-800">
							{displayUser.image ? (
								<Image
									src={displayUser.image}
									alt=""
									width={128}
									height={128}
									className="h-full w-full object-cover"
								/>
							) : (
								<User className="h-12 w-12 text-slate-400" />
							)}
						</div>
						<Badge className="absolute bottom-2 right-0 border-2 border-background bg-primary shadow-lg">
							{displayUser.role}
						</Badge>
					</div>

					<div className="min-w-0 flex-1 space-y-2">
						<h1 className="text-4xl font-extrabold tracking-tight text-foreground">
							{displayUser.name}
						</h1>
						<p className="flex items-center justify-center gap-2 text-lg font-medium text-slate-500 sm:justify-start">
							<Mail className="h-4 w-4 shrink-0" />{" "}
							<span className="truncate">{displayUser.email}</span>
						</p>
						{firstActivityDate && (
							<p className="flex items-center justify-center gap-2 pt-2 text-sm text-slate-400 sm:justify-start">
								<Calendar className="h-4 w-4 shrink-0" /> Prvá výpožička:{" "}
								{firstActivityDate.toLocaleDateString("sk-SK")}
							</p>
						)}
					</div>

					{isAuthed && (
						<div className="mt-2 flex w-full flex-col gap-2 sm:mt-0 sm:w-auto">
							<Link
								href="/settings"
								className={cn(
									buttonVariants({ variant: "outline", size: "lg" }),
									"rounded-full shadow-sm",
								)}
							>
								<Settings className="mr-2 h-4 w-4" />
								Nastavenia účtu
								<ExternalLink className="ml-2 h-3.5 w-3.5 opacity-60" />
							</Link>
						</div>
					)}
				</div>
			</motion.div>

			<Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
				<TabsList className="mb-8 grid h-12 w-full max-w-md grid-cols-2 rounded-full border border-slate-200 bg-slate-100 p-1 dark:border-slate-800 dark:bg-slate-900">
					<TabsTrigger
						value="overview"
						className="rounded-full text-sm font-bold data-[state=active]:bg-background data-[state=active]:shadow-sm"
					>
						<Activity className="mr-2 h-4 w-4" /> Prehľad
					</TabsTrigger>
					<TabsTrigger
						value="borrows"
						className="rounded-full text-sm font-bold data-[state=active]:bg-background data-[state=active]:shadow-sm"
					>
						<BookMarked className="mr-2 h-4 w-4" /> Výpožičky
					</TabsTrigger>
				</TabsList>

				<AnimatePresence mode="wait">
					<TabsContent value="overview" className="space-y-8 outline-none">
						<motion.div
							initial={{ opacity: 0, x: -10 }}
							animate={{ opacity: 1, x: 0 }}
							exit={{ opacity: 0, x: -10 }}
							className="grid grid-cols-1 gap-6 md:grid-cols-3"
						>
							<Card className="rounded-3xl border-slate-200/50 bg-card/50 shadow-md backdrop-blur-sm dark:border-slate-800/50">
								<CardHeader className="pb-2">
									<CardTitle className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-slate-500">
										<BookMarked className="h-4 w-4 text-primary" />
										Aktuálne výpožičky
									</CardTitle>
								</CardHeader>
								<CardContent>
									<div className="text-4xl font-black text-foreground">
										{activeBorrows.length}
									</div>
									<p className="mt-1 text-sm text-slate-500">
										Bez limitu na počet súčasných výpožičiek.
									</p>
								</CardContent>
							</Card>

							<Card className="rounded-3xl border-slate-200/50 bg-card/50 shadow-md backdrop-blur-sm dark:border-slate-800/50">
								<CardHeader className="pb-2">
									<CardTitle className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-slate-500">
										<History className="h-4 w-4 text-emerald-500" />
										Vrátené knihy
									</CardTitle>
								</CardHeader>
								<CardContent>
									<div className="text-4xl font-black text-foreground">
										{booksRead}
									</div>
									<p className="mt-1 text-sm text-slate-500">
										Celkom v histórii účtu.
									</p>
								</CardContent>
							</Card>

							<Card className="rounded-3xl border-slate-200/50 bg-gradient-to-br from-primary/5 to-transparent bg-card/50 shadow-md backdrop-blur-sm dark:border-slate-800/50">
								<CardHeader className="pb-2">
									<CardTitle className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-primary">
										<Star className="h-4 w-4 fill-primary text-primary" />
										Čitateľská výzva
									</CardTitle>
								</CardHeader>
								<CardContent className="space-y-3">
									{readingGoal != null && readingGoal > 0 ? (
										<>
											<div className="flex items-end justify-between">
												<span className="text-3xl font-black text-foreground">
													{challengePct}%
												</span>
												<span className="mb-1 text-sm font-medium text-slate-500">
													{booksRead} / {readingGoal} kníh
												</span>
											</div>
											<Progress value={challengePct} className="h-2.5 rounded-full" />
											<p className="text-xs text-muted-foreground">
												Cieľ upravíte v{" "}
												<Link
													href="/settings"
													className="font-medium text-primary underline-offset-4 hover:underline"
												>
													nastaveniach
												</Link>
												.
											</p>
										</>
									) : (
										<>
											<p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
												Nastavte si ročný cieľ počtu prečítaných kníh (podľa
												vrátených výpožičiek).
											</p>
											<Link
												href="/settings"
												className={cn(
													buttonVariants({ variant: "secondary", size: "sm" }),
													"rounded-xl",
												)}
											>
												Otvoriť nastavenia
											</Link>
										</>
									)}
								</CardContent>
							</Card>
						</motion.div>
					</TabsContent>

					<TabsContent value="borrows" className="outline-none">
						<motion.div
							initial={{ opacity: 0, x: 10 }}
							animate={{ opacity: 1, x: 0 }}
							exit={{ opacity: 0, x: 10 }}
						>
							<div className="mb-6 flex items-center justify-between px-2">
								<h2 className="text-2xl font-bold tracking-tight">
									Aktuálne požičané knihy
								</h2>
								<Badge
									variant="secondary"
									className="rounded-full px-3 py-1 text-sm font-bold"
								>
									{activeBorrows.length} aktívne
								</Badge>
							</div>

							{borrowsLoading ? (
								<div className="rounded-[3rem] border border-dashed border-slate-200 py-20 text-center text-slate-500 dark:border-slate-800">
									Načítavam výpožičky…
								</div>
							) : activeBorrows.length > 0 ? (
								<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
									{activeBorrows.map((borrow) => {
										const borrowedDate = new Date(borrow.borrowDate);
										const deadlineDate = new Date(
											borrow.dueDate || borrowedDate,
										);
										const isLate = deadlineDate.getTime() < Date.now();

										return (
											<Card
												key={borrow.id}
												className="group flex flex-col overflow-hidden rounded-3xl border-slate-200/50 bg-card/60 backdrop-blur-md transition-all hover:border-primary/30 hover:shadow-xl dark:border-slate-800/50 sm:flex-row"
											>
												<div className="relative aspect-[3/4] w-full shrink-0 overflow-hidden bg-slate-100 dark:bg-slate-900 sm:aspect-auto sm:w-1/3">
													{borrow.book?.coverUrl ? (
														<Image
															src={borrow.book.coverUrl}
															alt={borrow.book?.title || "Kniha"}
															fill
															className="object-cover transition-transform duration-500 group-hover:scale-105"
														/>
													) : (
														<div className="flex h-full w-full items-center justify-center text-slate-400">
															<BookMarked className="h-12 w-12 opacity-50" />
														</div>
													)}
													{isLate && (
														<div className="absolute left-0 top-0 w-full bg-destructive py-1.5 text-center text-xs font-bold uppercase tracking-widest text-destructive-foreground shadow-md">
															Po termíne
														</div>
													)}
												</div>
												<div className="flex flex-1 flex-col justify-between p-5 sm:p-6">
													<div>
														<CardTitle className="mb-1 line-clamp-2 text-xl font-bold leading-tight transition-colors group-hover:text-primary">
															{borrow.book?.title || "Neznáma kniha"}
														</CardTitle>
														<CardDescription className="text-sm font-medium">
															{borrow.book?.author?.name || "Neznámy autor"}
														</CardDescription>
													</div>

													<div className="mt-6 space-y-4">
														<div className="flex w-full flex-col gap-1 rounded-2xl border border-slate-100 bg-slate-50 p-3 text-sm dark:border-slate-800 dark:bg-slate-900/50">
															<div className="flex items-center justify-between font-medium text-slate-500">
																<span className="flex items-center gap-1.5">
																	<Clock className="h-3.5 w-3.5" /> Výpožička
																</span>
																<span>
																	{borrowedDate.toLocaleDateString("sk-SK")}
																</span>
															</div>
															<div
																className={`flex items-center justify-between font-bold ${isLate ? "text-destructive" : "text-emerald-500"}`}
															>
																<span className="flex items-center gap-1.5">
																	<Calendar className="h-3.5 w-3.5" /> Vrátiť
																	do
																</span>
																<span>
																	{deadlineDate.toLocaleDateString("sk-SK")}
																</span>
															</div>
														</div>
														<div className="flex flex-col gap-2 xl:flex-row">
															<Link
																href={`/books/${borrow.bookId}`}
																className="block flex-1"
															>
																<Button
																	variant="outline"
																	className="w-full rounded-xl font-bold"
																>
																	Detail
																</Button>
															</Link>
															<Button
																className="flex-1 rounded-xl font-bold shadow-md"
																disabled={isReturning}
																onClick={() =>
																	executeReturn({
																		borrowId: borrow.id,
																		bookId: borrow.bookId,
																	})
																}
															>
																Vrátiť
															</Button>
														</div>
													</div>
												</div>
											</Card>
										);
									})}
								</div>
							) : (
								<div className="rounded-[3rem] border border-dashed border-slate-300 bg-muted/30 py-20 text-center dark:border-slate-700">
									<BookMarked className="mx-auto mb-4 h-16 w-16 text-slate-300" />
									<h3 className="text-2xl font-bold">Zatiaľ žiadne výpožičky</h3>
									<p className="mx-auto mt-2 mb-8 max-w-sm text-slate-500">
										Nemáte u nás požičané žiadne knihy. Prezrite si katalóg.
									</p>
									<Link href="/books">
										<Button size="lg" className="rounded-full px-8 shadow-xl">
											Prezerať katalóg
										</Button>
									</Link>
								</div>
							)}
						</motion.div>
					</TabsContent>
				</AnimatePresence>
			</Tabs>
		</div>
	);
}

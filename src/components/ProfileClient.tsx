"use client";

import Image from "next/image";
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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { mockUser } from "@/lib/mockData";
import Link from "next/link";
import { Progress } from "@/components/ui/progress";
import { trpc } from "@/trpc/client";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { useAction } from "next-safe-action/hooks";
import { returnBookAction } from "@/lib/actions";

export function ProfileClient({ user }: { user: any }) {
	const { data: settings, isLoading: settingsLoading } =
		trpc.settings.getSettings.useQuery();
	const utils = trpc.useUtils();

	const updateSetting = trpc.settings.updateSettings.useMutation({
		onSuccess: () => {
			utils.settings.getSettings.invalidate();
			toast.success("Nastavenia uložené");
		},
		onError: () => toast.error("Chyba pri ukladaní"),
	});

	const { execute: executeReturn, isExecuting: isReturning } = useAction(
		returnBookAction,
		{
			onSuccess: () => {
				toast.success("Kniha bola úspešne vrátená!");
				utils.books.getBorrowedByUser.invalidate();
			},
			onError: (error) => {
				toast.error(error.error.serverError || "Chyba pri vracaní knihy");
			},
		},
	);

	const { data: userBorrows, isLoading: borrowsLoading } =
		trpc.books.getBorrowedByUser.useQuery();

	// Merge session user with mock stats for visual richness
	const displayUser = {
		name: user?.name || mockUser.name,
		email: user?.email || mockUser.email,
		role: mockUser.role,
		joinDate: mockUser.joinDate,
	};

	const activeBorrows =
		userBorrows?.filter((b) => b.status === "borrowed") || [];
	const readingGoal = 12; // Example goal
	const booksRead = 4; // Example historic data

	return (
		<div className="max-w-6xl mx-auto space-y-8 pb-16">
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-r from-primary/10 via-primary/5 to-background border border-primary/10 shadow-lg p-8 sm:p-12 mb-8"
			>
				<div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-primary/20 rounded-full blur-[80px] pointer-events-none" />

				<div className="relative z-10 flex flex-col sm:flex-row items-center gap-8 text-center sm:text-left">
					<div className="relative group">
						<div className="absolute -inset-1 bg-gradient-to-r from-primary to-emerald-400 rounded-full blur opacity-40 group-hover:opacity-70 transition duration-500" />
						<div className="relative w-32 h-32 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center border-4 border-background">
							<User className="w-12 h-12 text-slate-400" />
						</div>
						<Badge className="absolute bottom-2 right-0 bg-primary shadow-lg border-2 border-background">
							{displayUser.role}
						</Badge>
					</div>

					<div className="flex-1 space-y-2">
						<h1 className="text-4xl font-extrabold tracking-tight text-foreground">
							{displayUser.name}
						</h1>
						<p className="text-lg text-slate-500 font-medium flex items-center justify-center sm:justify-start gap-2">
							<Mail className="w-4 h-4" /> {displayUser.email}
						</p>
						<p className="text-sm text-slate-400 flex items-center justify-center sm:justify-start gap-2 pt-2">
							<Calendar className="w-4 h-4" /> Členom od:{" "}
							{new Date(displayUser.joinDate).toLocaleDateString("sk-SK")}
						</p>
					</div>

					<div className="flex flex-col gap-3 w-full sm:w-auto mt-6 sm:mt-0">
						<Button
							variant="outline"
							className="rounded-full shadow-sm hover:border-primary/50"
						>
							<Settings className="w-4 h-4 mr-2" /> Nastavenia
						</Button>
					</div>
				</div>
			</motion.div>

			<Tabs defaultValue="overview" className="w-full">
				<TabsList className="grid w-full grid-cols-3 md:w-[600px] h-12 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-1 mb-8 transition-all">
					<TabsTrigger
						value="overview"
						className="rounded-full text-sm font-bold data-[state=active]:bg-background data-[state=active]:shadow-sm"
					>
						<Activity className="w-4 h-4 mr-2" /> Prehľad
					</TabsTrigger>
					<TabsTrigger
						value="borrows"
						className="rounded-full text-sm font-bold data-[state=active]:bg-background data-[state=active]:shadow-sm"
					>
						<BookMarked className="w-4 h-4 mr-2" /> Moje Výpožičky
					</TabsTrigger>
					<TabsTrigger
						value="settings"
						className="rounded-full text-sm font-bold data-[state=active]:bg-background data-[state=active]:shadow-sm"
					>
						<Settings className="w-4 h-4 mr-2" /> Nastavenia
					</TabsTrigger>
				</TabsList>

				<AnimatePresence mode="wait">
					<TabsContent value="overview" className="space-y-8 outline-none">
						<motion.div
							initial={{ opacity: 0, x: -10 }}
							animate={{ opacity: 1, x: 0 }}
							exit={{ opacity: 0, x: -10 }}
							className="grid grid-cols-1 md:grid-cols-3 gap-6"
						>
							<Card className="bg-card/50 backdrop-blur-sm border-slate-200/50 dark:border-slate-800/50 rounded-3xl shadow-md">
								<CardHeader className="pb-2">
									<CardTitle className="text-sm font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
										<BookMarked className="w-4 h-4 text-primary" /> Aktuálne
										Výpožičky
									</CardTitle>
								</CardHeader>
								<CardContent>
									<div className="text-4xl font-black text-foreground">
										{activeBorrows.length}
									</div>
									<p className="text-sm text-slate-500 mt-1">
										Z celkového limitu 5 kníh.
									</p>
								</CardContent>
							</Card>

							<Card className="bg-card/50 backdrop-blur-sm border-slate-200/50 dark:border-slate-800/50 rounded-3xl shadow-md">
								<CardHeader className="pb-2">
									<CardTitle className="text-sm font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
										<History className="w-4 h-4 text-emerald-500" /> Prečítané
										Knihy
									</CardTitle>
								</CardHeader>
								<CardContent>
									<div className="text-4xl font-black text-foreground">
										{booksRead}
									</div>
									<p className="text-sm text-slate-500 mt-1">
										Gratulujeme k tvojmu tempu!
									</p>
								</CardContent>
							</Card>

							<Card className="bg-card/50 backdrop-blur-sm border-slate-200/50 dark:border-slate-800/50 rounded-3xl shadow-md bg-gradient-to-br from-primary/5 to-transparent">
								<CardHeader className="pb-2">
									<CardTitle className="text-sm font-bold text-primary uppercase tracking-wider flex items-center gap-2">
										<Star className="w-4 h-4 fill-primary text-primary" /> Výzva
										Roka
									</CardTitle>
								</CardHeader>
								<CardContent>
									<div className="flex justify-between items-end mb-2">
										<span className="text-3xl font-black text-foreground">
											{Math.round((booksRead / readingGoal) * 100)}%
										</span>
										<span className="text-sm text-slate-500 font-medium mb-1">
											{booksRead} / {readingGoal} kníh
										</span>
									</div>
									<Progress
										value={(booksRead / readingGoal) * 100}
										className="h-2.5 rounded-full"
									/>
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
							<div className="flex items-center justify-between mb-6 px-2">
								<h2 className="text-2xl font-bold tracking-tight">
									Aktuálne požičané knihy
								</h2>
								<Badge
									variant="secondary"
									className="px-3 py-1 text-sm font-bold rounded-full"
								>
									{activeBorrows.length} Aktívne
								</Badge>
							</div>

							{activeBorrows.length > 0 ? (
								<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
									{activeBorrows.map((borrow) => {
										const borrowedDate = new Date(borrow.borrowDate);
										// Realná zmluva by mala používať dueDate z databázy
										const deadlineDate = new Date(borrow.dueDate || borrowedDate);
										const isLate = deadlineDate.getTime() < Date.now();

										return (
											<Card
												key={borrow.id}
												className="flex flex-col sm:flex-row overflow-hidden rounded-3xl group border-slate-200/50 dark:border-slate-800/50 hover:shadow-xl hover:border-primary/30 transition-all bg-card/60 backdrop-blur-md"
											>
												<div className="w-full sm:w-1/3 aspect-[3/4] sm:aspect-auto bg-slate-100 dark:bg-slate-900 relative overflow-hidden shrink-0">
                                                                                                        {borrow.book?.coverUrl ? (
													<Image
														src={borrow.book.coverUrl}
														alt={borrow.book?.title || "Kniha"}
														fill
														className="object-cover group-hover:scale-105 transition-transform duration-500"
													/>
                                                                                                        ) : (
                                                                                                           <div className="w-full h-full flex items-center justify-center text-slate-400">
                                                                                                                <BookMarked className="w-12 h-12 opacity-50" />
                                                                                                           </div>
                                                                                                        )}
													{isLate && (
														<div className="absolute top-0 left-0 w-full bg-destructive text-destructive-foreground text-xs font-bold text-center py-1.5 uppercase tracking-widest shadow-md">
															Po Termíne
														</div>
													)}
												</div>
												<div className="flex-1 flex flex-col p-5 sm:p-6 justify-between">
													<div>
														<CardTitle className="text-xl font-bold leading-tight group-hover:text-primary transition-colors line-clamp-2 mb-1">
															{borrow.book?.title || "Neznáma kniha"}
														</CardTitle>
														<CardDescription className="text-sm font-medium">
															{borrow.book?.author?.name || "Neznámy autor"}
														</CardDescription>
													</div>

													<div className="mt-6 space-y-4">
														<div className="flex flex-col gap-1 w-full bg-slate-50 dark:bg-slate-900/50 p-3 rounded-2xl border border-slate-100 dark:border-slate-800 text-sm">
															<div className="flex justify-between items-center text-slate-500 font-medium">
																<span className="flex items-center gap-1.5">
																	<Clock className="w-3.5 h-3.5" /> Výpožička:
																</span>
																<span>
																	{borrowedDate.toLocaleDateString("sk-SK")}
																</span>
															</div>
															<div
																className={`flex justify-between items-center font-bold ${isLate ? "text-destructive" : "text-emerald-500"}`}
															>
																<span className="flex items-center gap-1.5">
																	<Calendar className="w-3.5 h-3.5" /> Vrátiť
																	do:
																</span>
																<span>
																	{deadlineDate.toLocaleDateString("sk-SK")}
																</span>
															</div>
														</div>
                                                                                                                <div className="flex flex-col xl:flex-row gap-2">
														    <Link
															href={`/books/${borrow.bookId}`}
															className="block flex-1"
														    >
															<Button variant="outline" className="w-full rounded-xl font-bold">
																Detail
															</Button>
														    </Link>
                                                                                                                    <Button
                                                                                                                            className="flex-1 rounded-xl font-bold shadow-md"
                                                                                                                            disabled={isReturning}
                                                                                                                            onClick={() => executeReturn({ borrowId: borrow.id, bookId: borrow.bookId })}
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
								<div className="text-center py-20 bg-muted/30 rounded-[3rem] border border-dashed border-slate-300 dark:border-slate-700">
									<BookMarked className="h-16 w-16 text-slate-300 mx-auto mb-4" />
									<h3 className="text-2xl font-bold">
										Zatiaľ žiadne výpožičky
									</h3>
									<p className="text-slate-500 mt-2 mb-8 max-w-sm mx-auto">
										Nemáte u nás požičané žiadne knihy. Prezrite si náš obrovský
										katalóg.
									</p>
									<Link href="/books">
										<Button size="lg" className="rounded-full px-8 shadow-xl">
											Prezerať Katalóg
										</Button>
									</Link>
								</div>
							)}
						</motion.div>
					</TabsContent>
					<TabsContent value="settings" className="outline-none">
						<motion.div
							initial={{ opacity: 0, y: 10 }}
							animate={{ opacity: 1, y: 0 }}
							className="space-y-6"
						>
							<div className="mb-8">
								<h2 className="text-2xl font-bold tracking-tight">
									Nastavenia Účtu
								</h2>
								<p className="text-slate-500">
									Prispôsobte si ako funguje váš knižničný systém.
								</p>
							</div>

							<div className="grid gap-6">
								<Card className="rounded-[2rem] border-slate-200/50 shadow-sm overflow-hidden">
									<div className="p-8 space-y-8">
										<div className="flex items-center justify-between gap-4">
											<div className="space-y-1">
												<h4 className="text-lg font-bold leading-none">
													Emailové Notifikácie
												</h4>
												<p className="text-sm text-slate-500 font-medium">
													Budeme vám posielať informácie o zmenách stavu vašich
													objednávok.
												</p>
											</div>
											<Switch
												checked={settings?.emailNotifications}
												onCheckedChange={(val) =>
													updateSetting.mutate({ emailNotifications: val })
												}
												disabled={settingsLoading || updateSetting.isPending}
											/>
										</div>

										<div className="h-px bg-slate-100 dark:bg-slate-800" />

										<div className="flex items-center justify-between gap-4">
											<div className="space-y-1">
												<h4 className="text-lg font-bold leading-none">
													Pripomienky Vrátenia
												</h4>
												<p className="text-sm text-slate-500 font-medium">
													Upozorníme vás 2 dni pred termínom vrátenia knihy.
												</p>
											</div>
											<Switch
												checked={settings?.dueReminders}
												onCheckedChange={(val) =>
													updateSetting.mutate({ dueReminders: val })
												}
												disabled={settingsLoading || updateSetting.isPending}
											/>
										</div>

										<div className="h-px bg-slate-100 dark:bg-slate-800" />

										<div className="flex items-center justify-between gap-4">
											<div className="space-y-1">
												<h4 className="text-lg font-bold leading-none">
													Systémové Aktualizácie
												</h4>
												<p className="text-sm text-slate-500 font-medium">
													Informácie o nových funkciách a vylepšeniach
													platformy.
												</p>
											</div>
											<Switch
												checked={settings?.systemUpdates}
												onCheckedChange={(val) =>
													updateSetting.mutate({ systemUpdates: val })
												}
												disabled={settingsLoading || updateSetting.isPending}
											/>
										</div>
									</div>
								</Card>

								<div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-800/30 p-6 rounded-3xl">
									<div className="flex gap-4">
										<Star className="h-6 w-6 text-amber-500 shrink-0" />
										<div>
											<p className="font-bold text-amber-900 dark:text-amber-200">
												Beta Funkcie
											</p>
											<p className="text-sm text-amber-700/80 dark:text-amber-400/80 leading-relaxed">
												Niektoré nastavenia sú momentálne v beta testovaní a po
												uložení sa prejavia do 24 hodín.
											</p>
										</div>
									</div>
								</div>
							</div>
						</motion.div>
					</TabsContent>
				</AnimatePresence>
			</Tabs>
		</div>
	);
}

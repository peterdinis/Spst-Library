"use client";

import { useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { useIsDesktop } from "@/hooks/use-is-desktop";
import {
	BookMarked,
	User,
	Settings,
	Activity,
	Menu,
	X,
	BookOpen,
	Users,
	Tag,
} from "lucide-react";
import { ModeToggle } from "@/components/ModeToggle";
import { NotificationBell } from "@/components/NotificationBell";
import { SignOutButton } from "@/components/SignOutButton";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UrlObject } from "url";

const navLinks = [
	{ href: "/books", label: "Knihy", icon: BookOpen },
	{ href: "/authors", label: "Autori", icon: Users },
	{ href: "/categories", label: "Kategórie", icon: Tag },
];

export function Navbar() {
	const { data: session } = useSession();
	const [mobileOpen, setMobileOpen] = useState(false);
	const isDesktop = useIsDesktop();

	return (
		<>
			<nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
				<div className="container flex h-16 items-center mx-auto px-4 justify-between">
					<div className="flex items-center gap-6">
						<Link href="/" className="flex items-center space-x-2">
							<BookMarked className="h-6 w-6 text-primary" />
							<span className="font-bold text-lg inline-block">
								SPŠT Knižnica
							</span>
						</Link>

						{isDesktop && (
							<div className="flex items-center space-x-2">
								{navLinks.map(({ href, label }) => (
									<Link key={href} href={href as unknown as UrlObject}>
										<Button variant="ghost">{label}</Button>
									</Link>
								))}
							</div>
						)}
					</div>

					<div className="flex items-center space-x-2">
						{session && <NotificationBell />}
						<ModeToggle />

						{!isDesktop && (
							<button
								className="p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
								onClick={() => setMobileOpen((prev) => !prev)}
								aria-label="Otvoriť menu"
							>
								{mobileOpen ? (
									<X className="h-5 w-5" />
								) : (
									<Menu className="h-5 w-5" />
								)}
							</button>
						)}

						{isDesktop && (
							<div>
								{session ? (
									<DropdownMenu>
										<DropdownMenuTrigger className="focus:outline-none group">
											<div className="flex items-center gap-3 pl-2 pr-1 py-1 rounded-full border border-slate-200 hover:border-primary/30 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800/70 transition-all duration-200">
												<div className="flex flex-col items-end">
													<span className="text-xs font-bold text-slate-900 dark:text-slate-50 leading-none">
														{session.user?.name}
													</span>
													<span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
														Používateľ
													</span>
												</div>
												<div className="h-8 w-8 rounded-full bg-indigo-100 dark:bg-indigo-500/30 flex items-center justify-center border-2 border-background dark:border-slate-700 shadow-sm group-hover:scale-105 transition-transform">
													<User className="h-4 w-4 text-indigo-600 dark:text-indigo-200" />
												</div>
											</div>
										</DropdownMenuTrigger>
										<DropdownMenuContent
											align="end"
											className="w-64 p-2 rounded-2xl shadow-xl border-slate-200/60 dark:border-slate-700 mt-2 bg-white dark:bg-slate-900"
										>
											<div className="px-3 py-4 mb-2 bg-slate-50/60 dark:bg-slate-800/80 rounded-xl flex items-center gap-3">
												<div className="h-10 w-10 rounded-full bg-indigo-100 dark:bg-indigo-500/30 flex items-center justify-center border border-slate-200 dark:border-slate-700 shadow-sm">
													<User className="h-5 w-5 text-indigo-600 dark:text-indigo-200" />
												</div>
												<div className="flex flex-col min-w-0">
													<span className="text-sm font-bold text-slate-900 dark:text-slate-50 truncate">
														{session.user?.name}
													</span>
													<span className="text-xs text-slate-500 dark:text-slate-400 truncate">
														{session.user?.email}
													</span>
												</div>
											</div>

											<DropdownMenuSeparator className="my-1 bg-slate-100 dark:bg-slate-700" />

											<Link href="/profile" className="w-full">
												<DropdownMenuItem className="cursor-pointer rounded-lg py-2 gap-3 focus:bg-indigo-50 dark:focus:bg-indigo-950/60 group">
													<div className="p-1.5 rounded-md bg-indigo-100/50 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-200 group-focus:bg-indigo-100 dark:group-focus:bg-indigo-500/30 transition-colors">
														<User className="h-3.5 w-3.5" />
													</div>
													<span className="font-medium text-slate-700 dark:text-slate-100">
														Môj Profil
													</span>
												</DropdownMenuItem>
											</Link>

											<Link href="/my-books" className="w-full">
												<DropdownMenuItem className="cursor-pointer rounded-lg py-2 gap-3 focus:bg-emerald-50 dark:focus:bg-emerald-950/60 group">
													<div className="p-1.5 rounded-md bg-emerald-100/50 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-200 group-focus:bg-emerald-100 dark:group-focus:bg-emerald-500/30 transition-colors">
														<BookMarked className="h-3.5 w-3.5" />
													</div>
													<span className="font-medium text-slate-700 dark:text-slate-100">
														Moje Výpožičky
													</span>
												</DropdownMenuItem>
											</Link>

											<Link href="/admin" className="w-full">
												<DropdownMenuItem className="cursor-pointer rounded-lg py-2 gap-3 focus:bg-amber-50 dark:focus:bg-amber-950/60 group">
													<div className="p-1.5 rounded-md bg-amber-100/50 dark:bg-amber-500/20 text-amber-600 dark:text-amber-200 group-focus:bg-amber-100 dark:group-focus:bg-amber-500/30 transition-colors">
														<Settings className="h-3.5 w-3.5" />
													</div>
													<span className="font-semibold text-amber-700 dark:text-amber-200">
														Administrácia
													</span>
												</DropdownMenuItem>
											</Link>

											<DropdownMenuSeparator className="my-1 bg-slate-100 dark:bg-slate-700" />

											<DropdownMenuItem
												className="cursor-pointer rounded-lg py-2 gap-3 text-rose-600 dark:text-rose-400 focus:bg-rose-50 dark:focus:bg-rose-950/60 transition-colors"
												onSelect={(event) => event.preventDefault()}
											>
												<SignOutButton className="w-full flex items-center gap-3 text-left">
													<div className="p-1.5 rounded-md bg-rose-100/50 dark:bg-rose-500/20 transition-colors">
														<Activity className="h-3.5 w-3.5 animate-pulse" />
													</div>
													<span className="font-bold">Odhlásiť sa</span>
												</SignOutButton>
											</DropdownMenuItem>
										</DropdownMenuContent>
									</DropdownMenu>
								) : (
									<Link href="/login">
										<Button size="sm" variant="outline">
											Prihlásiť sa
										</Button>
									</Link>
								)}
							</div>
						)}
					</div>
				</div>
			</nav>

			{!isDesktop && mobileOpen && (
				<div className="fixed inset-x-0 top-16 z-40 bg-background border-b shadow-lg">
					<div className="container mx-auto px-4 py-3 flex flex-col gap-1">
						{navLinks.map(({ href, label, icon: Icon }) => (
							<Link
								key={href}
								href={href as unknown as UrlObject}
								onClick={() => setMobileOpen(false)}
								className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-sm font-medium text-slate-700 dark:text-slate-200"
							>
								<Icon className="h-4 w-4 text-slate-500 dark:text-slate-400" />
								{label}
							</Link>
						))}

						<div className="border-t border-slate-100 dark:border-slate-800 my-1" />

						{session ? (
							<>
								<div className="px-3 py-3 flex items-center gap-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg mb-1">
									<div className="h-9 w-9 rounded-full bg-indigo-100 dark:bg-indigo-500/30 flex items-center justify-center">
										<User className="h-4 w-4 text-indigo-600 dark:text-indigo-200" />
									</div>
									<div className="flex flex-col min-w-0">
										<span className="text-sm font-bold text-slate-900 dark:text-slate-50 truncate">
											{session.user?.name}
										</span>
										<span className="text-xs text-slate-500 dark:text-slate-400 truncate">
											{session.user?.email}
										</span>
									</div>
								</div>

								<Link
									href="/profile"
									onClick={() => setMobileOpen(false)}
									className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-950/60 transition-colors text-sm font-medium text-slate-700 dark:text-slate-200"
								>
									<User className="h-4 w-4 text-indigo-500" />
									Môj Profil
								</Link>

								<Link
									href="/my-books"
									onClick={() => setMobileOpen(false)}
									className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-950/60 transition-colors text-sm font-medium text-slate-700 dark:text-slate-200"
								>
									<BookMarked className="h-4 w-4 text-emerald-500" />
									Moje Výpožičky
								</Link>

								<Link
									href="/admin"
									onClick={() => setMobileOpen(false)}
									className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-amber-50 dark:hover:bg-amber-950/60 transition-colors text-sm font-semibold text-amber-700 dark:text-amber-200"
								>
									<Settings className="h-4 w-4 text-amber-500" />
									Administrácia
								</Link>

								<div className="border-t border-slate-100 dark:border-slate-800 my-1" />

								<div className="px-3 py-2">
									<SignOutButton className="w-full flex items-center gap-3 px-0 py-1 text-sm font-bold text-rose-600 dark:text-rose-400">
										<Activity className="h-4 w-4 animate-pulse" />
										Odhlásiť sa
									</SignOutButton>
								</div>
							</>
						) : (
							<Link
								href="/login"
								onClick={() => setMobileOpen(false)}
								className="px-3 py-2"
							>
								<Button size="sm" variant="outline" className="w-full">
									Prihlásiť sa
								</Button>
							</Link>
						)}
					</div>
				</div>
			)}
		</>
	);
}

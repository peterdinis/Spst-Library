import Link from "next/link";
import { auth } from "@/auth";
import { Button } from "@/components/ui/button";
import { BookMarked, User, Settings, Activity } from "lucide-react";
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

export async function Navbar() {
	const session = await auth();

	return (
		<nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
			<div className="container flex h-16 items-center mx-auto px-4 justify-between">
				<div className="flex items-center gap-6">
					<Link href="/" className="flex items-center space-x-2">
						<BookMarked className="h-6 w-6 text-primary" />
						<span className="font-bold text-lg inline-block">
							SPŠT Knižnica
						</span>
					</Link>
					<div className="hidden md:flex items-center space-x-2">
						<Link href="/books">
							<Button variant="ghost">Knihy</Button>
						</Link>
						<Link href="/authors">
							<Button variant="ghost">Autori</Button>
						</Link>
						<Link href="/categories">
							<Button variant="ghost">Kategórie</Button>
						</Link>
					</div>
				</div>

				<div className="flex items-center space-x-2">
					{session && <NotificationBell />}
					<ModeToggle />

					{session ? (
						<DropdownMenu>
							<DropdownMenuTrigger className="focus:outline-none group">
								<div className="flex items-center gap-3 pl-2 pr-1 py-1 rounded-full border border-slate-200 hover:border-primary/30 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800/70 transition-all duration-200">
									<div className="flex flex-col items-end hidden sm:flex">
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
			</div>
		</nav>
	);
}

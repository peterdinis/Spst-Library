"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
	BookOpenText,
	Tags,
	Users2,
	LibraryBig,
	LogIn,
	ShieldCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ModeToggle } from "@/components/ModeToggle";
import { NotificationBell } from "@/components/NotificationBell";
import { ProfileDropdownMenu } from "@/components/layout/ProfileDropdownMenu";
import { Button } from "@/components/ui/button";

type TopNavbarClientProps = {
	isLoggedIn: boolean;
	hasAdminAccess: boolean;
	name?: string | null;
	email?: string | null;
};

const navItems = [
	{
		href: "/books",
		label: "Knihy",
		icon: BookOpenText,
	},
	{
		href: "/categories",
		label: "Kategórie",
		icon: Tags,
	},
	{
		href: "/authors",
		label: "Autori",
		icon: Users2,
	},
];

export default function TopNavbarClient({
	isLoggedIn,
	hasAdminAccess,
	name,
	email,
}: TopNavbarClientProps) {
	const pathname = usePathname();

	return (
		<header className="sticky top-4 z-50 mx-4 md:mx-auto max-w-6xl">
			<nav className="flex items-center justify-between rounded-full border border-white/20 bg-white/60 px-4 py-2.5 backdrop-blur-xl shadow-lg dark:border-white/10 dark:bg-slate-900/60">
				
				{/* Left: Brand */}
				<div className="flex items-center gap-2">
					<Link
						href="/"
						className="flex items-center gap-2 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 px-3 py-1.5 text-white transition-transform hover:scale-105 active:scale-95 shadow-md"
					>
						<LibraryBig className="h-5 w-5" />
						<span className="font-bold tracking-tight hidden sm:inline-block">Knižnica</span>
					</Link>
				</div>

				{/* Middle: Navigation Links */}
				<div className="hidden md:flex items-center gap-1">
					{navItems.map((item) => {
						const isActive = pathname.startsWith(item.href);
						const Icon = item.icon;
						
						return (
							<Link
								key={item.href}
								href={item.href}
								className={cn(
									"group flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all",
									isActive 
										? "bg-primary text-primary-foreground shadow-md" 
										: "text-muted-foreground hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-foreground"
								)}
							>
								<Icon className={cn("h-4 w-4", isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-primary transition-colors")} />
								{item.label}
							</Link>
						);
					})}
				</div>

				{/* Right: Actions */}
				<div className="flex items-center gap-2">
					<ModeToggle triggerClassName="rounded-full h-9 w-9 bg-transparent border-transparent hover:bg-slate-100 dark:hover:bg-slate-800" />
					
					{isLoggedIn ? (
						<>
							<NotificationBell triggerClassName="rounded-full h-9 w-9 bg-transparent border-transparent hover:bg-slate-100 dark:hover:bg-slate-800" />
							{hasAdminAccess && (
								<Link href="/admin" className="hidden sm:block">
									<Button variant="ghost" size="sm" className="rounded-full gap-2 text-amber-600 hover:text-amber-700 hover:bg-amber-50 dark:text-amber-400 dark:hover:text-amber-300 dark:hover:bg-amber-950/50">
										<ShieldCheck className="h-4 w-4" />
										<span className="hidden lg:inline-block">Admin</span>
									</Button>
								</Link>
							)}
							<div className="ml-1">
								<ProfileDropdownMenu
									name={name}
									email={email}
									showAdminLink={hasAdminAccess}
								/>
							</div>
						</>
					) : (
						<div className="flex items-center gap-2 ml-1">
							<Link href="/login">
								<Button variant="ghost" className="rounded-full gap-2 hidden sm:flex">
									Prihlásiť sa
								</Button>
								<Button variant="ghost" size="icon" className="rounded-full sm:hidden">
									<LogIn className="h-4 w-4" />
								</Button>
							</Link>
							<Link href="/admin/login">
								<Button className="rounded-full gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white shadow-md border-0">
									<ShieldCheck className="h-4 w-4" />
									<span className="hidden sm:inline-block">Admin</span>
								</Button>
							</Link>
						</div>
					)}
				</div>
			</nav>

			{/* Mobile bottom nav spacer (if we wanted to stick it to bottom on mobile, but sticking to top is fine for now. Let's just render the middle links on mobile in a simpler way below or hide them. Actually, wait. I hid them with hidden md:flex. On mobile, how do they navigate? ) */}
			{/* Mobile Navigation Bar */}
			<div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 md:hidden w-[calc(100%-2rem)]">
				<div className="flex items-center justify-around rounded-full border border-white/20 bg-white/80 px-2 py-2 backdrop-blur-xl shadow-xl dark:border-white/10 dark:bg-slate-900/80">
					{navItems.map((item) => {
						const isActive = pathname.startsWith(item.href);
						const Icon = item.icon;
						
						return (
							<Link
								key={item.href}
								href={item.href}
								className={cn(
									"flex flex-col items-center justify-center gap-1 rounded-full p-2 min-w-[4rem] transition-all",
									isActive 
										? "text-primary bg-primary/10" 
										: "text-muted-foreground hover:text-foreground"
								)}
							>
								<Icon className={cn("h-5 w-5 mb-0.5", isActive && "text-primary")} />
								<span className="text-[10px] font-medium leading-none">{item.label}</span>
							</Link>
						);
					})}
				</div>
			</div>
		</header>
	);
}

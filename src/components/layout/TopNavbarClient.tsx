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
import { MobileMenu } from "./MobileMenu";

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
		<header className="fixed top-0 left-0 right-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
			<div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
				{/* Left: Brand & Mobile Menu */}
				<div className="flex items-center gap-4">
					<MobileMenu
						navItems={navItems}
						isLoggedIn={isLoggedIn}
						hasAdminAccess={hasAdminAccess}
					/>

					<Link
						href="/"
						className="flex items-center gap-2 transition-transform hover:scale-105 active:scale-95"
					>
						<div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white shadow-sm">
							<LibraryBig className="h-5 w-5" />
						</div>
						<span className="text-xl font-bold tracking-tight text-foreground hidden sm:inline-block">
							Knižnica
						</span>
					</Link>
				</div>

				{/* Middle: Desktop Navigation Links */}
				<nav className="hidden md:flex items-center gap-6">
					{navItems.map((item) => {
						const isActive = pathname.startsWith(item.href);
						const Icon = item.icon;

						return (
							<Link
								key={item.href}
								href={item.href}
								className={cn(
									"group flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary",
									isActive ? "text-primary" : "text-muted-foreground",
								)}
							>
								<Icon
									className={cn(
										"h-4 w-4",
										isActive
											? "text-primary"
											: "text-muted-foreground group-hover:text-primary",
									)}
								/>
								{item.label}
							</Link>
						);
					})}
				</nav>

				{/* Right: Actions */}
				<div className="flex items-center gap-2">
					<div className="flex items-center gap-1 sm:gap-2 mr-2 border-r pr-2 sm:pr-4 dark:border-slate-800">
						<ModeToggle triggerClassName="h-9 w-9 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800" />
						{isLoggedIn && (
							<NotificationBell triggerClassName="h-9 w-9 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800" />
						)}
					</div>

					{isLoggedIn ? (
						<div className="flex items-center gap-3">
							{hasAdminAccess && (
								<Link href="/admin" className="hidden lg:block">
									<Button
										variant="ghost"
										size="sm"
										className="gap-2 text-amber-600 hover:text-amber-700 hover:bg-amber-50 dark:text-amber-400 dark:hover:text-amber-300 dark:hover:bg-amber-950/50"
									>
										<ShieldCheck className="h-4 w-4" />
										<span>Admin</span>
									</Button>
								</Link>
							)}
							<ProfileDropdownMenu
								name={name}
								email={email}
								showAdminLink={hasAdminAccess}
							/>
						</div>
					) : (
						<div className="flex items-center gap-2">
							<Link href="/login" className="hidden sm:block">
								<Button variant="ghost" size="sm">
									Prihlásiť sa
								</Button>
							</Link>
							<Link href="/admin/login">
								<Button
									size="sm"
									className="gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white shadow-md border-0"
								>
									<ShieldCheck className="h-4 w-4" />
									<span className="hidden sm:inline-block">Admin</span>
								</Button>
							</Link>
						</div>
					)}
				</div>
			</div>
		</header>
	);
}

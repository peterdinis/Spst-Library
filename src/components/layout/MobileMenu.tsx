"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, LibraryBig, ShieldCheck, LogIn } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
	DialogClose,
} from "@/components/ui/dialog";
import type { LucideIcon } from "lucide-react";

interface NavItem {
	href: string;
	label: string;
	icon: LucideIcon;
}

interface MobileMenuProps {
	navItems: NavItem[];
	isLoggedIn: boolean;
	hasAdminAccess: boolean;
}

export function MobileMenu({
	navItems,
	isLoggedIn,
	hasAdminAccess,
}: MobileMenuProps) {
	const pathname = usePathname();

	return (
		<Dialog>
			<DialogTrigger
				render={<Button variant="ghost" size="icon" className="md:hidden" />}
			>
				<Menu className="h-6 w-6" />
				<span className="sr-only">Menu</span>
			</DialogTrigger>
			<DialogContent className="sm:max-w-xs h-full top-0 left-0 translate-x-0 translate-y-0 rounded-none border-r">
				<DialogHeader className="flex flex-row items-center justify-between border-b pb-4">
					<DialogTitle className="flex items-center gap-2">
						<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white">
							<LibraryBig className="h-5 w-5" />
						</div>
						<span className="font-bold">Knižnica</span>
					</DialogTitle>
				</DialogHeader>
				<div className="flex flex-col gap-1 py-4">
					{navItems.map((item) => {
						const isActive = pathname.startsWith(item.href);
						const Icon = item.icon;

						return (
							<DialogClose
								key={item.href}
								render={
									<Link
										href={item.href}
										className={cn(
											"flex items-center gap-3 rounded-lg px-3 py-3 text-base font-medium transition-colors",
											isActive
												? "bg-primary/10 text-primary"
												: "text-muted-foreground hover:bg-slate-100 hover:text-foreground dark:hover:bg-slate-800",
										)}
									/>
								}
							/>
						);
					})}
				</div>
				<div className="mt-auto border-t pt-4">
					{!isLoggedIn && (
						<div className="flex flex-col gap-2">
							<DialogClose
								render={
									<Link href="/login" className="w-full">
										<Button
											variant="outline"
											className="w-full justify-start gap-2"
										>
											<LogIn className="h-4 w-4" />
											Prihlásiť sa
										</Button>
									</Link>
								}
							/>
							<DialogClose
								render={
									<Link href="/admin/login" className="w-full">
										<Button className="w-full justify-start gap-2 bg-gradient-to-r from-violet-600 to-indigo-600">
											<ShieldCheck className="h-4 w-4" />
											Admin
										</Button>
									</Link>
								}
							/>
						</div>
					)}
					{isLoggedIn && hasAdminAccess && (
						<DialogClose
							render={
								<Link href="/admin" className="w-full">
									<Button
										variant="ghost"
										className="w-full justify-start gap-2 text-amber-600 dark:text-amber-400"
									>
										<ShieldCheck className="h-4 w-4" />
										Administrácia
									</Button>
								</Link>
							}
						/>
					)}
				</div>
			</DialogContent>
		</Dialog>
	);
}

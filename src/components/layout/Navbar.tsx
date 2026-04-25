import Link from "next/link";
import type { Route } from "next";
import { auth } from "@/auth";
import { userHasAdminAccess } from "@/lib/admin-access";
import { siteConfig } from "@/lib/site-config";
import { ModeToggle } from "@/components/ModeToggle";
import { NotificationBell } from "@/components/NotificationBell";
import { ProfileDropdownMenu } from "@/components/layout/ProfileDropdownMenu";
import { BookOpenText } from "lucide-react";

const primaryLinks = [
	{ href: "/", label: "Domov" },
	{ href: "/books", label: "Katalóg" },
	{ href: "/my-books", label: "Moje výpožičky" },
] as const satisfies ReadonlyArray<{ href: Route; label: string }>;

const Navbar = async () => {
	const session = await auth();
	const isLoggedIn = Boolean(session?.user);
	const hasAdminAccess = isLoggedIn ? await userHasAdminAccess(session) : false;

	return (
		<header className="sticky top-0 z-40 border-b border-border/60 bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/80">
			<div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-3 px-4 sm:px-6">
				<Link
					href="/"
					className="group inline-flex items-center gap-2 rounded-md px-1 py-1 transition-colors hover:text-primary"
				>
					<span className="inline-flex size-8 items-center justify-center rounded-md bg-primary/10 text-primary">
						<BookOpenText className="size-4" />
					</span>
					<div className="leading-none">
						<p className="text-sm font-semibold tracking-tight">{siteConfig.name}</p>
						<p className="text-[11px] text-muted-foreground">Digitálna knižnica</p>
					</div>
				</Link>

				<nav className="items-center gap-1 md:flex">
					{primaryLinks.map((link) => (
						<Link
							key={link.href}
							href={link.href}
							className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
						>
							{link.label}
						</Link>
					))}
					{hasAdminAccess ? (
						<Link
							href="/admin"
							className="rounded-md px-3 py-2 text-sm font-semibold text-amber-600 transition-colors hover:bg-amber-100/70 dark:hover:bg-amber-500/10"
						>
							Administrácia
						</Link>
					) : null}
				</nav>

				<div className="flex items-center gap-1 sm:gap-2">
					{isLoggedIn ? <NotificationBell /> : null}
					<ModeToggle />
					{isLoggedIn ? (
						<ProfileDropdownMenu
							name={session?.user?.name}
							email={session?.user?.email}
							showAdminLink={hasAdminAccess}
						/>
					) : (
						<div className="flex items-center gap-2">
							<Link
								href="/login"
								className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
							>
								Prihlásiť sa
							</Link>
							<Link
								href="/admin/login"
								className="rounded-md bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
							>
								Admin
							</Link>
						</div>
					)}
				</div>
			</div>
		</header>
	);
};

export default Navbar;
import Link from "next/link";
import { auth } from "@/auth";
import { userHasAdminAccess } from "@/lib/admin-access";
import { Button } from "@/components/ui/button";
import { BookMarked } from "lucide-react";
import { ModeToggle } from "@/components/ModeToggle";
import { NotificationBell } from "@/components/NotificationBell";
import { ProfileDropdownMenu } from "@/components/layout/ProfileDropdownMenu";

export async function Navbar() {
	const session = await auth();
	const canAccessAdmin = session
		? await userHasAdminAccess(session)
		: false;

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
						<ProfileDropdownMenu
							name={session.user?.name}
							email={session.user?.email}
							showAdminLink={canAccessAdmin}
						/>
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

"use client";

import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BookMarked, Settings, User, Activity } from "lucide-react";

type ProfileDropdownMenuProps = {
	name?: string | null;
	email?: string | null;
};

/**
 * Samostatný client komponent: navigácia cez router (nie Link vnútri Menu.Item),
 * odhlásenie bez vnoreného &lt;button&gt; v položke menu — Base UI Menu inak padá / správa sa divne.
 */
export function ProfileDropdownMenu({ name, email }: ProfileDropdownMenuProps) {
	const router = useRouter();

	return (
		<DropdownMenu>
			<DropdownMenuTrigger className="group rounded-full border border-slate-200 py-1 pr-1 pl-2 transition-all duration-200 hover:border-primary/30 hover:bg-slate-50 focus:outline-none dark:border-slate-700 dark:hover:bg-slate-800/70">
				<div className="flex items-center gap-3">
					<div className="hidden flex-col items-end sm:flex">
						<span className="text-xs leading-none font-bold text-slate-900 dark:text-slate-50">
							{name}
						</span>
						<span className="text-[10px] font-medium text-slate-500 dark:text-slate-400">
							Používateľ
						</span>
					</div>
					<div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-background bg-indigo-100 shadow-sm group-hover:scale-105 dark:border-slate-700 dark:bg-indigo-500/30">
						<User className="h-4 w-4 text-indigo-600 dark:text-indigo-200" />
					</div>
				</div>
			</DropdownMenuTrigger>
			<DropdownMenuContent
				align="end"
				className="mt-2 w-64 rounded-2xl border-slate-200/60 bg-white p-2 shadow-xl dark:border-slate-700 dark:bg-slate-900"
			>
				<div className="mb-2 flex items-center gap-3 rounded-xl bg-slate-50/60 px-3 py-4 dark:bg-slate-800/80">
					<div className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-indigo-100 shadow-sm dark:border-slate-700 dark:bg-indigo-500/30">
						<User className="h-5 w-5 text-indigo-600 dark:text-indigo-200" />
					</div>
					<div className="min-w-0 flex flex-col">
						<span className="truncate text-sm font-bold text-slate-900 dark:text-slate-50">
							{name}
						</span>
						<span className="truncate text-xs text-slate-500 dark:text-slate-400">
							{email}
						</span>
					</div>
				</div>

				<DropdownMenuSeparator className="my-1 bg-slate-100 dark:bg-slate-700" />

				<DropdownMenuItem
					className="cursor-pointer gap-3 rounded-lg py-2 focus:bg-indigo-50 dark:focus:bg-indigo-950/60"
					onClick={() => router.push("/profile")}
				>
					<div className="rounded-md bg-indigo-100/50 p-1.5 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-200">
						<User className="h-3.5 w-3.5" />
					</div>
					<span className="font-medium text-slate-700 dark:text-slate-100">
						Môj profil
					</span>
				</DropdownMenuItem>

				<DropdownMenuItem
					className="cursor-pointer gap-3 rounded-lg py-2 focus:bg-emerald-50 dark:focus:bg-emerald-950/60"
					onClick={() => router.push("/my-books")}
				>
					<div className="rounded-md bg-emerald-100/50 p-1.5 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-200">
						<BookMarked className="h-3.5 w-3.5" />
					</div>
					<span className="font-medium text-slate-700 dark:text-slate-100">
						Moje výpožičky
					</span>
				</DropdownMenuItem>

				<DropdownMenuItem
					className="cursor-pointer gap-3 rounded-lg py-2 focus:bg-amber-50 dark:focus:bg-amber-950/60"
					onClick={() => router.push("/admin")}
				>
					<div className="rounded-md bg-amber-100/50 p-1.5 text-amber-600 dark:bg-amber-500/20 dark:text-amber-200">
						<Settings className="h-3.5 w-3.5" />
					</div>
					<span className="font-semibold text-amber-700 dark:text-amber-200">
						Administrácia
					</span>
				</DropdownMenuItem>

				<DropdownMenuSeparator className="my-1 bg-slate-100 dark:bg-slate-700" />

				<DropdownMenuItem
					variant="destructive"
					className="cursor-pointer gap-3 rounded-lg py-2 text-rose-600 focus:bg-rose-50 dark:text-rose-400 dark:focus:bg-rose-950/60"
					onClick={() => signOut({ callbackUrl: "/" })}
				>
					<div className="rounded-md bg-rose-100/50 p-1.5 dark:bg-rose-500/20">
						<Activity className="h-3.5 w-3.5 animate-pulse" />
					</div>
					<span className="font-bold">Odhlásiť sa</span>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

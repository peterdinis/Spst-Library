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
import { cn } from "@/lib/utils";

type ProfileDropdownMenuProps = {
	name?: string | null;
	email?: string | null;
	showAdminLink?: boolean;
	triggerClassName?: string;
};

export function ProfileDropdownMenu({
	name,
	email,
	showAdminLink = false,
	triggerClassName,
}: ProfileDropdownMenuProps) {
	const router = useRouter();

	return (
		<DropdownMenu>
			<DropdownMenuTrigger
				className={cn(
					"group rounded-full border border-slate-200 py-1 pr-1 pl-2 transition-all duration-200 hover:border-primary/30 hover:bg-slate-50 focus:outline-none dark:border-slate-700 dark:hover:bg-slate-800/70",
					triggerClassName,
				)}
			>
				<div className="flex items-center gap-3">
					<div className="hidden flex-col items-end xl:flex">
						<span className="text-xs leading-none font-bold text-slate-900 dark:text-slate-50">
							{name}
						</span>
						<span className="text-[10px] font-medium text-slate-500 dark:text-slate-400">
							{showAdminLink ? "Administrátor" : "Používateľ"}
						</span>
					</div>
					<div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-background bg-violet-100 shadow-sm group-hover:scale-105 dark:border-slate-700 dark:bg-violet-500/30">
						<User className="h-4 w-4 text-violet-600 dark:text-violet-200" />
					</div>
				</div>
			</DropdownMenuTrigger>
			<DropdownMenuContent
				align="end"
				className="mt-2 w-64 rounded-2xl border-slate-200/60 bg-white p-2 shadow-xl dark:border-slate-700 dark:bg-slate-900"
			>
				<div className="mb-2 flex items-center gap-3 rounded-xl bg-slate-50/60 px-3 py-4 dark:bg-slate-800/80">
					<div className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-violet-100 shadow-sm dark:border-slate-700 dark:bg-violet-500/30">
						<User className="h-5 w-5 text-violet-600 dark:text-violet-200" />
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
					className="cursor-pointer gap-3 rounded-lg py-2 focus:bg-violet-50 dark:focus:bg-violet-950/60"
					onClick={() => router.push("/profile")}
				>
					<div className="rounded-md bg-violet-100/50 p-1.5 text-violet-600 dark:bg-violet-500/20 dark:text-violet-200">
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
					className="cursor-pointer gap-3 rounded-lg py-2 focus:bg-slate-100 dark:focus:bg-slate-800/80"
					onClick={() => router.push("/settings")}
				>
					<div className="rounded-md bg-slate-200/80 p-1.5 text-slate-700 dark:bg-slate-600/40 dark:text-slate-200">
						<Settings className="h-3.5 w-3.5" />
					</div>
					<span className="font-medium text-slate-700 dark:text-slate-100">
						Nastavenia
					</span>
				</DropdownMenuItem>

				{showAdminLink ? (
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
				) : null}

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

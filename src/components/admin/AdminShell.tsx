"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
	LayoutDashboard,
	BookOpen,
	Users,
	Tags,
	ChevronRight,
	PanelLeftClose,
	PanelLeft,
	ClipboardList,
	Cloud,
	ShieldCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useState } from "react";

type NavItem = {
	href: string;
	label: string;
	icon: any;
	exact?: boolean;
};

const NAV: NavItem[] = [
	{ href: "/admin", label: "Prehľad", icon: LayoutDashboard, exact: true },
	{ href: "/admin/books", label: "Knihy", icon: BookOpen },
	{ href: "/admin/orders", label: "Objednávky", icon: ClipboardList },
	{ href: "/admin/users", label: "Všetci používatelia", icon: Users, exact: true },
	{ href: "/admin/users/regular", label: "Bežní používatelia", icon: Users },
	{ href: "/admin/permissions", label: "Práva", icon: ShieldCheck },
	{ href: "/admin/entra-users", label: "Microsoft Entra", icon: Cloud },
	{ href: "/admin/authors", label: "Autori", icon: Users },
	{ href: "/admin/categories", label: "Kategórie", icon: Tags },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
	const pathname = usePathname();
	const [collapsed, setCollapsed] = useState(false);

	return (
		<div
			className={cn(
				"flex w-full flex-1 items-start bg-slate-50 dark:bg-background",
				/* min výška pod navbarom (h-16); items-start aby sidebar nebol natiahnutý na výšku dlhej stránky — to rozbíja sticky */
				"min-h-[calc(100dvh-4rem)]",
			)}
		>
			<aside
				className={cn(
					"sticky top-16 z-30 flex max-h-[calc(100dvh-4rem)] shrink-0 flex-col border-r border-slate-200/80 bg-white transition-[width] duration-200 dark:border-border dark:bg-card",
					collapsed ? "w-[72px]" : "w-64",
				)}
			>
				<div className="flex max-h-[calc(100dvh-4rem)] min-h-0 flex-1 flex-col">
					<div className="flex shrink-0 items-center justify-between gap-2 border-b border-slate-200/80 p-3 dark:border-border">
						{!collapsed && (
							<div className="min-w-0 px-1">
								<p className="text-[10px] font-semibold uppercase tracking-widest text-slate-500 dark:text-muted-foreground">
									Správa
								</p>
								<p className="truncate text-sm font-bold text-slate-900 dark:text-foreground">
									Knižnica
								</p>
							</div>
						)}
						<Button
							type="button"
							variant="outline"
							size="icon-sm"
							className={cn("shrink-0 rounded-xl", collapsed && "mx-auto")}
							onClick={() => setCollapsed((c) => !c)}
							aria-label={collapsed ? "Rozbaliť menu" : "Zbaliť menu"}
						>
							{collapsed ? (
								<PanelLeft className="size-4" />
							) : (
								<PanelLeftClose className="size-4" />
							)}
						</Button>
					</div>

					<nav className="min-h-0 flex-1 space-y-1 overflow-y-auto overscroll-contain p-2">
						{NAV.map((item) => {
							const active = item.exact
								? pathname === item.href
								: pathname === item.href ||
									pathname.startsWith(`${item.href}/`);
							const Icon = item.icon;
							return (
								<Link
									key={item.href}
									href={item.href as any}
									className={cn(
										"flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
										active
											? "bg-slate-900 text-white dark:bg-primary dark:text-primary-foreground"
											: "text-slate-600 dark:text-muted-foreground hover:bg-slate-100 dark:hover:bg-muted/60",
										collapsed && "justify-center px-0",
									)}
									title={collapsed ? item.label : undefined}
								>
									<Icon className="size-4 shrink-0 opacity-90" />
									{!collapsed && (
										<>
											<span className="flex-1 truncate">{item.label}</span>
											{active && (
												<ChevronRight className="size-4 shrink-0 opacity-70" />
											)}
										</>
									)}
								</Link>
							);
						})}
					</nav>

					{!collapsed && (
						<div className="shrink-0 border-t border-slate-200/80 p-3 dark:border-border">
							<Link
								href="/"
								className="text-xs font-medium text-slate-500 hover:text-slate-900 dark:text-muted-foreground dark:hover:text-foreground"
							>
								← Späť na web
							</Link>
						</div>
					)}
				</div>
			</aside>

			<main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
		</div>
	);
}

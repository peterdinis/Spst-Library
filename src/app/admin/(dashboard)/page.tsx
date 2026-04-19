import type { Route } from "next";
import Link from "next/link";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	CardDescription,
} from "@/components/ui/card";
import {
	BookOpen,
	Users,
	Tags,
	ArrowRight,
	ClipboardList,
	Bell,
} from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminAzureIntegrationPanel } from "@/components/admin/AdminAzureIntegrationPanel";
import { buttonVariants } from "@/components/ui/button-variants";
import { cn } from "@/lib/utils";

export default function AdminDashboardPage() {
	const sections = [
		{
			title: "Knihy",
			description:
				"Pridávajte, upravujte a mažte knihy v katalógu vrátane obálok (Azure).",
			href: "/admin/books" as const,
			icon: BookOpen,
			iconBg:
				"bg-violet-100 text-violet-600 dark:bg-violet-950/80 dark:text-violet-300",
		},
		{
			title: "Objednávky",
			description:
				"Spracujte žiadosti čitateľov na prevzatie knihy v knižnici.",
			href: "/admin/orders" as const,
			icon: ClipboardList,
			iconBg:
				"bg-emerald-100 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300",
		},
		{
			title: "Notifikácie",
			description:
				"Audit udalostí v systéme: nové záznamy, požičania, vrátenia aj objednávky.",
			href: "/admin/notifications" as const,
			icon: Bell,
			iconBg:
				"bg-rose-100 text-rose-700 dark:bg-rose-950/80 dark:text-rose-300",
		},
		{
			title: "Autori",
			description: "Spravujte autorov, životopisy a fotky nahrané do úložiska.",
			href: "/admin/authors" as const,
			icon: Users,
			iconBg:
				"bg-amber-100 text-amber-700 dark:bg-amber-950/80 dark:text-amber-300",
		},
		{
			title: "Kategórie",
			description: "Organizujte knihy do žánrov a tematických okruhov.",
			href: "/admin/categories" as const,
			icon: Tags,
			iconBg:
				"bg-purple-100 text-purple-700 dark:bg-purple-950/80 dark:text-purple-300",
		},
	];

	return (
		<div className="space-y-10 pb-12">
			<AdminPageHeader
				title="Administrácia"
				description="Rýchly prehľad sekcií. Použite menu vľavo na prepínanie medzi knihami, autormi a kategóriami."
			/>

			<div className="space-y-3">
				<div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
					<h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
						Stav integrácií Azure
					</h2>
					<Link
						href={"/admin/azure" as Route}
						className={cn(
							buttonVariants({ variant: "outline", size: "sm" }),
							"rounded-xl w-fit",
						)}
					>
						Podrobnosti a kontrola premenných
					</Link>
				</div>
				<AdminAzureIntegrationPanel variant="compact" />
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{sections.map((section) => (
					<Link key={section.href} href={section.href}>
						<Card className="h-full border-slate-200/80 dark:border-border bg-white dark:bg-card hover:shadow-lg hover:border-primary/25 transition-all duration-200 rounded-2xl overflow-hidden group">
							<CardHeader className="pb-3">
								<div
									className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-105 transition-transform ${section.iconBg}`}
								>
									<section.icon className="h-6 w-6" />
								</div>
								<CardTitle className="text-xl text-slate-900 dark:text-foreground">
									{section.title}
								</CardTitle>
								<CardDescription className="text-slate-600 dark:text-muted-foreground leading-relaxed">
									{section.description}
								</CardDescription>
							</CardHeader>
							<CardContent className="pt-0">
								<div className="flex items-center text-sm font-semibold text-primary">
									Otvoriť sekciu
									<ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
								</div>
							</CardContent>
						</Card>
					</Link>
				))}
			</div>
		</div>
	);
}

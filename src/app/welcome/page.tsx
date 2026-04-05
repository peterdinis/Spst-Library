import { auth } from "@/auth";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
	CardContent,
} from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
	BookOpen,
	Library,
	User,
	ArrowRight,
	Sparkles,
	CheckCircle2,
} from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Vitajte",
	description: "Ste prihlásený do knižnice SPŠT.",
};

export default async function WelcomePage() {
	const session = await auth();

	if (!session?.user) {
		redirect("/login");
	}

	const name = (session?.user?.name || "").trim() || "čitateľ";
	const initial = name.charAt(0).toUpperCase() || "?";

	const linkButtonClass =
		"flex h-12 w-full items-center justify-between gap-2 rounded-2xl px-5 text-base font-semibold";

	return (
		<div className="relative min-h-[calc(100dvh-4rem)] overflow-x-hidden bg-background px-4 py-10 md:py-14">
			<div
				className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] bg-size-[24px_24px] opacity-50 mask-[radial-gradient(ellipse_65%_55%_at_50%_40%,#000_45%,transparent_100%)] dark:bg-[radial-gradient(rgba(255,255,255,0.06)_1px,transparent_1px)] dark:opacity-100"
				aria-hidden
			/>

			<div className="relative mx-auto grid w-full max-w-5xl gap-6 lg:grid-cols-[1.15fr_1fr] lg:items-stretch lg:gap-8">
				<Card className="overflow-hidden rounded-[2rem] border-border shadow-lg lg:rounded-[2.25rem]">
					<CardHeader className="space-y-4 pb-2">
						<p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-400">
							<CheckCircle2
								className="size-4 shrink-0 text-emerald-600 dark:text-emerald-400"
								aria-hidden
							/>
							Prihlásenie úspešné
						</p>
						<CardTitle className="font-heading text-3xl font-extrabold tracking-tight text-foreground md:text-4xl">
							Vitaj späť, {name}!
						</CardTitle>
						<CardDescription className="text-base leading-relaxed">
							Môžeš spravovať výpožičky, prehliadať katalóg a upraviť profil —
							všetko z jedného miesta.
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-6 pb-8 pt-4">
						<div className="grid gap-3 sm:grid-cols-2">
							<Link
								href="/my-books"
								className={cn(
									buttonVariants({ variant: "default" }),
									linkButtonClass,
								)}
							>
								<span className="flex items-center gap-2">
									<BookOpen className="size-4 shrink-0" />
									Moje výpožičky
								</span>
								<ArrowRight className="size-4 shrink-0 opacity-80" />
							</Link>
							<Link
								href="/books"
								className={cn(
									buttonVariants({ variant: "outline" }),
									linkButtonClass,
								)}
							>
								<span className="flex items-center gap-2">
									<Library className="size-4 shrink-0" />
									Katalóg kníh
								</span>
								<ArrowRight className="size-4 shrink-0 opacity-80" />
							</Link>
						</div>

						<div className="flex flex-col gap-4 rounded-2xl border border-border bg-muted/40 p-4 sm:flex-row sm:items-center sm:justify-between">
							<div className="flex min-w-0 items-center gap-3">
								<div
									className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground shadow-sm"
									aria-hidden
								>
									{initial}
								</div>
								<div className="min-w-0">
									<p className="text-sm font-semibold text-foreground">
										Tvoj profil
									</p>
									<p className="text-xs text-muted-foreground">
										Notifikácie, údaje účtu a história.
									</p>
								</div>
							</div>
							<Link
								href="/profile"
								className={cn(
									buttonVariants({ variant: "ghost", size: "sm" }),
									"shrink-0 gap-1.5 self-start sm:self-center",
								)}
							>
								<User className="size-4 shrink-0" />
								Otvoriť profil
							</Link>
						</div>
					</CardContent>
				</Card>

				<Card className="overflow-hidden rounded-[2rem] border-primary/25 bg-primary text-primary-foreground shadow-lg lg:rounded-[2.25rem]">
					<CardHeader className="space-y-3 pb-2">
						<div className="inline-flex w-fit items-center gap-2 rounded-full bg-primary-foreground/15 px-3 py-1 text-xs font-semibold text-primary-foreground backdrop-blur-sm">
							<Sparkles className="size-3.5 shrink-0 opacity-90" aria-hidden />
							Rýchly štart
						</div>
						<CardTitle className="font-heading text-2xl font-extrabold tracking-tight text-primary-foreground">
							Pokračuj v čítaní
						</CardTitle>
						<CardDescription className="text-base text-primary-foreground/85">
							V &quot;Moje výpožičky&quot; uvidíš aktuálne knihy a termíny
							vrátenia.
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-5 pb-8 pt-2">
						<div className="rounded-2xl border border-primary-foreground/20 bg-primary-foreground/10 px-4 py-3 text-sm leading-relaxed text-primary-foreground/95">
							V hornom menu prepínaš medzi katalógom, profilom a výpožičkami.
							Theme (svetlá / tmavá) nájdeš v hlavičke stránky.
						</div>
						<div className="space-y-2 text-sm text-primary-foreground/80">
							<p className="font-semibold text-primary-foreground">Tipy:</p>
							<ul className="list-inside list-disc space-y-1.5 marker:text-primary-foreground/50">
								<li>Skontroluj výpožičky pred koncom trimestra.</li>
								<li>V profile si nastav upozornenia na vrátenie.</li>
								<li>Prezri kategórie — nájdeš tam nové tituly.</li>
							</ul>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}

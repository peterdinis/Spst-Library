"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Bell, BookOpen, Mail, Settings } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { trpc } from "@/trpc/client";
import { toast } from "sonner";
import { CLIENT_STALE_TIME } from "@/trpc/cache-config";

export function SettingsPageClient() {
	const utils = trpc.useUtils();
	const { data: settings, isLoading } = trpc.settings.getSettings.useQuery(
		undefined,
		{ staleTime: CLIENT_STALE_TIME.settings },
	);

	const [local, setLocal] = useState({
		emailNotifications: true,
		dueReminders: true,
		systemUpdates: false,
		readingGoalInput: "" as string,
	});

	useEffect(() => {
		if (!settings) return;
		setLocal({
			emailNotifications: settings.emailNotifications,
			dueReminders: settings.dueReminders,
			systemUpdates: settings.systemUpdates,
			readingGoalInput:
				settings.readingGoal != null ? String(settings.readingGoal) : "",
		});
	}, [settings]);

	const update = trpc.settings.updateSettings.useMutation({
		onSuccess: () => {
			utils.settings.getSettings.invalidate();
			utils.profile.getDashboard.invalidate();
			toast.success("Nastavenia uložené");
		},
		onError: () => toast.error("Chyba pri ukladaní"),
	});

	const toggle = (
		key: "emailNotifications" | "dueReminders" | "systemUpdates",
		value: boolean,
	) => {
		setLocal((p) => ({ ...p, [key]: value }));
		update.mutate({ [key]: value });
	};

	const saveReadingGoal = () => {
		const trimmed = local.readingGoalInput.trim();
		if (trimmed === "") {
			update.mutate({ readingGoal: null });
			return;
		}
		const n = Number.parseInt(trimmed, 10);
		if (Number.isNaN(n) || n < 1) {
			toast.error("Zadajte celé číslo od 1 do 1000 alebo pole vyprázdnite.");
			return;
		}
		if (n > 1000) {
			toast.error("Maximum je 1000 kníh.");
			return;
		}
		update.mutate({ readingGoal: n });
	};

	return (
		<div className="mx-auto max-w-2xl space-y-8 pb-16">
			<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
				<div>
					<Link
						href="/profile"
						className="mb-3 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
					>
						<ArrowLeft className="h-4 w-4" />
						Späť na profil
					</Link>
					<h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
						<Settings className="h-8 w-8 text-primary" />
						Nastavenia účtu
					</h1>
					<p className="mt-2 text-muted-foreground">
						Notifikácie a osobná čitateľská výzva.
					</p>
				</div>
			</div>

			<Card className="rounded-3xl border-border/80 shadow-sm">
				<CardHeader>
					<CardTitle className="flex items-center gap-2 text-lg">
						<Bell className="h-5 w-5 text-violet-600" />
						Notifikácie
					</CardTitle>
					<CardDescription>
						Kedy vás môžeme kontaktovať e-mailom alebo v aplikácii.
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-8">
					<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
						<div className="space-y-1">
							<p className="font-semibold">E-mailové notifikácie</p>
							<p className="text-sm text-muted-foreground">
								Informácie o objednávkach a dôležitých zmenách.
							</p>
						</div>
						<Switch
							checked={local.emailNotifications}
							onCheckedChange={(v) => toggle("emailNotifications", v)}
							disabled={isLoading || update.isPending}
						/>
					</div>
					<div className="h-px bg-border" />
					<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
						<div className="space-y-1">
							<p className="font-semibold">Pripomienky vrátenia</p>
							<p className="text-sm text-muted-foreground">
								Upozornenie pred blížiacim sa termínom vrátenia knihy.
							</p>
						</div>
						<Switch
							checked={local.dueReminders}
							onCheckedChange={(v) => toggle("dueReminders", v)}
							disabled={isLoading || update.isPending}
						/>
					</div>
				</CardContent>
			</Card>

			<Card className="rounded-3xl border-border/80 shadow-sm">
				<CardHeader>
					<CardTitle className="flex items-center gap-2 text-lg">
						<BookOpen className="h-5 w-5 text-emerald-600" />
						Čitateľská výzva
					</CardTitle>
					<CardDescription>
						Ročný cieľ počtu kníh, ktoré si prečítate (podľa vrátených výpožičiek v
						histórii). Voliteľné – môžete kedykoľvek zmeniť alebo vypnúť vyprázdnením
						poľa.
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="space-y-2">
						<label
							htmlFor="reading-goal"
							className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
						>
							Počet kníh za rok (cieľ)
						</label>
						<div className="flex flex-col gap-3 sm:flex-row sm:items-end">
							<Input
								id="reading-goal"
								type="text"
								inputMode="numeric"
								placeholder="napr. 24"
								value={local.readingGoalInput}
								onChange={(e) =>
									setLocal((p) => ({
										...p,
										readingGoalInput: e.target.value.replace(/[^\d]/g, ""),
									}))
								}
								className="max-w-xs rounded-xl"
								disabled={isLoading}
							/>
							<Button
								type="button"
								onClick={saveReadingGoal}
								disabled={isLoading || update.isPending}
								className="rounded-xl"
							>
								Uložiť výzvu
							</Button>
						</div>
						<p className="text-xs text-muted-foreground">
							Prázdne pole = žiadny zobrazený cieľ na dashboarde profilu (nie je to
							limit výpožičiek).
						</p>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}

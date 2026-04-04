"use client";

import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
	CardContent,
} from "@/components/ui/card";
import { MicrosoftEntraSignInButton } from "@/components/auth/MicrosoftEntraSignInButton";
import { BookOpen, LogIn, Shield } from "lucide-react";

export default function LoginPage() {
	return (
		<div className="flex min-h-dvh items-center justify-center bg-background px-4">
			<Card className="relative z-10 w-full max-w-md overflow-hidden rounded-3xl border-border shadow-xl">
				<CardHeader className="space-y-4 border-b border-border px-8 pb-6 pt-10 text-center">
					<div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-emerald-500/20 bg-emerald-500/10 dark:border-emerald-400/25 dark:bg-emerald-400/10">
						<LogIn className="h-7 w-7 text-emerald-600 dark:text-emerald-400" />
					</div>
					<div className="space-y-1">
						<CardTitle className="text-3xl font-black tracking-tight text-foreground">
							Prihlásenie do knižnice
						</CardTitle>
						<CardDescription className="font-medium">
							Použite svoj školský Microsoft účet SPŠT na vstup do systému.
						</CardDescription>
					</div>
				</CardHeader>

				<CardContent className="space-y-6 px-8 py-7">
					<MicrosoftEntraSignInButton
						callbackUrl="/welcome"
						className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 text-base font-semibold text-white shadow-md transition-all hover:scale-[1.01] hover:bg-emerald-700 active:scale-[0.99] disabled:opacity-90 dark:bg-emerald-500 dark:hover:bg-emerald-400"
						icon={<BookOpen className="h-5 w-5" />}
					>
						Prihlásiť sa cez Microsoft
					</MicrosoftEntraSignInButton>

					<div className="flex items-start gap-3 rounded-2xl border border-border bg-muted/50 px-4 py-3 text-sm text-muted-foreground">
						<Shield className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
						<p>
							Prihlásenie je zabezpečené cez Microsoft Entra ID. Prihlásením
							súhlasíte s použitím školského účtu na správu výpožičiek a
							profilu.
						</p>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}

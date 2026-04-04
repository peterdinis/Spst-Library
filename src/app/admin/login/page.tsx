"use client";

import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
	CardContent,
} from "@/components/ui/card";
import { MicrosoftEntraSignInButton } from "@/components/auth/MicrosoftEntraSignInButton";

export default function AdminLoginPage() {
	return (
		<div className="relative flex min-h-dvh items-center justify-center bg-background p-4">
			<div
				className="pointer-events-none absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:20px_20px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] dark:bg-[radial-gradient(rgba(255,255,255,0.07)_1px,transparent_1px)]"
				aria-hidden
			/>

			<Card className="relative z-10 w-full max-w-md overflow-hidden rounded-[2.5rem] border-border shadow-2xl">
				<CardHeader className="space-y-3 pb-6 pt-12 text-center">
					<CardTitle className="text-3xl font-black tracking-tight text-foreground">
						Admin prihlásenie
					</CardTitle>
					<CardDescription className="font-medium">
						Prihláste sa cez Microsoft účet s administrátorským prístupom.
					</CardDescription>
				</CardHeader>
				<CardContent className="flex flex-col gap-4 px-8 pb-10">
					<MicrosoftEntraSignInButton
						callbackUrl="/admin"
						pendingHint="Presmerovanie na Microsoft…"
						className="h-12 w-full rounded-2xl bg-indigo-600 text-base font-semibold text-white shadow-md transition-all hover:scale-[1.02] hover:bg-indigo-700 active:scale-[0.98] disabled:opacity-90 dark:bg-indigo-500 dark:hover:bg-indigo-400"
					>
						Prihlásiť sa ako admin
					</MicrosoftEntraSignInButton>
				</CardContent>
			</Card>
		</div>
	);
}

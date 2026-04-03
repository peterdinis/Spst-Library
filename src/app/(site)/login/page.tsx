"use client";

import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
	CardContent,
} from "@/components/ui/card";
import { BookOpen, LogIn, Shield } from "lucide-react";

export default function LoginPage() {
	const handleMicrosoftLogin = () => {
		signIn("microsoft-entra-id", { callbackUrl: "/welcome" });
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
			<Card className="w-full max-w-md relative z-10 rounded-3xl border-slate-200/70 bg-white shadow-xl overflow-hidden">
				<CardHeader className="pt-10 pb-6 px-8 text-center space-y-4 border-b border-slate-100 bg-white">
					<div className="mx-auto w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center">
						<LogIn className="w-7 h-7 text-emerald-500" />
					</div>
					<div className="space-y-1">
						<CardTitle className="text-3xl font-black tracking-tight text-slate-900">
							Prihlásenie do knižnice
						</CardTitle>
						<CardDescription className="text-slate-500 font-medium">
							Použite svoj školský Microsoft účet SPŠT na vstup do systému.
						</CardDescription>
					</div>
				</CardHeader>

				<CardContent className="px-8 py-7 space-y-6 bg-white">
					<Button
						type="button"
						className="w-full h-12 rounded-2xl text-base font-semibold shadow-md bg-emerald-500 hover:bg-emerald-600 text-white hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2"
						onClick={handleMicrosoftLogin}
					>
						<BookOpen className="w-5 h-5" />
						Prihlásiť sa cez Microsoft
					</Button>

					<div className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3 flex items-start gap-3 text-sm text-slate-500">
						<Shield className="w-4 h-4 mt-0.5 text-emerald-500" />
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

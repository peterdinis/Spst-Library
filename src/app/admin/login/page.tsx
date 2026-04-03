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

export default function AdminLoginPage() {
	const handleMicrosoftAdminLogin = () => {
		// Admin login – rovnaké prihlásenie cez Microsoft, ale po úspechu smeruje do /admin
		signIn("microsoft-entra-id", { callbackUrl: "/admin" });
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
			<div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:20px_20px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]" />

			<Card className="w-full max-w-md relative z-10 rounded-[2.5rem] border-slate-200/60 shadow-2xl overflow-hidden">
				<CardHeader className="bg-white pt-12 pb-6 text-center space-y-3">
					<CardTitle className="text-3xl font-black tracking-tight text-slate-900">
						Admin prihlásenie
					</CardTitle>
					<CardDescription className="text-slate-500 font-medium">
						Prihláste sa cez Microsoft účet s administrátorským prístupom.
					</CardDescription>
				</CardHeader>
				<CardContent className="bg-white px-8 pb-10 flex flex-col gap-4">
					<Button
						type="button"
						className="w-full h-12 rounded-2xl text-base font-semibold shadow-md bg-indigo-600 hover:bg-indigo-700 text-white hover:scale-[1.02] active:scale-[0.98] transition-all"
						onClick={handleMicrosoftAdminLogin}
					>
						Prihlásiť sa ako admin
					</Button>
				</CardContent>
			</Card>
		</div>
	);
}

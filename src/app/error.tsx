"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { RefreshCcw, Home, AlertCircle, BookX } from "lucide-react";
import Link from "next/link";

export default function ErrorPage({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	useEffect(() => {
		// Odoslanie chyby do logovacieho systému
		console.error("Aplikácia narazila na chybu:", error);
	}, [error]);

	return (
		<div className="flex flex-col items-center justify-center min-h-[80vh] px-4 text-center">
			<motion.div
				initial={{ opacity: 0, scale: 0.9 }}
				animate={{ opacity: 1, scale: 1 }}
				transition={{ duration: 0.5 }}
				className="flex flex-col items-center gap-4"
			>
				<div className="relative flex items-center justify-center">
					<div className="absolute w-40 h-40 bg-destructive/10 rounded-full blur-3xl -z-10" />
					<div className="w-24 h-24 rounded-3xl bg-destructive/10 border border-destructive/30 flex items-center justify-center">
						<BookX className="w-12 h-12 text-destructive" />
					</div>
				</div>
			</motion.div>

			<motion.div
				initial={{ opacity: 0, y: 16 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5, delay: 0.1 }}
				className="space-y-6 max-w-lg mt-8"
			>
				<div className="flex items-center justify-center gap-3 text-destructive mb-2">
					<AlertCircle className="h-8 w-8" />
					<h1 className="text-3xl font-extrabold tracking-tight">
						Vyskytla sa chyba
					</h1>
				</div>

				<p className="text-lg text-slate-500 font-medium">
					Ospravedlňujeme sa, ale pri spracovaní vašej požiadavky došlo k
					neočakávanej chybe. Skúste to prosím znova alebo sa vráťte na hlavnú
					stránku.
				</p>

				<div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
					<Button
						onClick={() => reset()}
						size="lg"
						className="rounded-full px-8 h-14 font-bold shadow-xl shadow-primary/20 w-full"
					>
						<RefreshCcw className="mr-2 h-5 w-5" />
						Skúsiť znova
					</Button>
					<Link href="/">
						<Button
							size="lg"
							variant="outline"
							className="rounded-full px-8 h-14 font-bold border-2 w-full"
						>
							<Home className="mr-2 h-5 w-5" />
							Na hlavnú stránku
						</Button>
					</Link>
				</div>
			</motion.div>
		</div>
	);
}

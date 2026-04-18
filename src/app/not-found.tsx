"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Link from "next/link";
import { Search, Home, BookX } from "lucide-react";

export default function NotFound() {
	return (
		<div className="flex flex-col items-center justify-center min-h-[80vh] px-4 text-center">
			<motion.div
				initial={{ opacity: 0, y: -12 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
				className="flex flex-col items-center gap-4"
			>
				<div className="relative flex items-center justify-center">
					<div className="absolute w-40 h-40 bg-primary/10 rounded-full blur-3xl -z-10" />
					<div className="w-24 h-24 rounded-3xl bg-primary/10 border border-primary/30 flex items-center justify-center">
						<BookX className="w-12 h-12 text-primary" />
					</div>
				</div>
				<h1 className="text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-400 drop-shadow-sm">
					404
				</h1>
			</motion.div>

			<motion.div
				initial={{ opacity: 0, y: 16 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5, delay: 0.1 }}
				className="space-y-6 max-w-lg mt-6"
			>
				<h2 className="text-3xl font-extrabold tracking-tight">
					Stránka nebola nájdená
				</h2>
				<p className="text-lg text-slate-500 font-medium">
					Stránka, ktorú hľadáte, v našom archíve neexistuje alebo bola
					presunutá do iného regálu.
				</p>

				<div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
					<Link href="/books">
						<Button
							size="lg"
							className="rounded-full px-8 h-14 font-bold shadow-xl shadow-primary/20 w-full"
						>
							<Search className="mr-2 h-5 w-5" />
							Prehľadať katalóg
						</Button>
					</Link>
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

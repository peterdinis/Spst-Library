"use client";

import { BookCatalog } from "@/components/BookCatalog";
import { motion } from "framer-motion";
import { Library } from "lucide-react";

export default function BooksPage() {
	return (
		<div className="space-y-12 pb-16">
			<section className="relative overflow-hidden rounded-3xl bg-slate-900 text-white dark:bg-slate-800 py-16 px-8 sm:px-16 text-center shadow-xl">
				<div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-transparent opacity-60" />
				<motion.div
					initial={{ opacity: 0, scale: 0.95 }}
					animate={{ opacity: 1, scale: 1 }}
					transition={{ duration: 0.5 }}
					className="relative z-10 max-w-2xl mx-auto space-y-4"
				>
					<div className="inline-flex items-center justify-center p-4 bg-white/10 rounded-full mb-2 backdrop-blur-md">
						<Library className="h-8 w-8 text-primary-foreground" />
					</div>
					<h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight">
						Knižný Katalóg
					</h1>
					<p className="text-lg sm:text-xl text-slate-300">
						Objavte všetky knihy, vyhľadávajte podľa názvu alebo autora a ihneď
						si ich vypožičajte.
					</p>
				</motion.div>
			</section>

			<section>
				<BookCatalog />
			</section>
		</div>
	);
}

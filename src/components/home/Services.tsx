"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { FC } from "react";
import {
	BookOpen,
	Bookmark,
	Sparkles,
	Newspaper,
	FileText,
} from "lucide-react";

const services = [
	{
		title: "Moje výpožičky",
		icon: <Bookmark className="w-8 h-8" />,
		description: "Zoznam aktuálne požičaných kníh a dátumy vrátenia.",
		className: "col-span-1 row-span-1 bg-blue-500/10 dark:bg-blue-500/20",
	},
	{
		title: "Novinky v knižnici",
		icon: <Newspaper className="w-8 h-8" />,
		description: "Najnovšie knihy a doplnené tituly.",
		className: "col-span-1 row-span-1 bg-rose-500/10 dark:bg-rose-500/20",
	},
	{
		title: "Digitálne zdroje",
		icon: <FileText className="w-8 h-8" />,
		description: "PDF, prezentácie a ďalšie digitálne dokumenty.",
		className: "col-span-1 row-span-1 bg-amber-500/10 dark:bg-amber-500/20",
	},
	{
		title: "Knižničný katalóg",
		icon: <BookOpen className="w-8 h-8" />,
		description: "Vyhľadávanie kníh, autorov a žánrov.",
		className: "col-span-2 row-span-2 bg-indigo-500/10 dark:bg-indigo-500/20",
	},
	{
		title: "Odporúčané knihy",
		icon: <Sparkles className="w-8 h-8" />,
		description: "Výbery kníh pre študentov a triedy.",
		className: "col-span-2 row-span-1 bg-purple-500/10 dark:bg-purple-500/20",
	},
];

const Services: FC = () => {
	return (
		<section className="py-16 md:py-24">
			<div className="container mx-auto px-4">
				<div className="text-center mb-12 md:mb-16">
					<motion.h2
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6 }}
						className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight"
					>
						Knižničné služby
					</motion.h2>

					<motion.p
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.7 }}
						className="text-base md:text-lg text-black/50 dark:text-white/40 mt-4 max-w-xl mx-auto"
					>
						Prehľad najdôležitejších funkcií školskej knižnice.
					</motion.p>
				</div>

				{/* Bento Grid */}
				<div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 auto-rows-[150px] sm:auto-rows-[160px] lg:auto-rows-[180px] gap-4 md:gap-6">
					{services.map((item, i) => (
						<motion.div
							key={i}
							initial={{ opacity: 0, scale: 0.9 }}
							whileInView={{ opacity: 1, scale: 1 }}
							transition={{
								duration: 0.5,
								delay: i * 0.1,
								ease: [0.25, 0.4, 0.25, 1],
							}}
							whileHover={{ scale: 1.025 }}
							className={cn(
								"rounded-2xl md:rounded-3xl p-4 md:p-6 shadow-sm border border-black/5 dark:border-white/10 backdrop-blur-sm cursor-pointer hover:shadow-xl transition",
								"flex flex-col justify-between",
								item.className,
							)}
						>
							<div className="text-black dark:text-white">{item.icon}</div>

							<div>
								<h3 className="text-lg md:text-xl font-semibold mb-1 md:mb-2 text-black dark:text-white">
									{item.title}
								</h3>
								<p className="text-xs md:text-sm text-black/60 dark:text-white/50 leading-relaxed">
									{item.description}
								</p>
							</div>
						</motion.div>
					))}
				</div>
			</div>
		</section>
	);
};

export default Services;

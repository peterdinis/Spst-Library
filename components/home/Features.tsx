"use client";

import { easeOut, motion, type Variants } from "framer-motion";
import { BookOpen, Clock, Search, Shield } from "lucide-react";
import type { FC } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Features: FC = () => {
	const features = [
		{
			icon: BookOpen,
			title: "Rozsiahla zbierka",
			description: "Prístup k tisíckam kníh zo všetkých predmetov a ročníkov",
		},
		{
			icon: Search,
			title: "Jednoduché vyhľadávanie",
			description:
				"Nájdite knihy podľa kategórie, autora alebo predmetu pomocou intuitívneho vyhľadávania",
		},
		{
			icon: Clock,
			title: "Prístup 24/7",
			description:
				"Prezerajte a rezervujte knihy kedykoľvek a odkiaľkoľvek prostredníctvom našej digitálnej platformy",
		},
		{
			icon: Shield,
			title: "Bezpečný systém",
			description:
				"Bezpečná platforma s oddeleným prístupom pre učiteľov a študentov",
		},
	];

	const containerVariants: Variants = {
		hidden: {},
		visible: { transition: { staggerChildren: 0.15 } },
	};

	const cardVariants: Variants = {
		hidden: { opacity: 0, y: 40 },
		visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: easeOut } },
		hover: {
			scale: 1.08,
			y: -5,
			boxShadow: "0px 20px 40px rgba(0,0,0,0.15)",
			transition: { duration: 0.4, ease: easeOut },
		},
	};

	return (
		<section className="py-20">
			<div className="container mx-auto px-6">
				<div className="text-center mb-16">
					<h2 className="text-4xl font-extrabold mb-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
						Prečo si vybrať našu knižnicu?
					</h2>
					<p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
						Naša platforma kombinuje tradičné hodnoty knižnice s modernou
						technológiou a vytvára tak výnimočný zážitok z učenia
					</p>
				</div>

				<motion.div
					className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
					variants={containerVariants}
					initial="hidden"
					whileInView="visible"
					viewport={{ once: true }}
				>
					{features.map((feature) => {
						const IconComponent = feature.icon;
						return (
							<motion.div
								key={feature.title}
								variants={cardVariants}
								whileHover="hover"
							>
								<Card className="text-center rounded-3xl border-0 p-6 shadow-lg hover:shadow-2xl bg-white dark:bg-gray-900 transition-transform">
									<CardHeader>
										<div className="mx-auto w-16 h-16 bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 rounded-full flex items-center justify-center mb-4">
											<IconComponent className="h-8 w-8 text-white" />
										</div>
										<CardTitle className="text-lg font-semibold">
											{feature.title}
										</CardTitle>
									</CardHeader>
									<CardContent>
										<p className="text-gray-500 dark:text-gray-400 leading-relaxed">
											{feature.description}
										</p>
									</CardContent>
								</Card>
							</motion.div>
						);
					})}
				</motion.div>
			</div>
		</section>
	);
};

export default Features;

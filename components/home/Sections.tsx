"use client";

import { easeOut, motion } from "framer-motion";
import { ArrowRight, BookOpen, Users } from "lucide-react";
import type { FC } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

const Sections: FC = () => {
	const books = [
		{
			title: "Veľký Gatsby",
			author: "F. Scott Fitzgerald",
			category: "Klasická literatúra",
		},
		{
			title: "Stručná história času",
			author: "Stephen Hawking",
			category: "Veda",
		},
		{
			title: "Matematika pre každého",
			author: "John Smith",
			category: "Matematika",
		},
		{
			title: "Atlas svetových dejín",
			author: "National Geographic",
			category: "Dejiny",
		},
		{ title: "Základy biológie", author: "Mary Johnson", category: "Biológia" },
		{
			title: "Sprievodca kreatívnym písaním",
			author: "Sarah Wilson",
			category: "Jazykové umenie",
		},
		{ title: "Fyzika jednoducho", author: "Albert Chen", category: "Fyzika" },
		{ title: "Umenie cez veky", author: "Helen Davis", category: "Umenie" },
	];

	const containerVariants = {
		hidden: {},
		visible: { transition: { staggerChildren: 0.1 } },
	};

	const cardVariants = {
		hidden: { opacity: 0, y: 30 },
		visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: easeOut } },
		hover: {
			scale: 1.05,
			boxShadow: "0px 15px 30px rgba(0,0,0,0.12)",
			transition: { duration: 0.3 },
		},
	};

	return (
		<>
			{/* Odporúčané Knihy */}
			<section className="py-20 dark:bg-gray-900">
				<div className="container mx-auto px-6">
					<div className="text-center mb-16">
						<h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-500 to-indigo-500 bg-clip-text text-transparent">
							Odporúčané Knihy
						</h2>
						<p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
							Objavte naše najpopulárnejšie a odporúčané knihy naprieč všetkými
							predmetmi
						</p>
					</div>

					<motion.div
						className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
						variants={containerVariants}
						initial="hidden"
						whileInView="visible"
						viewport={{ once: true }}
					>
						{books.map((book) => (
							<motion.div
								key={book.title}
								variants={cardVariants}
								whileHover="hover"
							>
								<Card className="bg-white dark:bg-gray-800 border-0 rounded-3xl overflow-hidden shadow-lg transition-transform">
									<CardHeader className="pb-2">
										<div className="w-full h-32 bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center">
											<BookOpen className="h-12 w-12 text-white" />
										</div>
										<CardTitle className="text-sm font-semibold line-clamp-2 mt-2">
											{book.title}
										</CardTitle>
									</CardHeader>
									<CardContent className="pt-0">
										<p className="text-gray-500 dark:text-gray-300 text-sm mb-1">
											Autor: {book.author}
										</p>
										<p className="text-gray-400 dark:text-gray-400 text-xs">
											{book.category}
										</p>
									</CardContent>
								</Card>
							</motion.div>
						))}
					</motion.div>
				</div>
			</section>

			{/* Prehliadanie */}
			<section className="py-20 bg-gray-100 dark:bg-gray-800">
				<div className="container mx-auto px-6">
					<div className="text-center mb-16">
						<h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent">
							Začnite Objavovať
						</h2>
						<p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
							Prezrite si našu rozsiahlu zbierku organizovanú podľa kategórií a
							objavte svojich obľúbených autorov
						</p>
					</div>

					<motion.div
						className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-4xl mx-auto"
						variants={containerVariants}
						initial="hidden"
						whileInView="visible"
						viewport={{ once: true }}
					>
						{/* Kategórie Kníh */}
						<motion.div variants={cardVariants} whileHover="hover">
							<Card className="rounded-3xl border-0 shadow-lg hover:shadow-2xl transition-transform bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 text-white">
								<CardHeader className="pb-4">
									<div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center mb-4">
										<BookOpen className="h-6 w-6 text-indigo-600" />
									</div>
									<CardTitle className="text-2xl font-semibold">
										Kategórie Kníh
									</CardTitle>
								</CardHeader>
								<CardContent>
									<p className="text-white/90 mb-6 leading-relaxed">
										Preskúmajte knihy organizované podľa oblastí, vrátane
										Beletrie, Vedy, Matematiky, Dejín a ďalších.
									</p>
									<Button
										asChild
										className="w-full bg-white text-indigo-600 hover:text-indigo-700 hover:shadow-lg transition-all"
									>
										<a
											href="/categories"
											className="flex items-center justify-center space-x-2"
										>
											<span>Prezrieť Kategórie</span>
											<ArrowRight className="h-4 w-4" />
										</a>
									</Button>
								</CardContent>
							</Card>
						</motion.div>

						{/* Odporúčaní Autori */}
						<motion.div variants={cardVariants} whileHover="hover">
							<Card className="rounded-3xl border-0 shadow-lg hover:shadow-2xl transition-transform bg-gradient-to-tr from-pink-500 via-purple-500 to-indigo-500 text-white">
								<CardHeader className="pb-4">
									<div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center mb-4">
										<Users className="h-6 w-6 text-pink-500" />
									</div>
									<CardTitle className="text-2xl font-semibold">
										Odporúčaní Autori
									</CardTitle>
								</CardHeader>
								<CardContent>
									<p className="text-white/90 mb-6 leading-relaxed">
										Objavte diela renomovaných autorov od Shakespeara po
										Stephena Hawkinga a ďalších.
									</p>
									<Button
										asChild
										className="w-full bg-white text-pink-500 hover:text-pink-600 hover:shadow-lg transition-all"
									>
										<a
											href="/authors"
											className="flex items-center justify-center space-x-2"
										>
											<span>Spoznať Autorov</span>
											<ArrowRight className="h-4 w-4" />
										</a>
									</Button>
								</CardContent>
							</Card>
						</motion.div>
					</motion.div>
				</div>
			</section>
		</>
	);
};

export default Sections;

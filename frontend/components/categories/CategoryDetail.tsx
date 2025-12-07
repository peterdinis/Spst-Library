import React from "react";
import { Book, TrendingUp, Clock, Award } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

interface CategoryDetailProps {
	name: string;
	description: string;
	icon?: string;
	totalBooks: number;
	availableBooks: number;
	popularBooks: number;
	newBooks: number;
	mostBorrowedGenre?: string;
}

export const CategoryDetail: React.FC<CategoryDetailProps> = ({
	name,
	description,
	icon = "📚",
	totalBooks,
	availableBooks,
	popularBooks,
	newBooks,
	mostBorrowedGenre,
}) => {
	const stats = [
		{
			label: "Celkom kníh",
			value: totalBooks,
			icon: Book,
			color: "text-blue-600",
			bgColor: "bg-blue-50",
		},
		{
			label: "Dostupné",
			value: availableBooks,
			icon: TrendingUp,
			color: "text-green-600",
			bgColor: "bg-green-50",
		},
		{
			label: "Populárne",
			value: popularBooks,
			icon: Award,
			color: "text-yellow-600",
			bgColor: "bg-yellow-50",
		},
		{
			label: "Nové knihy",
			value: newBooks,
			icon: Clock,
			color: "text-purple-600",
			bgColor: "bg-purple-50",
		},
	];

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5 }}
		>
			<Card className="shadow-lg border-none bg-white/80 backdrop-blur">
				<CardHeader>
					<div className="flex items-start gap-4">
						<motion.div
							className="text-5xl"
							whileHover={{ scale: 1.2, rotate: 10 }}
							transition={{ duration: 0.3 }}
						>
							{icon}
						</motion.div>
						<div className="flex-1">
							<CardTitle className="text-3xl mb-2">{name}</CardTitle>
							<p className="text-gray-600 text-base leading-relaxed">
								{description}
							</p>
							{mostBorrowedGenre && (
								<motion.div
									className="mt-3"
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									transition={{ delay: 0.3 }}
								>
									<Badge variant="secondary" className="text-sm">
										Najčítanejší žáner: {mostBorrowedGenre}
									</Badge>
								</motion.div>
							)}
						</div>
					</div>
				</CardHeader>

				<CardContent>
					<motion.div
						className="grid grid-cols-2 md:grid-cols-4 gap-4"
						initial="hidden"
						animate="visible"
						variants={{
							hidden: { opacity: 0 },
							visible: {
								opacity: 1,
								transition: {
									staggerChildren: 0.1,
								},
							},
						}}
					>
						{stats.map((stat, index) => (
							<motion.div
								key={stat.label}
								variants={{
									hidden: { opacity: 0, y: 20 },
									visible: { opacity: 1, y: 0 },
								}}
								whileHover={{ scale: 1.05 }}
								transition={{ duration: 0.2 }}
							>
								<Card className="border-none shadow-sm hover:shadow-md transition-shadow">
									<CardContent className="p-4">
										<div
											className={`w-12 h-12 rounded-lg ${stat.bgColor} flex items-center justify-center mb-3`}
										>
											<stat.icon className={`h-6 w-6 ${stat.color}`} />
										</div>
										<div className="text-2xl font-bold text-gray-900 mb-1">
											{stat.value}
										</div>
										<div className="text-sm text-gray-600">{stat.label}</div>
									</CardContent>
								</Card>
							</motion.div>
						))}
					</motion.div>
				</CardContent>
			</Card>
		</motion.div>
	);
};

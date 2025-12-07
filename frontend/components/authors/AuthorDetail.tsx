import React from "react";
import { Book, Award, Calendar, Globe, TrendingUp, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { motion } from "framer-motion";

interface AuthorDetailProps {
	name: string;
	biography: string;
	birthYear?: number;
	deathYear?: number;
	nationality: string;
	totalBooks: number;
	availableBooks: number;
	mostPopularBook?: string;
	genres: string[];
	awards?: string[];
	avatarColor?: string;
}

export const AuthorDetail: React.FC<AuthorDetailProps> = ({
	name,
	biography,
	birthYear,
	deathYear,
	nationality,
	totalBooks,
	availableBooks,
	mostPopularBook,
	genres,
	awards = [],
	avatarColor = "bg-gradient-to-br from-blue-600 to-purple-600",
}) => {
	const initials = name
		.split(" ")
		.map((n) => n[0])
		.join("")
		.substring(0, 2);

	const stats = [
		{
			label: "Kníh v knižnici",
			value: totalBooks,
			icon: Book,
			color: "text-blue-600",
			bgColor: "bg-blue-50",
		},
		{
			label: "Dostupných",
			value: availableBooks,
			icon: TrendingUp,
			color: "text-green-600",
			bgColor: "bg-green-50",
		},
		{
			label: "Ocenení",
			value: awards.length,
			icon: Award,
			color: "text-yellow-600",
			bgColor: "bg-yellow-50",
		},
		{
			label: "Žánrov",
			value: genres.length,
			icon: Users,
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
					<div className="flex items-start gap-6">
						<motion.div
							whileHover={{ scale: 1.05 }}
							transition={{ duration: 0.3 }}
						>
							<Avatar
								className={`w-24 h-24 ${avatarColor} text-white text-2xl font-bold`}
							>
								<AvatarFallback className="bg-transparent text-white text-2xl">
									{initials}
								</AvatarFallback>
							</Avatar>
						</motion.div>

						<div className="flex-1">
							<CardTitle className="text-3xl mb-2">{name}</CardTitle>

							<div className="flex flex-wrap gap-3 mb-3 text-sm text-gray-600">
								{birthYear && (
									<motion.div
										className="flex items-center gap-1"
										initial={{ opacity: 0 }}
										animate={{ opacity: 1 }}
										transition={{ delay: 0.2 }}
									>
										<Calendar className="h-4 w-4" />
										<span>
											{birthYear}
											{deathYear ? ` - ${deathYear}` : " - súčasnosť"}
										</span>
									</motion.div>
								)}

								<motion.div
									className="flex items-center gap-1"
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									transition={{ delay: 0.3 }}
								>
									<Globe className="h-4 w-4" />
									<span>{nationality}</span>
								</motion.div>
							</div>

							<p className="text-gray-700 text-base leading-relaxed mb-3">
								{biography}
							</p>

							{mostPopularBook && (
								<motion.div
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									transition={{ delay: 0.4 }}
								>
									<Badge variant="secondary" className="text-sm">
										Najobľúbenejšie: {mostPopularBook}
									</Badge>
								</motion.div>
							)}
						</div>
					</div>
				</CardHeader>

				<CardContent className="space-y-6">
					{/* Štatistiky */}
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
						{stats.map((stat) => (
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

					{/* Žánre */}
					{genres.length > 0 && (
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ delay: 0.5 }}
						>
							<h3 className="font-semibold text-lg mb-3">Žánre</h3>
							<div className="flex flex-wrap gap-2">
								{genres.map((genre, index) => (
									<motion.div
										key={genre}
										initial={{ opacity: 0, scale: 0.8 }}
										animate={{ opacity: 1, scale: 1 }}
										transition={{ delay: 0.6 + index * 0.1 }}
										whileHover={{ scale: 1.1 }}
									>
										<Badge variant="outline" className="text-sm py-1 px-3">
											{genre}
										</Badge>
									</motion.div>
								))}
							</div>
						</motion.div>
					)}

					{/* Ocenenia */}
					{awards.length > 0 && (
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ delay: 0.7 }}
						>
							<h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
								<Award className="h-5 w-5 text-yellow-600" />
								Významné ocenenia
							</h3>
							<ul className="space-y-2">
								{awards.map((award, index) => (
									<motion.li
										key={award}
										className="text-gray-700 flex items-start gap-2"
										initial={{ opacity: 0, x: -20 }}
										animate={{ opacity: 1, x: 0 }}
										transition={{ delay: 0.8 + index * 0.1 }}
									>
										<span className="text-yellow-600 mt-1">•</span>
										<span>{award}</span>
									</motion.li>
								))}
							</ul>
						</motion.div>
					)}
				</CardContent>
			</Card>
		</motion.div>
	);
};

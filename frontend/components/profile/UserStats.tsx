"use client";

import { FC } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { BorrowRecord } from "@/lib/types";
import { motion } from "framer-motion";

interface UserStatsProps {
	borrows: BorrowRecord[];
}

const UserStats: FC<UserStatsProps> = ({ borrows }) => {
	const stats = {
		total: borrows.length,
		active: borrows.filter((b) => b.status === "active").length,
		returned: borrows.filter((b) => b.status === "returned").length,
		overdue: borrows.filter((b) => b.status === "overdue").length,
	};

	const statCards = [
		{
			title: "Celkovo vypožičaných",
			value: stats.total,
			icon: BookOpen,
			color: "text-blue-500",
			bgColor: "bg-blue-500/10",
		},
		{
			title: "Aktívne výpožičky",
			value: stats.active,
			icon: Clock,
			color: "text-yellow-500",
			bgColor: "bg-yellow-500/10",
		},
		{
			title: "Vrátené knihy",
			value: stats.returned,
			icon: CheckCircle,
			color: "text-green-500",
			bgColor: "bg-green-500/10",
		},
		{
			title: "Po termíne",
			value: stats.overdue,
			icon: AlertCircle,
			color: "text-red-500",
			bgColor: "bg-red-500/10",
		},
	];

	return (
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
			{statCards.map((stat, index) => (
				<motion.div
					key={stat.title}
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: index * 0.1 }}
				>
					<Card>
						<CardContent className="p-6">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-sm font-medium text-muted-foreground">
										{stat.title}
									</p>
									<p className="text-3xl font-bold mt-2">{stat.value}</p>
								</div>
								<div className={`p-3 rounded-full ${stat.bgColor}`}>
									<stat.icon className={`h-6 w-6 ${stat.color}`} />
								</div>
							</div>
						</CardContent>
					</Card>
				</motion.div>
			))}
		</div>
	);
};

export default UserStats;

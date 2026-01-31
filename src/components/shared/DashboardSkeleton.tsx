import { motion } from "framer-motion";

const DashboardSkeleton = () => {
	return (
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
			{[1, 2, 3, 4, 5, 6].map((i) => (
				<motion.div
					key={i}
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.4, delay: i * 0.05 }}
					className="rounded-2xl border border-border/50 p-5 bg-card/50 backdrop-blur-sm shadow-sm overflow-hidden relative group"
				>
					{/* Shimmer Effect */}
					<div className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-primary/5 to-transparent group-hover:animate-shimmer" />

					<div className="flex gap-4 relative z-10">
						{/* Shimmer image */}
						<div className="h-32 w-24 shrink-0 rounded-lg bg-muted animate-pulse" />

						<div className="flex-1 space-y-3">
							<div className="h-5 w-3/4 rounded-md bg-muted animate-pulse" />
							<div className="space-y-2">
								<div className="h-3 w-1/2 rounded-md bg-muted animate-pulse" />
								<div className="h-3 w-1/3 rounded-md bg-muted animate-pulse" />
							</div>

							<div className="flex gap-2 pt-2">
								<div className="h-5 w-12 rounded-full bg-muted animate-pulse" />
								<div className="h-5 w-12 rounded-full bg-muted animate-pulse" />
							</div>
						</div>
					</div>

					<div className="mt-6 pt-4 border-t border-border/50 flex items-center justify-between">
						<div className="h-4 w-20 rounded-md bg-muted animate-pulse" />
						<div className="h-8 w-16 rounded-lg bg-muted animate-pulse" />
					</div>
				</motion.div>
			))}
		</div>
	);
};

export default DashboardSkeleton;

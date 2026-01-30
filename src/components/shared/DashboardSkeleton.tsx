import { motion } from "framer-motion";

const DashboardSkeleton = () => {
	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.4 }}
			className="rounded-xl border border-gray-200 dark:border-gray-800 p-4 shadow-sm bg-linear-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 overflow-hidden relative"
		>
			{/* Optimized background */}
			<div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
				<div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-indigo-500/10 blur-3xl animate-pulse" />
				<div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-purple-500/10 blur-3xl animate-pulse delay-700" />
			</div>

			<div className="space-y-4 relative z-10">
				{/* Header with pulsing avatar and text */}
				<div className="flex space-x-4">
					{/* Avatar skeleton */}
					<div className="relative">
						<div className="h-32 w-24 rounded-xl bg-muted animate-pulse" />
					</div>

					{/* Text content */}
					<div className="flex-1 space-y-4">
						{/* Title line */}
						<div className="flex items-center space-x-2">
							<div className="h-6 w-3/4 rounded-md bg-muted animate-pulse" />
						</div>

						{/* Subtitle lines */}
						<div className="space-y-3">
							<div className="h-4 w-1/2 rounded-md bg-muted animate-pulse" />
							<div className="h-4 w-1/3 rounded-md bg-muted animate-pulse" />
						</div>

						{/* Tags */}
						<div className="flex items-center space-x-3 pt-2">
							{[1, 2, 3].map((i) => (
								<div
									key={i}
									className="h-6 w-16 rounded-md bg-muted animate-pulse"
								/>
							))}
						</div>
					</div>
				</div>

				{/* Stats section */}
				<div className="flex justify-between items-center pt-4 border-t border-gray-100 dark:border-gray-700">
					<div className="h-4 w-24 rounded-md bg-muted animate-pulse" />
					<div className="h-8 w-20 rounded-md bg-muted animate-pulse" />
				</div>

				{/* Progress bar */}
				<div className="relative h-2 rounded-full bg-muted overflow-hidden mt-4">
					<motion.div
						animate={{
							x: ["-100%", "100%"],
						}}
						transition={{
							duration: 2,
							repeat: Infinity,
							ease: "easeInOut",
						}}
						className="absolute inset-0 bg-linear-to-r from-transparent via-primary/20 to-transparent"
					/>
				</div>
			</div>
		</motion.div>
	);
};

export default DashboardSkeleton;

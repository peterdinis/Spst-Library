import { motion } from "framer-motion";

const DashboardSkeleton = () => {
	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.4 }}
			className="rounded-xl border border-gray-200 dark:border-gray-800 p-4 shadow-sm bg-linear-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 overflow-hidden relative"
		>
			{/* Bouncing balls background */}
			<div className="absolute inset-0 overflow-hidden pointer-events-none">
				{/* Large bouncing ball */}
				<motion.div
					animate={{
						x: [0, 100, 0],
						y: [0, 50, 0],
					}}
					transition={{
						duration: 8,
						repeat: Infinity,
						ease: "easeInOut",
					}}
					className="absolute w-64 h-64 rounded-full bg-linear-to-br from-blue-100/20 to-purple-100/20 dark:from-blue-900/10 dark:to-purple-900/10 blur-xl"
				/>

				{/* Small bouncing balls */}
				{[1, 2, 3, 4, 5].map((i) => (
					<motion.div
						key={i}
						animate={{
							x: [0, Math.random() * 100 - 50, 0],
							y: [0, Math.random() * 100 - 50, 0],
						}}
						transition={{
							duration: 3 + i * 0.5,
							repeat: Infinity,
							ease: "easeInOut",
							delay: i * 0.2,
						}}
						className={`absolute w-${8 + i * 2} h-${8 + i * 2} rounded-full bg-linear-to-br ${
							i % 3 === 0
								? "from-blue-100/30 to-cyan-100/30 dark:from-blue-900/20 dark:to-cyan-900/20"
								: i % 3 === 1
									? "from-purple-100/30 to-pink-100/30 dark:from-purple-900/20 dark:to-pink-900/20"
									: "from-green-100/30 to-teal-100/30 dark:from-green-900/20 dark:to-teal-900/20"
						} blur-md`}
						style={{
							left: `${20 + i * 15}%`,
							top: `${10 + i * 10}%`,
						}}
					/>
				))}
			</div>

			<div className="space-y-4 relative z-10">
				{/* Header with pulsing avatar and text */}
				<div className="flex space-x-4">
					{/* Avatar skeleton with bouncing ball inside */}
					<div className="relative">
						<div className="h-32 w-24 rounded-xl bg-linear-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 overflow-hidden">
							{/* Bouncing ball inside avatar */}
							<motion.div
								animate={{
									x: [0, 40, 0],
									y: [0, 20, 0],
								}}
								transition={{
									duration: 3,
									repeat: Infinity,
									ease: "easeInOut",
								}}
								className="absolute w-12 h-12 rounded-full bg-linear-to-br from-blue-300 to-purple-300 dark:from-blue-600 dark:to-purple-600 blur-sm"
							/>
							<motion.div
								animate={{
									x: [40, 0, 40],
									y: [20, 0, 20],
								}}
								transition={{
									duration: 4,
									repeat: Infinity,
									ease: "easeInOut",
									delay: 1,
								}}
								className="absolute w-8 h-8 rounded-full bg-linear-to-br from-pink-300 to-orange-300 dark:from-pink-600 dark:to-orange-600 blur-sm"
								style={{ right: 10, bottom: 10 }}
							/>
						</div>
						{/* Orbiting dots around avatar */}
						{[0, 1, 2].map((i) => (
							<motion.div
								key={i}
								animate={{
									rotate: 360,
								}}
								transition={{
									duration: 6,
									repeat: Infinity,
									ease: "linear",
								}}
								className="absolute"
								style={{
									left: "50%",
									top: "50%",
									transform: `translate(-50%, -50%) rotate(${i * 120}deg)`,
								}}
							>
								<motion.div
									animate={{
										scale: [1, 1.5, 1],
									}}
									transition={{
										duration: 1.5,
										repeat: Infinity,
										delay: i * 0.3,
									}}
									className="absolute w-3 h-3 rounded-full bg-linear-to-br from-blue-400 to-cyan-400 dark:from-blue-500 dark:to-cyan-500"
									style={{
										transform: `translateY(-48px)`,
									}}
								/>
							</motion.div>
						))}
					</div>

					{/* Text content with bouncing loaders */}
					<div className="flex-1 space-y-4">
						{/* Title line with bouncing dot */}
						<div className="flex items-center space-x-2">
							<div className="h-6 w-3/4 rounded-md bg-linear-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 overflow-hidden">
								<motion.div
									animate={{
										x: ["-100%", "100%"],
									}}
									transition={{
										duration: 1.8,
										repeat: Infinity,
										ease: "easeInOut",
									}}
									className="w-1/2 h-full bg-linear-to-r from-transparent via-white/50 to-transparent dark:via-gray-300/20"
								/>
							</div>
							<motion.div
								animate={{
									scale: [1, 1.2, 1],
								}}
								transition={{
									duration: 1.2,
									repeat: Infinity,
								}}
								className="w-2 h-2 rounded-full bg-linear-to-br from-blue-400 to-purple-400"
							/>
						</div>

						{/* Subtitle lines with bouncing balls */}
						<div className="space-y-3">
							{/* Line 1 */}
							<div className="flex items-center space-x-2">
								<motion.div
									animate={{
										y: [0, -4, 0],
									}}
									transition={{
										duration: 1,
										repeat: Infinity,
										delay: 0.1,
									}}
									className="w-2 h-2 rounded-full bg-linear-to-br from-green-400 to-teal-400"
								/>
								<div className="h-4 w-1/2 rounded-md bg-linear-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700" />
							</div>

							{/* Line 2 */}
							<div className="flex items-center space-x-2">
								<motion.div
									animate={{
										y: [0, -4, 0],
									}}
									transition={{
										duration: 1,
										repeat: Infinity,
										delay: 0.2,
									}}
									className="w-2 h-2 rounded-full bg-linear-to-br from-orange-400 to-yellow-400"
								/>
								<div className="h-4 w-1/3 rounded-md bg-linear-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700" />
							</div>
						</div>

						{/* Tags with bouncing dots */}
						<div className="flex items-center space-x-3 pt-2">
							{/* Bouncing tag dots */}
							{[1, 2, 3].map((i) => (
								<motion.div
									key={i}
									animate={{
										y: [0, -6, 0],
										scale: [1, 1.2, 1],
									}}
									transition={{
										duration: 0.8,
										repeat: Infinity,
										delay: i * 0.2,
									}}
									className="flex items-center space-x-1"
								>
									<div className="w-3 h-3 rounded-full bg-linear-to-br from-blue-400 to-cyan-400" />
									<div className="h-4 w-16 rounded-md bg-linear-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700" />
								</motion.div>
							))}
						</div>
					</div>
				</div>

				{/* Stats section with floating balls */}
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 0.3 }}
					className="flex justify-between items-center pt-4 border-t border-gray-100 dark:border-gray-700"
				>
					{/* Stats with orbiting balls */}
					<div className="relative">
						<div className="h-4 w-24 rounded-md bg-linear-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 mb-2" />

						{/* Orbiting stats dots */}
						<div className="flex space-x-1">
							{[1, 2, 3, 4, 5].map((i) => (
								<motion.div
									key={i}
									animate={{
										y: [0, -3, 0],
									}}
									transition={{
										duration: 0.6,
										repeat: Infinity,
										delay: i * 0.1,
									}}
									className="w-1.5 h-1.5 rounded-full bg-linear-to-br from-blue-400 to-purple-400"
								/>
							))}
						</div>

						{/* Floating stat ball */}
						<motion.div
							animate={{
								y: [0, -8, 0],
							}}
							transition={{
								duration: 1.5,
								repeat: Infinity,
								ease: "easeInOut",
							}}
							className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-linear-to-br from-green-400 to-teal-400"
						/>
					</div>

					{/* Button with bouncing ball inside */}
					<motion.div whileHover={{ scale: 1.05 }} className="relative">
						<div className="h-8 w-20 rounded-md bg-linear-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 overflow-hidden">
							{/* Bouncing button ball */}
							<motion.div
								animate={{
									x: [0, 48, 0],
								}}
								transition={{
									duration: 1.2,
									repeat: Infinity,
									ease: "easeInOut",
								}}
								className="absolute top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-linear-to-br from-blue-400 to-purple-400"
							/>
						</div>

						{/* Button orbiting dots */}
						{[-1, 0, 1].map((i) => (
							<motion.div
								key={i}
								animate={{
									rotate: 360,
								}}
								transition={{
									duration: 3,
									repeat: Infinity,
									ease: "linear",
									delay: i * 0.3,
								}}
								className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
							>
								<motion.div
									animate={{
										scale: [1, 1.5, 1],
									}}
									transition={{
										duration: 1,
										repeat: Infinity,
										delay: i * 0.2,
									}}
									className="w-1.5 h-1.5 rounded-full bg-linear-to-br from-pink-400 to-orange-400"
									style={{
										transform: `translateY(-18px)`,
									}}
								/>
							</motion.div>
						))}
					</motion.div>
				</motion.div>

				{/* Progress bar with bouncing ball */}
				<div className="relative h-2 rounded-full bg-linear-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 overflow-hidden mt-4">
					{/* Bouncing progress ball */}
					<motion.div
						animate={{
							x: ["0%", "100%"],
						}}
						transition={{
							duration: 2,
							repeat: Infinity,
							ease: "easeInOut",
						}}
						className="absolute w-4 h-4 rounded-full bg-linear-to-br from-blue-400 to-purple-400 -top-1"
					/>

					{/* Trail dots */}
					{[0, 1, 2, 3].map((i) => (
						<motion.div
							key={i}
							animate={{
								scale: [1, 0.5, 1],
								opacity: [0.3, 1, 0.3],
							}}
							transition={{
								duration: 2,
								repeat: Infinity,
								delay: i * 0.2,
							}}
							className="absolute w-1 h-1 rounded-full bg-linear-to-br from-blue-300 to-purple-300"
							style={{
								left: `${25 * (i + 1)}%`,
								top: "50%",
								transform: "translateY(-50%)",
							}}
						/>
					))}
				</div>
			</div>

			{/* Background floating particles */}
			<div className="absolute inset-0 pointer-events-none overflow-hidden">
				{Array.from({ length: 12 }).map((_, i) => (
					<motion.div
						key={i}
						animate={{
							x: [0, Math.random() * 100 - 50],
							y: [0, Math.random() * 100 - 50],
							scale: [1, 0.5, 1],
						}}
						transition={{
							duration: 4 + Math.random() * 2,
							repeat: Infinity,
							ease: "easeInOut",
							delay: i * 0.3,
						}}
						className={`absolute w-${Math.floor(Math.random() * 3) + 1} h-${
							Math.floor(Math.random() * 3) + 1
						} rounded-full ${
							i % 4 === 0
								? "bg-blue-300/20"
								: i % 4 === 1
									? "bg-purple-300/20"
									: i % 4 === 2
										? "bg-pink-300/20"
										: "bg-cyan-300/20"
						}`}
						style={{
							left: `${Math.random() * 100}%`,
							top: `${Math.random() * 100}%`,
						}}
					/>
				))}
			</div>
		</motion.div>
	);
};

export default DashboardSkeleton;

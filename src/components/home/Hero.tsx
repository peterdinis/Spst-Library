import { motion } from "framer-motion";
import { FC, memo } from "react";
import { ElegantShape } from "../ui/elegant-shape";
import { Link } from "@tanstack/react-router";

const Hero: FC = memo(() => {
	return (
		<section>
			<div className="relative min-h-screen -mt-16 w-full flex items-center justify-center overflow-hidden bg-white dark:bg-[#030303]">
				{/* Soft glow orb - optimized */}
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 0.65 }}
					transition={{ duration: 0.6, ease: "easeOut" }}
					className="absolute inset-0 flex items-center justify-center"
				>
					<div className="w-200 h-200 rounded-full bg-amber-300/20 dark:bg-amber-200/10 blur-[120px] will-change-transform" />
				</motion.div>

				{/* Decorative shapes - reduced delays and optimized rendering */}
				<div className="absolute inset-0 overflow-hidden">
					<ElegantShape
						delay={0}
						width={280}
						height={520}
						rotate={-6}
						borderRadius={26}
						gradient="from-indigo-400/[0.18] dark:from-indigo-400/[0.25]"
						className="left-[-10%] top-[-8%]"
					/>
					<ElegantShape
						delay={0.05}
						width={650}
						height={220}
						rotate={12}
						borderRadius={22}
						gradient="from-rose-400/[0.18] dark:from-rose-400/[0.25]"
						className="right-[-18%] bottom-[-6%]"
					/>
					<ElegantShape
						delay={0.1}
						width={260}
						height={260}
						rotate={22}
						borderRadius={30}
						gradient="from-amber-400/[0.20] dark:from-amber-300/[0.30]"
						className="left-[5%] top-[42%]"
					/>
					<ElegantShape
						delay={0.15}
						width={300}
						height={80}
						rotate={-20}
						borderRadius={18}
						gradient="from-emerald-400/[0.22] dark:from-emerald-400/[0.30]"
						className="right-[12%] top-[8%]"
					/>
				</div>

				{/* Content - optimized animations */}
				<div className="relative z-10 container mx-auto px-4 md:px-6">
					<div className="max-w-3xl mx-auto text-center">
						{/* Title */}
						<motion.div
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
							<motion.h1
								variants={{
									hidden: { opacity: 0, y: 30 },
									visible: {
										opacity: 1,
										y: 0,
										transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
									},
								}}
								className="text-5xl sm:text-7xl md:text-8xl font-black mb-6 tracking-tight leading-[1.1]"
							>
								<span className="bg-clip-text text-transparent bg-linear-to-b from-black to-black/70 dark:from-white dark:to-white/60">
									SPŠT Knižnica
								</span>
								<br />
								<motion.span
									variants={{
										hidden: { opacity: 0, scale: 0.9, y: 20 },
										visible: {
											opacity: 1,
											scale: 1,
											y: 0,
											transition: {
												duration: 1,
												ease: [0.22, 1, 0.36, 1],
											},
										},
									}}
									className="bg-clip-text text-transparent bg-linear-to-r from-indigo-500 via-rose-500 to-amber-500 dark:from-indigo-400 dark:via-rose-400 dark:to-amber-400"
								>
									Kde príbehy ožívajú.
								</motion.span>
							</motion.h1>
						</motion.div>

						{/* Subtitle */}
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
						>
							<p className="text-lg sm:text-xl text-black/60 dark:text-white/40 mb-12 max-w-xl mx-auto leading-relaxed font-medium">
								Objavte svet vedomostí v našej modernej digitálnej knižnici.
							</p>
						</motion.div>

						{/* CTA Buttons */}
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6, delay: 0.6, ease: "easeOut" }}
							className="flex flex-wrap justify-center gap-6"
						>
							<Link to="/books">
								<motion.button
									whileHover={{
										scale: 1.05,
										boxShadow: "0 10px 40px -10px rgba(79, 70, 229, 0.5)",
									}}
									whileTap={{ scale: 0.95 }}
									className="px-8 py-4 rounded-2xl bg-primary text-primary-foreground font-bold shadow-2xl shadow-primary/20 transition-all duration-300"
								>
									Preskúmať knihy
								</motion.button>
							</Link>

							<Link to="/categories">
								<motion.button
									whileHover={{
										scale: 1.05,
										backgroundColor: "rgba(0,0,0,0.05)",
									}}
									whileTap={{ scale: 0.95 }}
									className="px-8 py-4 rounded-2xl border border-border/50 font-bold backdrop-blur-md transition-all duration-300 dark:hover:bg-white/5"
								>
									Kategórie
								</motion.button>
							</Link>
						</motion.div>
					</div>
				</div>

				{/* Fade overlay */}
				<div className="absolute inset-0 bg-linear-to-t from-white via-transparent to-white/80 dark:from-[#030303] dark:via-transparent dark:to-[#030303]/80 pointer-events-none" />
			</div>
		</section>
	);
});

Hero.displayName = "Hero";

export default Hero;

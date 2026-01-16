import { motion, Variants } from "framer-motion";
import { FC } from "react";
import { ElegantShape } from "../ui/elegant-shape";
import { Link } from "@tanstack/react-router";

const Hero: FC = () => {
	const fadeUpVariants = {
		hidden: { opacity: 0, y: 30 },
		visible: (i: number) => ({
			opacity: 1,
			y: 0,
			transition: {
				duration: 1.1,
				delay: 0.4 + i * 0.2,
				ease: [0.25, 0.4, 0.25, 1],
			},
		}),
	};

	return (
		<section>
			<div className="relative min-h-screen -mt-16 w-full flex items-center justify-center overflow-hidden bg-white dark:bg-[#030303]">
				{/* Soft glow orb */}
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 0.65 }}
					transition={{ duration: 2 }}
					className="absolute inset-0 flex items-center justify-center"
				>
					<div className="w-200 h-200 rounded-full bg-amber-300/20 dark:bg-amber-200/10 blur-[120px]" />
				</motion.div>

				{/* Decorative shapes */}
				<div className="absolute inset-0 overflow-hidden">
					<ElegantShape
						delay={0.3}
						width={280}
						height={520}
						rotate={-6}
						borderRadius={26}
						gradient="from-indigo-400/[0.18] dark:from-indigo-400/[0.25]"
						className="left-[-10%] top-[-8%]"
					/>
					<ElegantShape
						delay={0.6}
						width={650}
						height={220}
						rotate={12}
						borderRadius={22}
						gradient="from-rose-400/[0.18] dark:from-rose-400/[0.25]"
						className="right-[-18%] bottom-[-6%]"
					/>
					<ElegantShape
						delay={0.45}
						width={260}
						height={260}
						rotate={22}
						borderRadius={30}
						gradient="from-amber-400/[0.20] dark:from-amber-300/[0.30]"
						className="left-[5%] top-[42%]"
					/>
					<ElegantShape
						delay={0.7}
						width={300}
						height={80}
						rotate={-20}
						borderRadius={18}
						gradient="from-emerald-400/[0.22] dark:from-emerald-400/[0.30]"
						className="right-[12%] top-[8%]"
					/>
				</div>

				{/* Content */}
				<div className="relative z-10 container mx-auto px-4 md:px-6">
					<div className="max-w-3xl mx-auto text-center">
						{/* Title */}
						<motion.div
							custom={1}
							variants={fadeUpVariants as unknown as Variants}
							initial="hidden"
							animate="visible"
						>
							<h1 className="text-4xl sm:text-6xl md:text-7xl font-bold mb-4 md:mb-6 tracking-tight leading-tight">
								<span className="bg-clip-text text-transparent bg-linear-to-b from-black to-black/70 dark:from-white dark:to-white/60">
									SPŠT Knižnica
								</span>
								<br />
								<span className="bg-clip-text text-transparent bg-linear-to-r from-indigo-400 via-rose-400 to-amber-400 dark:from-indigo-300 dark:via-rose-300 dark:to-amber-300">
									Moderné vzdelávanie, elegantný dizajn
								</span>
							</h1>
						</motion.div>

						{/* Subtitle */}
						<motion.div
							custom={2}
							variants={fadeUpVariants as unknown as Variants}
							initial="hidden"
							animate="visible"
						>
							<p className="text-base sm:text-lg md:text-xl text-black/50 dark:text-white/40 mb-10 max-w-2xl mx-auto leading-relaxed font-light">
								Digitálna knižnica SPŠT – rýchla, moderná a prehľadná.
							</p>
						</motion.div>

						{/* CTA Buttons */}
						<motion.div
							custom={3}
							variants={fadeUpVariants as unknown as Variants}
							initial="hidden"
							animate="visible"
						>
							<div className="flex justify-center gap-4 mt-4">
								{/* Všetky knihy */}
								<Link to="/books">
									<motion.button
										whileHover={{ scale: 1.05 }}
										whileTap={{ scale: 0.97 }}
										className="px-6 py-3 rounded-xl bg-indigo-500 text-white font-medium shadow-lg shadow-indigo-500/30 dark:shadow-indigo-400/20 hover:bg-indigo-600 transition"
									>
										Všetky knihy
									</motion.button>
								</Link>

								{/* Hlavná stránka */}
								<Link to="/">
									<motion.button
										whileHover={{ scale: 1.05 }}
										whileTap={{ scale: 0.97 }}
										className="px-6 py-3 rounded-xl border border-black/10 dark:border-white/20 font-medium text-black dark:text-white backdrop-blur-sm hover:bg-black/5 dark:hover:bg-white/10 transition"
									>
										Hlavná stránka
									</motion.button>
								</Link>
							</div>
						</motion.div>
					</div>
				</div>

				{/* Fade overlay */}
				<div className="absolute inset-0 bg-linear-to-t from-white via-transparent to-white/80 dark:from-[#030303] dark:via-transparent dark:to-[#030303]/80 pointer-events-none" />
			</div>
		</section>
	);
};

export default Hero;

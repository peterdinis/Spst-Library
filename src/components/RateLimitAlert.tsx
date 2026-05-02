"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

export function RateLimitAlert() {
	const [show, setShow] = useState(false);

	useEffect(() => {
		const handleRateLimit = () => {
			setShow(true);
			// Auto hide after 6 seconds
			const timer = setTimeout(() => setShow(false), 6000);
			return () => clearTimeout(timer);
		};

		window.addEventListener("rate-limit-exceeded", handleRateLimit);
		return () => {
			window.removeEventListener("rate-limit-exceeded", handleRateLimit);
		};
	}, []);

	return (
		<AnimatePresence>
			{show && (
				<motion.div
					initial={{ opacity: 0, y: -50, scale: 0.95 }}
					animate={{ opacity: 1, y: 0, scale: 1 }}
					exit={{ opacity: 0, y: -50, scale: 0.95 }}
					transition={{ type: "spring", bounce: 0.4, duration: 0.6 }}
					className="fixed top-24 left-1/2 z-50 w-[90%] max-w-md -translate-x-1/2"
				>
					<div className="relative overflow-hidden rounded-2xl border-2 border-red-500/30 bg-red-50/90 p-4 shadow-[0_0_40px_-10px_rgba(239,68,68,0.4)] backdrop-blur-xl dark:bg-red-950/80">
						<div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-red-500/20 blur-3xl" />

						<div className="relative flex items-start gap-4">
							<div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-900/50 dark:text-red-400 shadow-sm">
								<AlertTriangle className="h-5 w-5" />
							</div>
							<div className="flex-1 pt-1">
								<h3 className="font-extrabold text-red-900 dark:text-red-100 text-lg leading-none">
									Spomaľte prosím!
								</h3>
								<p className="mt-2 text-sm font-medium text-red-800/80 dark:text-red-200/80">
									Dosiahli ste limit požiadaviek. Náš systém zaznamenal príliš
									vysokú aktivitu. Skúste to znova o minútu.
								</p>
							</div>
							<button
								onClick={() => setShow(false)}
								className="shrink-0 rounded-lg p-1 text-red-500/60 hover:bg-red-500/10 hover:text-red-600 transition-colors"
							>
								<X className="h-4 w-4" />
							</button>
						</div>

						{/* Progress bar timer */}
						<motion.div
							initial={{ width: "100%" }}
							animate={{ width: "0%" }}
							transition={{ duration: 6, ease: "linear" }}
							className="absolute bottom-0 left-0 h-1 bg-red-500/40"
						/>
					</div>
				</motion.div>
			)}
		</AnimatePresence>
	);
}

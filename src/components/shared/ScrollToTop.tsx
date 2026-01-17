import { ChevronUp, ArrowUpToLine } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface ScrollToTopProps {
	threshold?: number;
	showAtBottom?: boolean;
	variant?: "default" | "floating" | "minimal";
	className?: string;
	offset?: number;
	smooth?: boolean;
}

export function ScrollToTop({
	threshold = 300,
	showAtBottom = false,
	variant = "floating",
	className = "",
	offset = 0,
	smooth = true,
}: ScrollToTopProps) {
	const [isVisible, setIsVisible] = useState(false);
	const [isAtBottom, setIsAtBottom] = useState(false);
	const [, setScrollProgress] = useState(0);

	// Funkcia na scrollovanie nahor
	const scrollToTop = () => {
		if (smooth) {
			window.scrollTo({
				top: offset,
				behavior: "smooth",
			});
		} else {
			window.scrollTo(0, offset);
		}
	};

	// Funkcia na sledovanie scrollu
	useEffect(() => {
		const handleScroll = () => {
			const scrollTop =
				window.pageYOffset || document.documentElement.scrollTop;
			const windowHeight = window.innerHeight;
			const docHeight = document.documentElement.scrollHeight;

			// Zobraziť tlačidlo po prekročení threshold
			setIsVisible(scrollTop > threshold);

			// Zistiť, či sme na spodku stránky
			const bottomOffset = 100; // Malý offset pre lepšiu UX
			setIsAtBottom(scrollTop + windowHeight >= docHeight - bottomOffset);

			// Vypočítať progress
			const totalScroll = docHeight - windowHeight;
			if (totalScroll > 0) {
				const progress = (scrollTop / totalScroll) * 100;
				setScrollProgress(Math.min(progress, 100));
			}
		};

		// Pridať event listener
		window.addEventListener("scroll", handleScroll);

		// Okamžite skontrolovať pozíciu
		handleScroll();

		return () => {
			window.removeEventListener("scroll", handleScroll);
		};
	}, [threshold]);

	// Varianty tlačidla
	const variants = {
		default: {
			buttonClass: "fixed bottom-6 right-6 z-50",
			icon: <ChevronUp className="h-4 w-4" />,
			showLabel: false,
			size: "default" as const,
		},
		floating: {
			buttonClass: "fixed bottom-8 right-8 z-50 shadow-lg",
			icon: <ArrowUpToLine className="h-5 w-5" />,
			showLabel: true,
			size: "default" as const,
		},
		minimal: {
			buttonClass: "fixed bottom-4 right-4 z-50",
			icon: <ChevronUp className="h-3 w-3" />,
			showLabel: false,
			size: "icon" as const,
		},
	};

	const { buttonClass, icon, size } = variants[variant];

	// Zobraziť len ak je viditeľný, alebo ak sme na spodku a chceme zobraziť aj tam
	const shouldShow = isVisible || (showAtBottom && isAtBottom);

	return (
		<AnimatePresence>
			{shouldShow && (
				<motion.div
					initial={{ opacity: 0, scale: 0.8, y: 20 }}
					animate={{ opacity: 1, scale: 1, y: 0 }}
					exit={{ opacity: 0, scale: 0.8, y: 20 }}
					transition={{
						type: "spring",
						stiffness: 200,
						damping: 20,
					}}
					className={cn(buttonClass, className)}
				>
					{/* Hlavné tlačidlo */}
					<motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
						<Button
							onClick={scrollToTop}
							size={size}
							className={cn(
								"relative overflow-hidden group",
								variant === "floating" && "rounded-full h-14 w-14 shadow-xl",
								variant === "default" && "rounded-md",
								variant === "minimal" && "rounded-full h-10 w-10",
							)}
							variant={variant === "minimal" ? "outline" : "default"}
						>
							{/* Hover efekt */}
							<motion.div
								className="absolute inset-0 bg-linear-to-br from-primary/10 to-primary/5"
								initial={{ opacity: 0 }}
								whileHover={{ opacity: 1 }}
								transition={{ duration: 0.2 }}
							/>

							{/* Animácia ikony */}
							<motion.div
								animate={{ y: [0, -2, 0] }}
								transition={{
									duration: 2,
									repeat: Infinity,
									repeatType: "reverse",
								}}
							>
								{icon}
							</motion.div>
						</Button>
					</motion.div>

					{/* Tooltip s progressom */}
				</motion.div>
			)}
		</AnimatePresence>
	);
}

// Enhanced variant s viacerými funkciami
export function EnhancedScrollToTop({
	threshold = 200,
	className = "",
}: {
	threshold?: number;
	className?: string;
}) {
	const [isVisible, setIsVisible] = useState(false);
	const [showOptions, setShowOptions] = useState(false);

	useEffect(() => {
		const handleScroll = () => {
			setIsVisible(window.pageYOffset > threshold);
		};

		window.addEventListener("scroll", handleScroll);
		handleScroll();

		return () => window.removeEventListener("scroll", handleScroll);
	}, [threshold]);

	const scrollTo = (position: number) => {
		window.scrollTo({
			top: position,
			behavior: "smooth",
		});
		setShowOptions(false);
	};

	return (
		<AnimatePresence>
			{isVisible && (
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					exit={{ opacity: 0, y: 20 }}
					className={cn("fixed bottom-8 right-8 z-50", className)}
				>
					<AnimatePresence>
						{showOptions && (
							<motion.div
								initial={{ opacity: 0, scale: 0.8 }}
								animate={{ opacity: 1, scale: 1 }}
								exit={{ opacity: 0, scale: 0.8 }}
								className="absolute right-0 bottom-full mb-4 space-y-2"
							>
								{[
									{ label: "Začiatok", position: 0, icon: "⇧" },
									{
										label: "⅓ stránky",
										position: document.documentElement.scrollHeight / 3,
										icon: "↥",
									},
									{
										label: "⅔ stránky",
										position: (document.documentElement.scrollHeight * 2) / 3,
										icon: "↧",
									},
								].map((option) => (
									<motion.div
										key={option.label}
										whileHover={{ scale: 1.05, x: -5 }}
										whileTap={{ scale: 0.95 }}
									>
										<Button
											variant="outline"
											size="sm"
											onClick={() => scrollTo(option.position)}
											className="w-full justify-start gap-2 bg-background/95 backdrop-blur"
										>
											<span>{option.icon}</span>
											<span>{option.label}</span>
										</Button>
									</motion.div>
								))}
							</motion.div>
						)}
					</AnimatePresence>

					<motion.div
						whileHover={{ scale: 1.1 }}
						whileTap={{ scale: 0.9 }}
						className="relative"
					>
						<Button
							onClick={() => setShowOptions(!showOptions)}
							size="icon"
							className="rounded-full h-12 w-12 shadow-xl bg-linear-to-br from-primary to-primary/80 text-primary-foreground"
						>
							<ChevronUp className="h-5 w-5" />
						</Button>

						{/* Bublinkový efekt */}
						<motion.div
							className="absolute inset-0 rounded-full border-2 border-primary/30"
							animate={{
								scale: [1, 1.2, 1],
								opacity: [0.7, 0, 0.7],
							}}
							transition={{
								duration: 2,
								repeat: Infinity,
							}}
						/>
					</motion.div>
				</motion.div>
			)}
		</AnimatePresence>
	);
}

// Minimalistický variant
export function MinimalScrollToTop({
	threshold = 400,
}: {
	threshold?: number;
}) {
	const [isVisible, setIsVisible] = useState(false);

	useEffect(() => {
		const handleScroll = () => {
			setIsVisible(window.pageYOffset > threshold);
		};

		window.addEventListener("scroll", handleScroll);
		handleScroll();

		return () => window.removeEventListener("scroll", handleScroll);
	}, [threshold]);

	const scrollToTop = () => {
		window.scrollTo({ top: 0, behavior: "smooth" });
	};

	return (
		<AnimatePresence>
			{isVisible && (
				<motion.button
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					exit={{ opacity: 0, y: 20 }}
					whileHover={{ scale: 1.1 }}
					whileTap={{ scale: 0.9 }}
					onClick={scrollToTop}
					className="fixed bottom-6 right-6 z-50 h-10 w-10 rounded-full bg-background border shadow-md flex items-center justify-center hover:bg-muted transition-colors group"
					aria-label="Scroll to top"
				>
					<motion.div
						animate={{ y: [0, -2, 0] }}
						transition={{
							duration: 1.5,
							repeat: Infinity,
							repeatType: "reverse",
						}}
						className="text-foreground/70 group-hover:text-foreground"
					>
						<ChevronUp className="h-4 w-4" />
					</motion.div>
				</motion.button>
			)}
		</AnimatePresence>
	);
}

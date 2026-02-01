import { useEffect, useState } from "react";
import { useRouter } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";

export function LoadingBar() {
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		const unsubscribe = router.subscribe("onBeforeNavigate", () => {
			setIsLoading(true);
		});

		const unsubscribeDone = router.subscribe("onLoad", () => {
			setIsLoading(false);
		});

		return () => {
			unsubscribe();
			unsubscribeDone();
		};
	}, [router]);

	return (
		<AnimatePresence>
			{isLoading && (
				<motion.div
					initial={{ width: "0%", opacity: 0 }}
					animate={{ width: "100%", opacity: 1 }}
					exit={{ opacity: 0 }}
					transition={{
						width: { duration: 0.8, ease: "easeOut" },
						opacity: { duration: 0.2 },
					}}
					className="fixed top-0 left-0 right-0 h-1 bg-linear-to-r from-primary via-indigo-500 to-rose-500 z-[9999] shadow-[0_0_10px_rgba(var(--primary),0.5)]"
				/>
			)}
		</AnimatePresence>
	);
}

export default LoadingBar;

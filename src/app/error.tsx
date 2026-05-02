"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import {
	RefreshCcw,
	Home,
	AlertCircle,
	BookX,
	ChevronDown,
	ChevronUp,
	Copy,
	Check,
	Terminal,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function ErrorPage({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	const [showDetails, setShowDetails] = useState(false);
	const [copied, setCopied] = useState(false);

	useEffect(() => {
		console.error("Aplikácia narazila na chybu:", error);
	}, [error]);

	const copyToClipboard = () => {
		const errorInfo = `
Message: ${error.message}
Digest: ${error.digest || "N/A"}
Stack: ${error.stack || "N/A"}
    `.trim();

		navigator.clipboard.writeText(errorInfo);
		setCopied(true);
		toast.success("Informácie o chybe boli skopírované");
		setTimeout(() => setCopied(false), 2000);
	};

	return (
		<div className="relative flex flex-col items-center justify-center min-h-[90vh] px-4 overflow-hidden bg-background">
			{/* Background Decorations */}
			<div className="absolute inset-0 -z-10 overflow-hidden">
				<div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-destructive/10 rounded-full blur-[120px] animate-pulse" />
				<div
					className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px] animate-pulse"
					style={{ animationDelay: "1s" }}
				/>
			</div>

			<motion.div
				initial={{ opacity: 0, scale: 0.8 }}
				animate={{ opacity: 1, scale: 1 }}
				transition={{
					type: "spring",
					stiffness: 260,
					damping: 20,
				}}
				className="mb-8"
			>
				<div className="relative">
					<motion.div
						animate={{
							rotate: [0, 5, -5, 0],
							scale: [1, 1.05, 0.95, 1],
						}}
						transition={{
							duration: 5,
							repeat: Infinity,
							ease: "easeInOut",
						}}
						className="w-32 h-32 rounded-[2.5rem] bg-destructive/10 border-2 border-destructive/20 flex items-center justify-center backdrop-blur-sm shadow-2xl shadow-destructive/20"
					>
						<BookX className="w-16 h-16 text-destructive" />
					</motion.div>
					<motion.div
						initial={{ opacity: 0, scale: 0 }}
						animate={{ opacity: 1, scale: 1 }}
						transition={{ delay: 0.3 }}
						className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-destructive flex items-center justify-center text-white border-2 border-background"
					>
						<AlertCircle className="w-5 h-5" />
					</motion.div>
				</div>
			</motion.div>

			<div className="max-w-2xl w-full text-center space-y-8 relative z-10">
				<div className="space-y-4">
					<motion.h1
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.1 }}
						className="text-4xl md:text-5xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/70"
					>
						Ups! Niečo sa pokazilo
					</motion.h1>

					<motion.p
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.2 }}
						className="text-lg text-muted-foreground font-medium max-w-md mx-auto leading-relaxed"
					>
						Ospravedlňujeme sa, ale pri spracovaní vašej požiadavky došlo k
						neočakávanej chybe v knižničnom systéme.
					</motion.p>
				</div>

				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.3 }}
					className="flex flex-col sm:flex-row gap-4 justify-center items-center"
				>
					<Button
						onClick={() => reset()}
						size="lg"
						className="w-full sm:w-auto rounded-2xl h-14 px-8 font-bold text-lg shadow-xl shadow-primary/20 transition-all hover:scale-105 active:scale-95"
					>
						<RefreshCcw className="mr-2 h-5 w-5" />
						Skúsiť znova
					</Button>

					<Link href="/" className="w-full sm:w-auto">
						<Button
							size="lg"
							variant="outline"
							className="w-full sm:w-auto rounded-2xl h-14 px-8 font-bold text-lg border-2 transition-all hover:bg-secondary hover:scale-105 active:scale-95"
						>
							<Home className="mr-2 h-5 w-5" />
							Na hlavnú stránku
						</Button>
					</Link>
				</motion.div>

				{/* Technical Details Section */}
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 0.4 }}
					className="pt-4"
				>
					<button
						onClick={() => setShowDetails(!showDetails)}
						className="inline-flex items-center text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors group cursor-pointer"
					>
						<Terminal className="mr-2 h-4 w-4" />
						{showDetails
							? "Skryť technické detaily"
							: "Zobraziť technické detaily"}
						{showDetails ? (
							<ChevronUp className="ml-1 h-4 w-4 transition-transform group-hover:-translate-y-0.5" />
						) : (
							<ChevronDown className="ml-1 h-4 w-4 transition-transform group-hover:translate-y-0.5" />
						)}
					</button>

					<AnimatePresence>
						{showDetails && (
							<motion.div
								initial={{ opacity: 0, height: 0 }}
								animate={{ opacity: 1, height: "auto" }}
								exit={{ opacity: 0, height: 0 }}
								transition={{ duration: 0.3, ease: "easeInOut" }}
								className="overflow-hidden mt-4"
							>
								<div className="relative bg-card border rounded-2xl p-6 text-left shadow-inner group/details">
									<div className="absolute top-4 right-4 flex gap-2">
										<Button
											variant="ghost"
											size="icon"
											onClick={copyToClipboard}
											className="h-8 w-8 rounded-lg"
										>
											{copied ? (
												<Check className="h-4 w-4 text-green-500" />
											) : (
												<Copy className="h-4 w-4" />
											)}
										</Button>
									</div>

									<div className="space-y-4 font-mono text-xs md:text-sm">
										<div>
											<span className="text-destructive font-bold uppercase tracking-wider text-[10px]">
												Chybová správa
											</span>
											<p className="mt-1 text-foreground/90 break-words">
												{error.message || "Neznáma chyba"}
											</p>
										</div>
										{error.digest && (
											<div>
												<span className="text-primary font-bold uppercase tracking-wider text-[10px]">
													ID Chyby (Digest)
												</span>
												<p className="mt-1 text-foreground/90">
													{error.digest}
												</p>
											</div>
										)}
										<div className="opacity-50 group-hover/details:opacity-100 transition-opacity">
											<span className="font-bold uppercase tracking-wider text-[10px]">
												Stack Trace
											</span>
											<pre className="mt-2 p-3 bg-muted/50 rounded-lg overflow-x-auto max-h-[200px] whitespace-pre-wrap">
												{error.stack || "Stack trace nie je k dispozícii"}
											</pre>
										</div>
									</div>
								</div>
							</motion.div>
						)}
					</AnimatePresence>
				</motion.div>
			</div>

			{/* Footer text */}
			<motion.p
				initial={{ opacity: 0 }}
				animate={{ opacity: 0.4 }}
				transition={{ delay: 1 }}
				className="absolute bottom-8 text-[10px] uppercase tracking-[0.2em] font-bold"
			>
				Systémová chyba &bull; SPŠT Knižnica &bull; {new Date().getFullYear()}
			</motion.p>
		</div>
	);
}

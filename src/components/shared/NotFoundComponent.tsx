"use client";

import { Search, Home, ArrowLeft, Ghost } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { motion } from "framer-motion";
import { useRouter } from "@tanstack/react-router";

interface NotFoundComponentProps {
	title?: string;
	message?: string;
	showHome?: boolean;
	showBack?: boolean;
	searchSuggestion?: string;
	className?: string;
}

export function NotFoundComponent({
	title = "Stránka neexistuje",
	message = "Ospravedlňujeme sa, ale stránka, ktorú hľadáte, nebola nájdená.",
	showHome = true,
	showBack = true,
	searchSuggestion,
	className = "",
}: NotFoundComponentProps) {
	const router = useRouter();

	return (
		<motion.div
			initial={{ opacity: 0, scale: 0.9 }}
			animate={{ opacity: 1, scale: 1 }}
			exit={{ opacity: 0, scale: 0.9 }}
			transition={{ duration: 0.6, type: "spring", damping: 15 }}
			className={`max-w-lg mx-auto ${className}`}
		>
			<Card className="border-primary/20 shadow-xl overflow-hidden">
				<CardHeader className="text-center relative">
					<motion.div
						animate={{
							y: [0, -10, 0],
							rotate: [0, 5, -5, 0],
						}}
						transition={{
							duration: 4,
							repeat: Infinity,
							repeatType: "reverse",
						}}
						className="inline-block mb-6"
					>
						<div className="relative">
							<Ghost className="h-24 w-24 text-muted-foreground mx-auto" />
							<motion.div
								animate={{
									opacity: [0.2, 0.8, 0.2],
									scale: [0.8, 1.2, 0.8],
								}}
								transition={{
									duration: 3,
									repeat: Infinity,
								}}
								className="absolute inset-0 bg-primary/10 blur-xl rounded-full"
							/>
						</div>
					</motion.div>

					<CardTitle className="text-3xl font-bold bg-linear-to-r from-primary to-primary/60 bg-clip-text text-transparent">
						404
					</CardTitle>
					<p className="text-xl font-semibold mt-2">{title}</p>
				</CardHeader>

				<CardContent className="space-y-6">
					<p className="text-center text-muted-foreground text-lg">{message}</p>

					{searchSuggestion && (
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.3 }}
							className="bg-muted/50 p-4 rounded-lg border"
						>
							<div className="flex items-center gap-3">
								<Search className="h-5 w-5 text-primary" />
								<div>
									<p className="font-medium">Tip na hľadanie:</p>
									<p className="text-sm text-muted-foreground">
										{searchSuggestion}
									</p>
								</div>
							</div>
						</motion.div>
					)}

					<motion.div
						animate={{
							backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
						}}
						transition={{
							duration: 5,
							repeat: Infinity,
							ease: "linear",
						}}
						className="h-1 bg-linear-to-r from-transparent via-primary/30 to-transparent rounded-full"
					/>

					<div className="text-center">
						<h3 className="font-semibold mb-2">Čo môžete skúsiť:</h3>
						<ul className="text-sm text-muted-foreground space-y-1">
							<motion.li
								initial={{ opacity: 0, x: -20 }}
								animate={{ opacity: 1, x: 0 }}
								transition={{ delay: 0.4 }}
							>
								✓ Skontrolujte URL adresu
							</motion.li>
							<motion.li
								initial={{ opacity: 0, x: -20 }}
								animate={{ opacity: 1, x: 0 }}
								transition={{ delay: 0.5 }}
							>
								✓ Použite vyhľadávanie
							</motion.li>
							<motion.li
								initial={{ opacity: 0, x: -20 }}
								animate={{ opacity: 1, x: 0 }}
								transition={{ delay: 0.6 }}
							>
								✓ Vráťte sa na domovskú stránku
							</motion.li>
						</ul>
					</div>
				</CardContent>

				<CardFooter className="flex flex-col sm:flex-row gap-3 justify-center pt-6">
					{showBack && (
						<motion.div
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
							initial={{ opacity: 0, x: -20 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ delay: 0.7 }}
						>
							<Button
								variant="outline"
								onClick={() => router.history.back()}
								className="gap-2"
							>
								<ArrowLeft className="h-4 w-4" />
								Späť
							</Button>
						</motion.div>
					)}

					{showHome && (
						<motion.div
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
							initial={{ opacity: 0, x: 20 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ delay: 0.8 }}
						>
							<Button
								onClick={() => router.navigate({ to: "/" })}
								className="gap-2"
							>
								<Home className="h-4 w-4" />
								Domovská stránka
							</Button>
						</motion.div>
					)}
				</CardFooter>
			</Card>

			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ delay: 1 }}
				className="text-center mt-8"
			>
				<p className="text-xs text-muted-foreground">
					Ak si myslíte, že je to chyba, kontaktujte podporu.
				</p>
			</motion.div>
		</motion.div>
	);
}

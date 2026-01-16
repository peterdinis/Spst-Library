"use client";

import { AlertCircle, RefreshCw, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { motion } from "framer-motion";
import { useRouter } from "@tanstack/react-router";

interface ErrorComponentProps {
	title?: string;
	message?: string;
	error?: Error | string;
	showRetry?: boolean;
	showHome?: boolean;
	className?: string;
}

export function ErrorComponent({
	title = "Chyba",
	message = "Vyskytla sa neočakávaná chyba",
	error,
	showRetry = true,
	showHome = true,
	className = "",
}: ErrorComponentProps) {
	const router = useRouter();
	const errorMessage = typeof error === "string" ? error : error?.message;

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, y: -20 }}
			transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
			className={`max-w-md mx-auto ${className}`}
		>
			<Card className="border-destructive/50 shadow-lg">
				<CardHeader className="text-center">
					<motion.div
						animate={{
							rotate: [0, 10, -10, 10, 0],
							scale: [1, 1.1, 0.9, 1.1, 1],
						}}
						transition={{
							duration: 2,
							repeat: Infinity,
							repeatType: "reverse",
						}}
						className="inline-block mb-4"
					>
						<AlertCircle className="h-16 w-16 text-destructive mx-auto" />
					</motion.div>
					<CardTitle className="text-2xl text-destructive">{title}</CardTitle>
				</CardHeader>

				<CardContent className="space-y-4">
					<p className="text-center text-muted-foreground">{message}</p>

					{errorMessage && (
						<motion.div
							initial={{ opacity: 0, height: 0 }}
							animate={{ opacity: 1, height: "auto" }}
							transition={{ delay: 0.3 }}
						>
							<Alert variant="destructive" className="mt-4">
								<AlertTitle>Technické informácie</AlertTitle>
								<AlertDescription className="font-mono text-sm break-all">
									{errorMessage}
								</AlertDescription>
							</Alert>
						</motion.div>
					)}

					<motion.div
						animate={{
							backgroundColor: [
								"rgba(239, 68, 68, 0.1)",
								"rgba(239, 68, 68, 0.05)",
								"rgba(239, 68, 68, 0.1)",
							],
						}}
						transition={{ duration: 2, repeat: Infinity }}
						className="p-4 rounded-lg border border-destructive/20 mt-4"
					>
						<p className="text-sm text-center text-muted-foreground">
							Skúste obnoviť stránku alebo sa vráťte neskôr.
						</p>
					</motion.div>
				</CardContent>

				<CardFooter className="flex flex-col sm:flex-row gap-3 justify-center">
					{showRetry && (
						<motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
							<Button
								variant="outline"
								onClick={() => window.location.reload()}
								className="gap-2"
							>
								<RefreshCw className="h-4 w-4" />
								Skúsiť znova
							</Button>
						</motion.div>
					)}

					{showHome && (
						<motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
							<Button
								onClick={() => router.navigate({ to: "/" })}
								className="gap-2"
							>
								<Home className="h-4 w-4" />
								Domov
							</Button>
						</motion.div>
					)}
				</CardFooter>
			</Card>

			<motion.div
				animate={{
					opacity: [0.5, 1, 0.5],
				}}
				transition={{ duration: 2, repeat: Infinity }}
				className="text-center mt-6"
			>
				<p className="text-xs text-muted-foreground">
					Kód chyby: ERR_{Date.now().toString(36).toUpperCase()}
				</p>
			</motion.div>
		</motion.div>
	);
}

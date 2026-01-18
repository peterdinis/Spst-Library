import { FC, useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, Loader2, SearchIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface BooksSearchProps {
	onSearch: (query: string) => void;
	value?: string;
	placeholder?: string;
	className?: string;
	debounceMs?: number;
	disabled?: boolean;
}

export const BooksSearch: FC<BooksSearchProps> = ({
	onSearch,
	value = "",
	placeholder = "Hľadať knihy, autorov, ISBN...",
	className,
	debounceMs = 400,
	disabled = false,
}) => {
	const [inputValue, setInputValue] = useState(value);
	const [isDebouncing, setIsDebouncing] = useState(false);
	const [isFocused, setIsFocused] = useState(false);

	// Sync with external value
	useEffect(() => {
		setInputValue(value);
	}, [value]);

	// Debounced search
	useEffect(() => {
		if (inputValue === value) return;

		setIsDebouncing(true);
		const timer = setTimeout(() => {
			onSearch(inputValue);
			setIsDebouncing(false);
		}, debounceMs);

		return () => {
			clearTimeout(timer);
			setIsDebouncing(false);
		};
	}, [inputValue, onSearch, value, debounceMs]);

	const handleClear = useCallback(() => {
		setInputValue("");
		onSearch("");
	}, [onSearch]);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!isDebouncing) {
			onSearch(inputValue);
		}
	};

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === "Escape") {
			handleClear();
		}
	};

	return (
		<motion.form
			initial={{ opacity: 0, y: -10 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.2 }}
			onSubmit={handleSubmit}
			className={cn("relative w-full", className)}
		>
			<div className="relative group">
				<motion.div
					animate={{
						scale: isFocused ? 1.02 : 1,
						boxShadow: isFocused
							? "0 10px 40px rgba(0, 0, 0, 0.1)"
							: "0 2px 10px rgba(0, 0, 0, 0.05)",
					}}
					transition={{ type: "spring", stiffness: 400, damping: 30 }}
					className="relative rounded-xl overflow-hidden"
				>
					{/* Background gradient effect */}
					<div className="absolute inset-0 bg-linear-to-r from-primary/5 via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

					<div className="relative bg-background border border-border/60 rounded-xl">
						{/* Search icon with animation */}
						<motion.div
							animate={{
								scale: isFocused || inputValue ? 1.1 : 1,
								rotate: isFocused ? 5 : 0,
							}}
							transition={{ type: "spring", stiffness: 400 }}
							className="absolute left-3.5 top-1/2 -translate-y-1/2 z-10"
						>
							{isDebouncing ? (
								<Loader2 className="h-4.5 w-4.5 text-muted-foreground animate-spin" />
							) : (
								<SearchIcon className="h-4.5 w-4.5 text-muted-foreground" />
							)}
						</motion.div>

						{/* Main input */}
						<Input
							type="search"
							placeholder={placeholder}
							value={inputValue}
							onChange={(e) => setInputValue(e.target.value)}
							onFocus={() => setIsFocused(true)}
							onBlur={() => setIsFocused(false)}
							onKeyDown={handleKeyDown}
							disabled={disabled}
							className={cn(
								"pl-12 pr-28 py-6 text-base md:text-sm",
								"border-0 focus-visible:ring-0 focus-visible:ring-offset-0",
								"bg-transparent placeholder:text-muted-foreground/70",
								"transition-all duration-200",
								disabled && "opacity-60 cursor-not-allowed",
							)}
						/>

						{/* Right side controls */}
						<div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
							{/* Clear button */}
							<AnimatePresence mode="wait">
								{inputValue && !isDebouncing && (
									<motion.div
										key="clear"
										initial={{ opacity: 0, scale: 0.8, width: 0 }}
										animate={{ opacity: 1, scale: 1, width: "auto" }}
										exit={{ opacity: 0, scale: 0.8, width: 0 }}
										transition={{ type: "spring", stiffness: 400 }}
									>
										<Button
											type="button"
											variant="ghost"
											size="sm"
											onClick={handleClear}
											disabled={disabled}
											className="h-8 w-8 p-0 rounded-lg hover:bg-muted/80 transition-colors"
										>
											<X className="h-3.5 w-3.5" />
										</Button>
									</motion.div>
								)}
							</AnimatePresence>

							{/* Search button with animation */}
							<motion.div
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
								className={cn(
									"overflow-hidden",
									!inputValue.trim() && "opacity-70",
								)}
							>
								<Button
									type="submit"
									size="sm"
									disabled={disabled || isDebouncing}
									className={cn(
										"h-8 px-4 rounded-lg font-medium",
										"bg-linear-to-r from-primary to-primary/90",
										"hover:from-primary/90 hover:to-primary/80",
										"transition-all duration-200",
										"shadow-sm hover:shadow-md",
									)}
								>
									<motion.span
										animate={{ opacity: isDebouncing ? 0 : 1 }}
										transition={{ duration: 0.1 }}
										className="flex items-center gap-2"
									>
										<Search className="h-3.5 w-3.5" />
										Hľadať
									</motion.span>

									{/* Loading indicator */}
									<AnimatePresence>
										{isDebouncing && (
											<motion.div
												initial={{ opacity: 0, scale: 0.8 }}
												animate={{ opacity: 1, scale: 1 }}
												exit={{ opacity: 0 }}
												className="absolute inset-0 flex items-center justify-center"
											>
												<Loader2 className="h-4 w-4 animate-spin" />
											</motion.div>
										)}
									</AnimatePresence>
								</Button>
							</motion.div>
						</div>
					</div>
				</motion.div>

				{/* Hint text */}
				<AnimatePresence>
					{(inputValue || isFocused) && !isDebouncing && (
						<motion.div
							initial={{ opacity: 0, y: -5 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: -5 }}
							className="absolute -bottom-6 left-0 right-0"
						>
							<div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
								<motion.span
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									transition={{ delay: 0.1 }}
								>
									Stlačte{" "}
									<kbd className="px-1.5 py-0.5 bg-muted rounded text-[10px] font-mono">
										Enter
									</kbd>{" "}
									pre okamžité vyhľadávanie
								</motion.span>
								{inputValue && (
									<motion.span
										initial={{ opacity: 0 }}
										animate={{ opacity: 1 }}
										transition={{ delay: 0.2 }}
										className="flex items-center gap-1"
									>
										·{" "}
										<kbd className="px-1.5 py-0.5 bg-muted rounded text-[10px] font-mono">
											Esc
										</kbd>{" "}
										pre vymazanie
									</motion.span>
								)}
							</div>
						</motion.div>
					)}
				</AnimatePresence>

				{/* Decorative pulse effect on focus */}
				<AnimatePresence>
					{isFocused && (
						<motion.div
							initial={{ opacity: 0, scale: 0.9 }}
							animate={{
								opacity: [0.3, 0.5, 0.3],
								scale: [1, 1.05, 1],
							}}
							transition={{
								duration: 2,
								repeat: Infinity,
								repeatType: "reverse",
							}}
							className="absolute inset-0 -m-1 rounded-xl bg-linear-to-r from-primary/10 via-transparent to-primary/10 pointer-events-none"
						/>
					)}
				</AnimatePresence>
			</div>

			{/* Results count or loading indicator */}
			<AnimatePresence>
				{isDebouncing && inputValue.trim() && (
					<motion.div
						initial={{ opacity: 0, y: -5 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0 }}
						className="absolute left-0 right-0 -bottom-8 text-center"
					>
						<div className="inline-flex items-center gap-2 text-xs text-muted-foreground">
							<Loader2 className="h-3 w-3 animate-spin" />
							<span>Vyhľadávanie...</span>
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</motion.form>
	);
};

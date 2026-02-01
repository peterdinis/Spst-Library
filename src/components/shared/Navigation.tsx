import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { BookOpen, Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { ThemeToggle } from "./ThemeToggle";
import { LoginButton, RegisterButton, UserProfile } from "../auth";
import { useAuth } from "@/lib/auth-context";
import { NotificationDropdown } from "../../notifications/NotificationDropdown";

export function Navigation() {
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const { user } = useAuth();

	const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
	const closeMenu = () => setIsMenuOpen(false);

	const navLinks = [
		{ to: "/", label: "Domov" },
		{ to: "/books", label: "Knihy" },
		{ to: "/categories", label: "Kategórie" },
		{ to: "/authors", label: "Spisovatelia" },
	] as const;

	return (
		<header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md supports-backdrop-filter:bg-background/60">
			<div className="container mx-auto px-4 sm:px-6">
				<div className="flex h-16 items-center justify-between">
					{/* Logo */}
					<Link to="/" className="flex-shrink-0">
						<motion.div
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
							transition={{ duration: 0.15 }}
							className="flex items-center space-x-2 cursor-pointer"
						>
							<BookOpen className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
							<span className="text-base sm:text-lg md:text-xl font-bold text-primary whitespace-nowrap">
								Školská knižnica
							</span>
						</motion.div>
					</Link>

					{/* Desktop Navigation - zobrazí sa od 768px */}
					<nav className="hidden md:flex items-center flex-1 justify-center ml-4">
						<div className="flex items-center space-x-3 lg:space-x-6">
							{navLinks.map((link, index) => (
								<Link key={link.to} to={link.to} onClick={closeMenu}>
									{({ isActive }) => (
										<motion.span
											initial={{ opacity: 0, y: -20 }}
											animate={{ opacity: 1, y: 0 }}
											transition={{
												duration: 0.2,
												delay: index * 0.05,
												ease: "easeOut",
											}}
											whileHover={{
												scale: 1.05,
												transition: { duration: 0.15 },
											}}
											whileTap={{
												scale: 0.95,
												transition: { duration: 0.1 },
											}}
											className={`
												text-sm font-medium transition-colors hover:text-primary relative cursor-pointer px-2 py-1
												${link.to.startsWith("/admin") ? "text-red-600 dark:text-red-400" : ""}
												${isActive ? "text-primary underline decoration-2 underline-offset-4" : "text-foreground/80"}
											`}
										>
											{link.label}
											{link.to.startsWith("/admin") && (
												<span className="absolute -top-1 -right-2.5 h-2 w-2 rounded-full bg-red-500"></span>
											)}
										</motion.span>
									)}
								</Link>
							))}
						</div>
					</nav>

					{/* Desktop User Actions - zobrazí sa od 768px */}
					<div className="hidden md:flex items-center space-x-3 lg:space-x-4 flex-shrink-0">
						{user ? (
							<div className="flex items-center space-x-2 lg:space-x-3">
								<NotificationDropdown />
								<UserProfile />
							</div>
						) : (
							<div className="flex items-center space-x-2 lg:space-x-3">
								<LoginButton />
								<RegisterButton />
							</div>
						)}
						<ThemeToggle />
					</div>

					{/* Mobile Actions - zobrazí sa do 768px */}
					<div className="flex items-center space-x-2 md:hidden">
						{user && <NotificationDropdown />}
						<ThemeToggle />
						<motion.button
							onClick={toggleMenu}
							className="p-2 text-foreground hover:text-primary transition-colors"
							aria-label="Toggle menu"
							whileHover={{ scale: 1.1 }}
							whileTap={{ scale: 0.9 }}
							transition={{ duration: 0.1 }}
						>
							{isMenuOpen ? (
								<X className="h-6 w-6" />
							) : (
								<Menu className="h-6 w-6" />
							)}
						</motion.button>
					</div>
				</div>

				{/* Mobile Navigation */}
				<AnimatePresence mode="wait">
					{isMenuOpen && (
						<motion.div
							initial={{
								height: 0,
								opacity: 0,
								y: -10,
							}}
							animate={{
								height: "auto",
								opacity: 1,
								y: 0,
							}}
							exit={{
								height: 0,
								opacity: 0,
								y: -10,
							}}
							transition={{
								duration: 0.25,
								ease: "easeInOut",
							}}
							className="md:hidden overflow-hidden"
						>
							<nav className="py-4 border-t border-border/40">
								<div className="flex flex-col space-y-1">
									{navLinks.map((link, index) => (
										<Link key={link.to} to={link.to} onClick={closeMenu}>
											{({ isActive }) => (
												<motion.span
													initial={{ opacity: 0, x: -20 }}
													animate={{ opacity: 1, x: 0 }}
													transition={{
														duration: 0.15,
														delay: index * 0.03,
														ease: "easeOut",
													}}
													whileHover={{
														x: 5,
														transition: { duration: 0.1 },
													}}
													className={`
														text-sm font-medium transition-colors py-3 px-4 text-left cursor-pointer block
														${link.to.startsWith("/admin") ? "text-red-600 dark:text-red-400" : ""}
														${isActive
															? "text-primary bg-primary/5"
															: "text-foreground/80 hover:text-primary hover:bg-accent/10"
														}
													`}
												>
													{link.label}
													{link.to.startsWith("/admin") && (
														<span className="ml-2 text-xs bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 px-2 py-0.5 rounded-full">
															Admin
														</span>
													)}
												</motion.span>
											)}
										</Link>
									))}

									{/* Mobile Auth Section */}
									{!user && (
										<motion.div
											initial={{ opacity: 0, x: -20 }}
											animate={{ opacity: 1, x: 0 }}
											transition={{
												duration: 0.15,
												delay: navLinks.length * 0.03,
												ease: "easeOut",
											}}
											className="pt-3 border-t border-border/40"
										>
											<div className="flex flex-col space-y-2 px-4">
												<LoginButton />
												<RegisterButton />
											</div>
										</motion.div>
									)}
								</div>
							</nav>
						</motion.div>
					)}
				</AnimatePresence>
			</div>
		</header>
	);
}

export default Navigation;
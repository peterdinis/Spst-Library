"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Book, BookOpen, Home, Library, Menu, Users, X } from "lucide-react";
import Link from "next/link";
import { useState, FC } from "react";
import { Button } from "../ui/button";
import ThemeToggle from "./ThemeToggle";

const Navigation: FC = () => {
	const [mobileOpen, setMobileOpen] = useState(false);

	return (
		<nav className="bg-card shadow-card border-b transition-smooth">
			<div className="container mx-auto px-4">
				<div className="flex items-center justify-between h-16">
					{/* Logo */}
					<Link href="/" className="flex items-center space-x-2 hover-float">
						<Library className="h-8 w-8 text-primary" />
						<span className="text-xl font-bold bg-gradient-hero bg-clip-text text-zinc-900">
							SPŠT Knižnica
						</span>
					</Link>

					{/* Desktop Menu */}
					<div className="hidden md:flex items-center space-x-6">
						<Link
							href="/"
							className="flex items-center space-x-1 px-3 py-2 rounded-md transition-smooth"
						>
							<Home className="h-4 w-4" />
							<span>Domov</span>
						</Link>
						<Link
							href="/categories"
							className="flex items-center space-x-1 px-3 py-2 rounded-md transition-smooth"
						>
							<Book className="h-4 w-4" />
							<span>Knihy</span>
						</Link>
						<Link
							href="/categories"
							className="flex items-center space-x-1 px-3 py-2 rounded-md transition-smooth"
						>
							<BookOpen className="h-4 w-4" />
							<span>Kategórie</span>
						</Link>
						<Link
							href="/authors"
							className="flex items-center space-x-1 px-3 py-2 rounded-md transition-smooth"
						>
							<Users className="h-4 w-4" />
							<span>Spisovatelia</span>
						</Link>
					</div>

					{/* Desktop Buttons */}
					<div className="hidden md:flex items-center space-x-3">
						<Button variant="default" asChild>
							<Link href="/login/student">Prihlásenie žiak</Link>
						</Button>
						<Button asChild variant="secondary">
							<Link href="/login/teacher">Prihlásenie učiteľ</Link>
						</Button>
                        <ThemeToggle />
					</div>

					{/* Mobile Hamburger */}
					<div className="md:hidden flex items-center">
						<button
							onClick={() => setMobileOpen(!mobileOpen)}
							className="p-2 rounded-md hover:bg-gray-100"
						>
							{mobileOpen ? (
								<X className="h-6 w-6" />
							) : (
								<Menu className="h-6 w-6" />
							)}
						</button>
					</div>
				</div>
			</div>

			{/* Mobile Menu with Framer Motion */}
			<AnimatePresence>
				{mobileOpen && (
					<motion.div
						className="md:hidden px-4 pb-4 space-y-2 bg-card border-t"
						initial={{ height: 0, opacity: 0 }}
						animate={{ height: "auto", opacity: 1 }}
						exit={{ height: 0, opacity: 0 }}
						transition={{ duration: 0.3, ease: "easeInOut" }}
					>
						<Link
							href="/"
							className="flex items-center space-x-1 px-3 py-2 rounded-md hover:bg-gray-100"
						>
							<Home className="h-4 w-4" />
							<span>Domov</span>
						</Link>
						<Link
							href="/categories"
							className="flex items-center space-x-1 px-3 py-2 rounded-md hover:bg-gray-100"
						>
							<Book className="h-4 w-4" />
							<span>Knihy</span>
						</Link>
						<Link
							href="/categories"
							className="flex items-center space-x-1 px-3 py-2 rounded-md hover:bg-gray-100"
						>
							<BookOpen className="h-4 w-4" />
							<span>Kategórie</span>
						</Link>
						<Link
							href="/authors"
							className="flex items-center space-x-1 px-3 py-2 rounded-md hover:bg-gray-100"
						>
							<Users className="h-4 w-4" />
							<span>Spisovatelia</span>
						</Link>

						{/* Mobile Buttons */}
						<div className="flex flex-col space-y-2 mt-2">
							<Button variant="default" asChild>
								<Link href="/login/student">Student Login</Link>
							</Button>
							<Button asChild variant="secondary">
								<Link href="/login/teacher">Teacher Login</Link>
							</Button>
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</nav>
	);
};

export default Navigation;

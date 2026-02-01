"use client";

import { FC } from "react";
import { motion } from "framer-motion";
import { Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Doc } from "convex/_generated/dataModel";

interface BooksFiltersProps {
	categories: Doc<"categories">[];
	authors: Doc<"authors">[];
	selectedCategory?: string;
	selectedAuthor?: string;
	selectedStatus?: string;
	sortBy?: string;
	onCategoryChange: (value: string) => void;
	onAuthorChange: (value: string) => void;
	onStatusChange: (value: string) => void;
	onSortChange: (value: string) => void;
	onClear: () => void;
}

export const BooksFilters: FC<BooksFiltersProps> = ({
	categories,
	authors,
	selectedCategory,
	selectedAuthor,
	selectedStatus,
	sortBy,
	onCategoryChange,
	onAuthorChange,
	onStatusChange,
	onSortChange,
	onClear,
}) => {
	const hasActiveFilters =
		selectedCategory || selectedAuthor || selectedStatus || sortBy;

	return (
		<motion.div
			initial={{ opacity: 0, y: -10 }}
			animate={{ opacity: 1, y: 0 }}
			className="space-y-6"
		>
			<div className="flex items-center justify-between pb-2">
				<div className="flex items-center gap-2">
					<div className="p-2 bg-indigo-500/10 rounded-lg">
						<Filter className="h-4 w-4 text-indigo-500" />
					</div>
					<div>
						<h3 className="font-bold text-black dark:text-white">Filtre a zoradenie</h3>
						<p className="text-xs text-slate-500">Prispôsobte si výber kníh</p>
					</div>
				</div>
				{hasActiveFilters && (
					<Button
						variant="ghost"
						size="sm"
						onClick={onClear}
						className="h-8 gap-2 text-slate-400 hover:text-white"
					>
						<X className="h-3 w-3" />
						Resetovať všetko
					</Button>
				)}
			</div>

			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
				{/* Kategórie */}
				<div className="space-y-2">
					<Label className="text-xs text-slate-400 ml-1">Kategória</Label>
					<Select value={selectedCategory} onValueChange={onCategoryChange}>
						<SelectTrigger className="bg-slate-900/50 border-slate-800 rounded-xl h-11">
							<SelectValue placeholder="Všetky kategórie" />
						</SelectTrigger>
						<SelectContent className="bg-slate-900 border-slate-800 text-slate-200">
							<SelectItem value="all">Všetky kategórie</SelectItem>
							{categories.map((category) => (
								<SelectItem key={category._id} value={category._id}>
									{category.name}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>

				{/* Autori */}
				<div className="space-y-2">
					<Label className="text-xs text-slate-400 ml-1">Autor</Label>
					<Select value={selectedAuthor} onValueChange={onAuthorChange}>
						<SelectTrigger className="bg-slate-900/50 border-slate-800 rounded-xl h-11">
							<SelectValue placeholder="Všetci autori" />
						</SelectTrigger>
						<SelectContent className="bg-slate-900 border-slate-800 text-slate-200">
							<SelectItem value="all">Všetci autori</SelectItem>
							{authors.map((author) => (
								<SelectItem key={author._id} value={author._id}>
									{author.name}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>

				{/* Status */}
				<div className="space-y-2">
					<Label className="text-xs text-slate-400 ml-1">Stav knihy</Label>
					<Select value={selectedStatus} onValueChange={onStatusChange}>
						<SelectTrigger className="bg-slate-900/50 border-slate-800 rounded-xl h-11">
							<SelectValue placeholder="Všetky stavy" />
						</SelectTrigger>
						<SelectContent className="bg-slate-900 border-slate-800 text-slate-200">
							<SelectItem value="all">Všetky stavy</SelectItem>
							<SelectItem value="available">Dostupné</SelectItem>
							<SelectItem value="reserved">Rezervované</SelectItem>
							<SelectItem value="maintenance">V údržbe</SelectItem>
							<SelectItem value="lost">Stratené</SelectItem>
						</SelectContent>
					</Select>
				</div>

				{/* Zoradenie */}
				<div className="space-y-2">
					<Label className="text-xs text-slate-400 ml-1">Zoradiť podľa</Label>
					<Select value={sortBy} onValueChange={onSortChange}>
						<SelectTrigger className="bg-slate-900/50 border-slate-800 rounded-xl h-11">
							<SelectValue placeholder="Najnovšie" />
						</SelectTrigger>
						<SelectContent className="bg-slate-900 border-slate-800 text-slate-200">
							<SelectItem value="newest">Najnovšie</SelectItem>
							<SelectItem value="oldest">Najstaršie</SelectItem>
							<SelectItem value="title_asc">Názov (A-Z)</SelectItem>
							<SelectItem value="title_desc">Názov (Z-A)</SelectItem>
						</SelectContent>
					</Select>
				</div>
			</div>
		</motion.div>
	);
};

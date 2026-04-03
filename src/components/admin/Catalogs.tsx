"use client";

import Image from "next/image";
import { trpc } from "@/trpc/client";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, User } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { AuthorForm } from "./AuthorForm";
import { CategoryForm } from "./CategoryForm";
import { BookForm, type BookFormInitial } from "./BookForm";
import { useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { BookOpen } from "lucide-react";

type AdminAuthorRow = {
	id: string;
	name: string;
	bio?: string | null;
	imageUrl?: string | null;
};

type AdminCategoryRow = { id: string; name: string };

export function AuthorsTable() {
	const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
	const [selectedAuthor, setSelectedAuthor] = useState<AdminAuthorRow | null>(
		null,
	);
	const { data: authors, isLoading } = trpc.authors.getAll.useQuery();
	const utils = trpc.useUtils();

	const deleteAuthor = trpc.authors.delete.useMutation({
		onSuccess: () => {
			toast.success("Autor vymazaný");
			utils.authors.getAll.invalidate();
		},
		onError: (e) => toast.error(e.message),
	});

	if (isLoading)
		return <div className="animate-pulse h-32 bg-slate-200 rounded-2xl"></div>;

	return (
		<Card className="rounded-2xl border-slate-200/80 dark:border-slate-800 shadow-lg overflow-hidden bg-white dark:bg-slate-900">
			<CardHeader className="bg-slate-50/80 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800 flex flex-row items-center justify-between">
				<CardTitle className="text-lg">Katalóg autorov</CardTitle>
			</CardHeader>
			<CardContent className="p-0">
				<Table>
					<TableHeader>
						<TableRow className="bg-slate-50/80 dark:bg-slate-800/50">
							<TableHead className="pl-6 w-14" />
							<TableHead>Meno</TableHead>
							<TableHead>Životopis</TableHead>
							<TableHead className="text-right pr-6">Akcie</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{authors?.map((a) => (
							<TableRow
								key={a.id}
								className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
							>
								<TableCell className="pl-6">
									{a.imageUrl ? (
										<div className="relative size-9 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700">
											<Image
												src={a.imageUrl}
												alt=""
												fill
												className="object-cover"
											/>
										</div>
									) : (
										<div className="size-9 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center border border-slate-200 dark:border-slate-700">
											<User className="size-4 text-slate-400" />
										</div>
									)}
								</TableCell>
								<TableCell className="font-medium">{a.name}</TableCell>
								<TableCell className="max-w-xs truncate text-slate-600 dark:text-slate-400">
									{a.bio || "Bez popisu"}
								</TableCell>
								<TableCell className="text-right pr-6 space-x-2">
									<Dialog
										open={isEditDialogOpen && selectedAuthor?.id === a.id}
										onOpenChange={(open) => {
											setIsEditDialogOpen(open);
											if (open) setSelectedAuthor(a);
										}}
									>
										<DialogTrigger>
											<Button
												variant="ghost"
												size="icon"
												className="h-8 w-8 rounded-full hover:bg-primary/10 hover:text-primary"
											>
												<Edit className="h-4 w-4" />
											</Button>
										</DialogTrigger>
										<DialogContent className="sm:max-w-md rounded-3xl">
											<AuthorForm
												initialData={a}
												onSuccess={() => setIsEditDialogOpen(false)}
											/>
										</DialogContent>
									</Dialog>
									<Button
										variant="ghost"
										size="icon"
										className="h-8 w-8 rounded-full hover:bg-destructive/10 hover:text-destructive"
										onClick={() => {
											if (confirm("Naozaj chcete vymazať tohto autora?")) {
												deleteAuthor.mutate({ id: a.id });
											}
										}}
									>
										<Trash2 className="h-4 w-4" />
									</Button>
								</TableCell>
							</TableRow>
						))}
						{!authors?.length && (
							<TableRow>
								<TableCell
									colSpan={4}
									className="text-center py-12 text-slate-400"
								>
									Žiadni autori neboli nájdení.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</CardContent>
		</Card>
	);
}

export function CategoriesTable() {
	const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
	const [selectedCategory, setSelectedCategory] =
		useState<AdminCategoryRow | null>(null);
	const { data: categories, isLoading } = trpc.categories.getAll.useQuery();
	const utils = trpc.useUtils();

	const deleteCategory = trpc.categories.delete.useMutation({
		onSuccess: () => {
			toast.success("Kategória vymazaná");
			utils.categories.getAll.invalidate();
		},
		onError: (e) => toast.error(e.message),
	});

	if (isLoading)
		return <div className="animate-pulse h-32 bg-slate-200 rounded-2xl"></div>;

	return (
		<Card className="rounded-2xl border-slate-200/80 dark:border-slate-800 shadow-lg overflow-hidden bg-white dark:bg-slate-900">
			<CardHeader className="bg-slate-50/80 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800">
				<CardTitle className="text-lg">Katalóg kategórií</CardTitle>
			</CardHeader>
			<CardContent className="p-0">
				<Table>
					<TableHeader>
						<TableRow className="bg-slate-50/80 dark:bg-slate-800/50">
							<TableHead className="pl-6">Názov</TableHead>
							<TableHead className="text-right pr-6">Akcie</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{categories?.map((c) => (
							<TableRow
								key={c.id}
								className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
							>
								<TableCell className="font-medium pl-6">{c.name}</TableCell>
								<TableCell className="text-right pr-6 space-x-2">
									<Dialog
										open={isEditDialogOpen && selectedCategory?.id === c.id}
										onOpenChange={(open) => {
											setIsEditDialogOpen(open);
											if (open) setSelectedCategory(c);
										}}
									>
										<DialogTrigger>
											<Button
												variant="ghost"
												size="icon"
												className="h-8 w-8 rounded-full hover:bg-primary/10 hover:text-primary"
											>
												<Edit className="h-4 w-4" />
											</Button>
										</DialogTrigger>
										<DialogContent className="sm:max-w-md rounded-3xl">
											<CategoryForm
												initialData={c}
												onSuccess={() => setIsEditDialogOpen(false)}
											/>
										</DialogContent>
									</Dialog>
									<Button
										variant="ghost"
										size="icon"
										className="h-8 w-8 rounded-full hover:bg-destructive/10 hover:text-destructive"
										onClick={() => {
											if (confirm("Naozaj chcete vymazať túto kategóriu?")) {
												deleteCategory.mutate({ id: c.id });
											}
										}}
									>
										<Trash2 className="h-4 w-4" />
									</Button>
								</TableCell>
							</TableRow>
						))}
						{!categories?.length && (
							<TableRow>
								<TableCell
									colSpan={2}
									className="text-center py-12 text-slate-400"
								>
									Žiadne kategórie neboli nájdené.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</CardContent>
		</Card>
	);
}

export function BooksTable() {
	const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
	const [selectedBook, setSelectedBook] = useState<BookFormInitial | null>(
		null,
	);
	const { data: books, isLoading } = trpc.books.getAll.useQuery();
	const utils = trpc.useUtils();

	const deleteBook = trpc.books.delete.useMutation({
		onSuccess: () => {
			toast.success("Kniha vymazaná");
			utils.books.getAll.invalidate();
		},
		onError: (e) => toast.error(e.message),
	});

	if (isLoading)
		return <div className="animate-pulse h-64 bg-slate-200 rounded-3xl"></div>;

	return (
		<Card className="rounded-2xl border-slate-200/80 dark:border-slate-800 shadow-xl overflow-hidden bg-white dark:bg-slate-900">
			<CardHeader className="bg-slate-50/80 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800 flex flex-row items-center justify-between">
				<div className="flex items-center gap-3">
					<div className="p-2 bg-indigo-100 text-indigo-600 rounded-xl">
						<BookOpen className="h-5 w-5" />
					</div>
					<CardTitle className="text-lg">Katalóg kníh</CardTitle>
				</div>
			</CardHeader>
			<CardContent className="p-0">
				<Table>
					<TableHeader>
						<TableRow className="bg-slate-50/80 dark:bg-slate-800/50">
							<TableHead className="pl-6">Obálka</TableHead>
							<TableHead>Názov</TableHead>
							<TableHead>Autor</TableHead>
							<TableHead>Kusy</TableHead>
							<TableHead className="text-right pr-6">Akcie</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{books?.items?.map((b) => (
							<TableRow
								key={b.id}
								className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors group"
							>
								<TableCell className="pl-6">
									{b.coverUrl ? (
										<div className="relative h-12 w-9">
											<Image
												src={b.coverUrl}
												alt={b.title}
												fill
												className="object-cover rounded shadow-sm group-hover:shadow-md transition-shadow"
											/>
										</div>
									) : (
										<div className="h-12 w-9 bg-slate-100 dark:bg-slate-800 rounded flex items-center justify-center">
											<BookOpen className="h-4 w-4 text-slate-400" />
										</div>
									)}
								</TableCell>
								<TableCell className="font-medium">
									<div>
										<div className="text-slate-900">{b.title}</div>
										<div className="text-xs text-slate-500 font-normal">
											{b.isbn || "ISBN chýba"}
										</div>
									</div>
								</TableCell>
								<TableCell>
									<Badge
										variant="outline"
										className="rounded-lg bg-slate-50 font-normal"
									>
										{b.author?.name || "Neznámy autor"}
									</Badge>
								</TableCell>
								<TableCell>
									<div className="flex items-center gap-2 font-mono text-sm">
										<span className="text-indigo-600 font-bold">
											{b.availableCopies}
										</span>
									</div>
								</TableCell>
								<TableCell className="text-right pr-6 space-x-2">
									<Dialog
										open={isEditDialogOpen && selectedBook?.id === b.id}
										onOpenChange={(open) => {
											setIsEditDialogOpen(open);
											if (open) setSelectedBook(b);
										}}
									>
										<DialogTrigger>
											<Button
												variant="ghost"
												size="icon"
												className="h-9 w-9 rounded-xl hover:bg-indigo-50 hover:text-indigo-600 border border-transparent hover:border-indigo-100"
											>
												<Edit className="h-4 w-4" />
											</Button>
										</DialogTrigger>
										<DialogContent className="sm:max-w-4xl rounded-3xl p-0 overflow-hidden border-none shadow-2xl">
											<div className="max-h-[90vh] overflow-y-auto p-6 bg-white dark:bg-slate-950">
												<BookForm
													initialData={b}
													onSuccess={() => setIsEditDialogOpen(false)}
												/>
											</div>
										</DialogContent>
									</Dialog>
									<Button
										variant="ghost"
										size="icon"
										className="h-9 w-9 rounded-xl hover:bg-rose-50 hover:text-rose-600 border border-transparent hover:border-rose-100"
										onClick={() => {
											if (
												confirm(`Naozaj chcete vymazať knihu "${b.title}"?`)
											) {
												deleteBook.mutate({ id: b.id });
											}
										}}
									>
										<Trash2 className="h-4 w-4" />
									</Button>
								</TableCell>
							</TableRow>
						))}
						{!books?.items?.length && (
							<TableRow>
								<TableCell
									colSpan={5}
									className="text-center py-16 text-slate-400"
								>
									<div className="flex flex-col items-center gap-2">
										<BookOpen className="h-8 w-8 text-slate-200" />
										<p>V knižnici nie sú žiadne knihy.</p>
									</div>
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</CardContent>
		</Card>
	);
}

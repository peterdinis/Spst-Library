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
		return <div className="h-40 animate-pulse rounded-2xl bg-muted" />;

	return (
		<Card className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
			<CardHeader className="flex flex-row items-center justify-between border-b border-border bg-muted/30 px-4 py-3">
				<CardTitle className="text-base font-semibold">Katalóg autorov</CardTitle>
			</CardHeader>
			<CardContent className="p-0">
				<Table>
					<TableHeader>
						<TableRow className="border-b bg-muted/20 hover:bg-muted/20">
							<TableHead className="w-14 pl-4" />
							<TableHead>Meno</TableHead>
							<TableHead className="max-w-[min(100%,24rem)]">Životopis</TableHead>
							<TableHead className="pr-4 text-right whitespace-nowrap">Akcie</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{authors?.map((a) => (
							<TableRow
								key={a.id}
								className="transition-colors hover:bg-muted/40"
							>
								<TableCell className="pl-4 align-middle">
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
								<TableCell className="max-w-md text-sm text-muted-foreground">
									<span className="line-clamp-2">{a.bio || "Bez popisu"}</span>
								</TableCell>
								<TableCell className="space-x-2 pr-4 text-right align-middle whitespace-nowrap">
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
									className="py-12 text-center text-muted-foreground"
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
		return <div className="h-40 animate-pulse rounded-2xl bg-muted" />;

	return (
		<Card className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
			<CardHeader className="border-b border-border bg-muted/30 px-4 py-3">
				<CardTitle className="text-base font-semibold">Katalóg kategórií</CardTitle>
			</CardHeader>
			<CardContent className="p-0">
				<Table>
					<TableHeader>
						<TableRow className="border-b bg-muted/20 hover:bg-muted/20">
							<TableHead className="pl-4">Názov</TableHead>
							<TableHead className="pr-4 text-right whitespace-nowrap">Akcie</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{categories?.map((c) => (
							<TableRow
								key={c.id}
								className="transition-colors hover:bg-muted/40"
							>
								<TableCell className="pl-4 font-medium">{c.name}</TableCell>
								<TableCell className="space-x-2 pr-4 text-right whitespace-nowrap">
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
									className="py-12 text-center text-muted-foreground"
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
		return <div className="h-64 animate-pulse rounded-2xl bg-muted" />;

	return (
		<Card className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
			<CardHeader className="flex flex-row items-center justify-between border-b border-border bg-muted/30 px-4 py-3">
				<div className="flex items-center gap-3">
					<div className="rounded-xl bg-primary/10 p-2 text-primary">
						<BookOpen className="h-5 w-5" />
					</div>
					<CardTitle className="text-base font-semibold">Katalóg kníh</CardTitle>
				</div>
			</CardHeader>
			<CardContent className="p-0">
				<Table>
					<TableHeader>
						<TableRow className="border-b bg-muted/20 hover:bg-muted/20">
							<TableHead className="pl-4 whitespace-nowrap">Obálka</TableHead>
							<TableHead>Názov</TableHead>
							<TableHead>Autor</TableHead>
							<TableHead className="whitespace-nowrap">Kusy</TableHead>
							<TableHead className="pr-4 text-right whitespace-nowrap">Akcie</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{books?.items?.map((b) => (
							<TableRow
								key={b.id}
								className="group transition-colors hover:bg-muted/40"
							>
								<TableCell className="pl-4 align-middle whitespace-nowrap">
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
								<TableCell className="max-w-[min(100%,18rem)] font-medium">
									<div>
										<div className="text-foreground">{b.title}</div>
										<div className="text-xs font-normal text-muted-foreground">
											{b.isbn || "ISBN chýba"}
										</div>
									</div>
								</TableCell>
								<TableCell className="whitespace-nowrap">
									<Badge
										variant="outline"
										className="rounded-lg bg-slate-50 font-normal"
									>
										{b.author?.name || "Neznámy autor"}
									</Badge>
								</TableCell>
								<TableCell className="whitespace-nowrap">
									<span className="font-mono text-sm font-bold text-primary">
										{b.availableCopies}
									</span>
								</TableCell>
								<TableCell className="space-x-2 pr-4 text-right align-middle whitespace-nowrap">
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
									className="py-16 text-center text-muted-foreground"
								>
									<div className="flex flex-col items-center gap-2">
										<BookOpen className="h-8 w-8 text-muted-foreground/40" />
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

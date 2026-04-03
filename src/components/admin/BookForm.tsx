"use client";

import Image from "next/image";
import { toast } from "sonner";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	CardDescription,
} from "@/components/ui/card";
import { trpc } from "@/trpc/client";
import { FileUpload } from "./FileUpload";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

export type BookFormInitial = {
	id: string;
	title: string;
	description?: string | null;
	isbn?: string | null;
	availableCopies?: number | null;
	authorId?: string | null;
	categoryId?: string | null;
	coverUrl?: string | null;
};

interface BookFormProps {
	initialData?: BookFormInitial;
	onSuccess?: () => void;
}

export function BookForm({ initialData, onSuccess }: BookFormProps) {
	const [title, setTitle] = useState(initialData?.title || "");
	const [description, setDescription] = useState(
		initialData?.description || "",
	);
	const [isbn, setIsbn] = useState(initialData?.isbn || "");
	const [availableCopies, setAvailableCopies] = useState(
		initialData?.availableCopies ?? 1,
	);
	const [authorId, setAuthorId] = useState(initialData?.authorId || "");
	const [categoryId, setCategoryId] = useState(initialData?.categoryId || "");
	const [coverUrl, setCoverUrl] = useState(initialData?.coverUrl || "");

	const { data: authors } = trpc.authors.getAll.useQuery();
	const { data: categories } = trpc.categories.getAll.useQuery();
	const utils = trpc.useUtils();

	const createBook = trpc.books.create.useMutation({
		onSuccess: () => {
			toast.success("Kniha úspešne pridaná!");
			utils.books.getAll.invalidate();
			onSuccess?.();
			if (!initialData) resetForm();
		},
		onError: (e) => toast.error(e.message),
	});

	const updateBook = trpc.books.update.useMutation({
		onSuccess: () => {
			toast.success("Kniha úspešne upravená!");
			utils.books.getAll.invalidate();
			onSuccess?.();
		},
		onError: (e) => toast.error(e.message),
	});

	const resetForm = () => {
		setTitle("");
		setDescription("");
		setIsbn("");
		setAvailableCopies(1);
		setAuthorId("");
		setCategoryId("");
		setCoverUrl("");
	};

	const isEditing = !!initialData;

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		const data = {
			title,
			description: description || undefined,
			isbn: isbn || undefined,
			availableCopies: Number(availableCopies),
			authorId,
			categoryId,
			coverUrl: coverUrl || undefined,
		};

		if (isEditing) {
			updateBook.mutate({ id: initialData.id, ...data });
		} else {
			createBook.mutate(data);
		}
	};

	const pending = createBook.isPending || updateBook.isPending;

	return (
		<Card className="shadow-lg border-slate-200/80 dark:border-slate-800 rounded-2xl overflow-hidden bg-white dark:bg-slate-900">
			<CardHeader className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/50">
				<CardTitle className="text-xl">
					{isEditing ? "Upraviť knihu" : "Nová kniha"}
				</CardTitle>
				<CardDescription>
					Údaje, autor, kategória a obálka (upload do Azure).
				</CardDescription>
			</CardHeader>
			<CardContent className="pt-6">
				<form
					onSubmit={handleSubmit}
					className="grid grid-cols-1 lg:grid-cols-2 gap-8"
				>
					<div className="space-y-5">
						<div className="space-y-2">
							<label className="text-sm font-medium text-slate-700 dark:text-slate-200">
								Základné informácie
							</label>
							<Input
								placeholder="Názov knihy"
								value={title}
								onChange={(e) => setTitle(e.target.value)}
								required
								className="rounded-xl"
							/>
							<Textarea
								placeholder="Popis"
								value={description || ""}
								onChange={(e) => setDescription(e.target.value)}
								className="rounded-xl min-h-[100px]"
							/>
							<Input
								placeholder="ISBN (voliteľné)"
								value={isbn || ""}
								onChange={(e) => setIsbn(e.target.value)}
								className="rounded-xl"
							/>
							<Input
								type="number"
								min={0}
								placeholder="Počet kusov"
								value={availableCopies}
								onChange={(e) => setAvailableCopies(Number(e.target.value))}
								required
								className="rounded-xl"
							/>
						</div>

						<div className="space-y-2">
							<label className="text-sm font-medium text-slate-700 dark:text-slate-200">
								Autor a kategória
							</label>
							<Select
								value={authorId}
								onValueChange={(v) => setAuthorId(v ?? "")}
								required
							>
								<SelectTrigger className="rounded-xl w-full">
									<SelectValue placeholder="Vyberte autora" />
								</SelectTrigger>
								<SelectContent className="rounded-xl">
									{authors?.map((a) => (
										<SelectItem key={a.id} value={a.id}>
											{a.name}
										</SelectItem>
									))}
								</SelectContent>
							</Select>

							<Select
								value={categoryId}
								onValueChange={(v) => setCategoryId(v ?? "")}
								required
							>
								<SelectTrigger className="rounded-xl w-full">
									<SelectValue placeholder="Vyberte kategóriu" />
								</SelectTrigger>
								<SelectContent className="rounded-xl">
									{categories?.map((c) => (
										<SelectItem key={c.id} value={c.id}>
											{c.name}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
					</div>

					<div className="space-y-5">
						<div className="space-y-2">
							<label className="text-sm font-medium text-slate-700 dark:text-slate-200">
								Obálka knihy
							</label>
							<FileUpload
								uploadFolder="books"
								onUploadComplete={setCoverUrl}
								defaultValue={coverUrl || undefined}
							/>
							{coverUrl && (
								<div className="rounded-xl border border-slate-200 dark:border-slate-700 p-3 bg-slate-50 dark:bg-slate-800/50">
									<p className="text-xs text-slate-500 dark:text-slate-400 truncate mb-2">
										{coverUrl}
									</p>
									<div className="relative h-40 w-28 mx-auto">
										<Image
											src={coverUrl}
											alt="Náhľad obálky"
											fill
											className="object-cover rounded-lg shadow-md"
										/>
									</div>
								</div>
							)}
							{!coverUrl && (
								<p className="text-xs text-slate-500 dark:text-slate-400">
									Obálka je voliteľná — knihu môžete uložiť aj bez obrázka.
								</p>
							)}
						</div>

						<Button
							disabled={pending}
							type="submit"
							className="w-full h-11 rounded-xl text-base font-semibold"
						>
							{isEditing ? "Uložiť zmeny" : "Vytvoriť knihu"}
						</Button>
					</div>
				</form>
			</CardContent>
		</Card>
	);
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { RichTextEditor } from "./RichTextEditor";
import { toast } from "sonner";
import { Loader2, Plus, Info } from "lucide-react";

export type BookFormInitial = {
	id: string;
	title: string;
	description: string | null;
	isbn: string | null;
	availableCopies: number;
	authorId: string | null;
	categoryId: string | null;
	coverUrl: string | null;
};

interface BookFormProps {
	initialData?: BookFormInitial;
	authors: { id: string; name: string | null }[];
	categories: { id: string; name: string }[];
}

export function BookForm({ initialData, authors, categories }: BookFormProps) {
	const router = useRouter();

	const [title, setTitle] = useState(initialData?.title ?? "");
	const [description, setDescription] = useState(initialData?.description ?? "");
	const [isbn, setIsbn] = useState(initialData?.isbn ?? "");
	const [availableCopies, setAvailableCopies] = useState(
		initialData?.availableCopies ?? 1,
	);
	const [authorId, setAuthorId] = useState(initialData?.authorId ?? "");
	const [categoryId, setCategoryId] = useState(initialData?.categoryId ?? "");
	const [coverUrl, setCoverUrl] = useState(initialData?.coverUrl ?? "");

	const context = trpc.useUtils();

	const createMutation = trpc.books.create.useMutation({
		onSuccess: () => {
			toast.success("Kniha bola úspešne vytvorená.");
			router.push("/admin/books");
			context.books.list.invalidate();
		},
		onError: (e) => toast.error(e.message),
	});

	const updateMutation = trpc.books.update.useMutation({
		onSuccess: () => {
			toast.success("Kniha bola úspešne upravená.");
			router.push("/admin/books");
			context.books.list.invalidate();
		},
		onError: (e) => toast.error(e.message),
	});

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		const payload = {
			title,
			description: description || null,
			isbn: isbn || null,
			availableCopies,
			authorId: authorId || null,
			categoryId: categoryId || null,
			coverUrl: coverUrl || null,
		};

		if (initialData) {
			updateMutation.mutate({ id: initialData.id, ...payload });
		} else {
			createMutation.mutate(payload);
		}
	};

	const isLoading = createMutation.isPending || updateMutation.isPending;

	return (
		<Card className="border-0 shadow-xl rounded-3xl overflow-hidden bg-white/80 dark:bg-slate-950/80 backdrop-blur-md ring-1 ring-slate-200 dark:ring-slate-800">
			<CardHeader className="bg-gradient-to-r from-indigo-600/5 to-purple-600/5 border-b border-slate-100 dark:border-slate-800 pb-8 px-8">
				<div className="flex items-center gap-4 mb-2">
					<div className="p-3 bg-primary/10 rounded-2xl">
						<Plus className="h-6 w-6 text-primary" />
					</div>
					<div>
						<CardTitle className="text-2xl font-bold tracking-tight">
							{initialData ? "Upraviť knihu" : "Nová kniha"}
						</CardTitle>
						<CardDescription>
							Vyplňte detaily knihy a nahrajte obálku.
						</CardDescription>
					</div>
				</div>
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
							<div className="space-y-2">
								<label className="text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-2">
									<Info className="h-3 w-3" /> Popis knihy
								</label>
								<RichTextEditor
									value={description || ""}
									onChange={(val: string) => setDescription(val)}
									placeholder="Podrobný popis obsahu knihy..."
								/>
							</div>
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
								Kategorizácia
							</label>
							<Select value={authorId ?? ""} onValueChange={setAuthorId}>
								<SelectTrigger className="rounded-xl">
									<SelectValue placeholder="Vyberte autora" />
								</SelectTrigger>
								<SelectContent>
									{authors.map((a) => (
										<SelectItem key={a.id} value={a.id}>
											{a.name}
										</SelectItem>
									))}
								</SelectContent>
							</Select>

							<Select value={categoryId ?? ""} onValueChange={setCategoryId}>
								<SelectTrigger className="rounded-xl">
									<SelectValue placeholder="Vyberte kategóriu" />
								</SelectTrigger>
								<SelectContent>
									{categories.map((c) => (
										<SelectItem key={c.id} value={c.id}>
											{c.name}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
					</div>

					<div className="space-y-6">
						<div className="space-y-2">
							<label className="text-sm font-medium text-slate-700 dark:text-slate-200">
								Obálka knihy
							</label>
							<FileUpload
								value={coverUrl ?? ""}
								onChange={setCoverUrl}
								folder="covers"
							/>
						</div>

						<div className="pt-4">
							<Button
								type="submit"
								size="lg"
								className="w-full h-14 rounded-2xl text-lg font-bold shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all hover:-translate-y-0.5"
								disabled={isLoading}
							>
								{isLoading ? (
									<>
										<Loader2 className="mr-2 h-5 w-5 animate-spin" />
										Ukladám...
									</>
								) : initialData ? (
									"Uložiť zmeny"
								) : (
									"Vytvoriť knihu"
								)}
							</Button>
						</div>
					</div>
				</form>
			</CardContent>
		</Card>
	);
}

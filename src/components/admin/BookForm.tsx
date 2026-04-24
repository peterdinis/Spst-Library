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
	authors?: { id: string; name: string | null }[];
	categories?: { id: string; name: string }[];
	onSuccess?: () => void;
}

export function BookForm({
	initialData,
	authors,
	categories,
	onSuccess,
}: BookFormProps) {
	const router = useRouter();
	const { data: allAuthors = [] } = trpc.authors.getAll.useQuery(undefined, {
		enabled: !authors,
	});
	const { data: allCategories = [] } = trpc.categories.getAll.useQuery(
		undefined,
		{
			enabled: !categories,
		},
	);
	const resolvedAuthors = authors ?? allAuthors;
	const resolvedCategories = categories ?? allCategories;

	const [title, setTitle] = useState(initialData?.title ?? "");
	const [description, setDescription] = useState(
		initialData?.description ?? "",
	);
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
			context.books.getAll.invalidate();
			onSuccess?.();
		},
		onError: (e) => toast.error(e.message),
	});

	const updateMutation = trpc.books.update.useMutation({
		onSuccess: () => {
			toast.success("Kniha bola úspešne upravená.");
			router.push("/admin/books");
			context.books.getAll.invalidate();
			onSuccess?.();
		},
		onError: (e) => toast.error(e.message),
	});

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		const payload = {
			title,
			description: description || undefined,
			isbn: isbn || undefined,
			availableCopies,
			authorId,
			categoryId,
			coverUrl: coverUrl || undefined,
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
			<CardHeader className="bg-gradient-to-r from-violet-600/5 to-purple-600/5 border-b border-slate-100 dark:border-slate-800 pb-8 px-8">
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
			<CardContent className="pt-8 px-8">
				<form
					onSubmit={handleSubmit}
					className="grid grid-cols-1 lg:grid-cols-2 gap-10"
				>
					<div className="space-y-6">
						<div className="space-y-5">
							<h3 className="text-lg font-bold text-foreground border-b border-primary/10 pb-2">
								Základné informácie
							</h3>
							
							<div className="space-y-1.5">
								<label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
									Názov knihy *
								</label>
								<Input
									placeholder="Zadajte názov knihy"
									value={title}
									onChange={(e) => setTitle(e.target.value)}
									required
									className="rounded-xl bg-slate-50/50 dark:bg-slate-900 focus-visible:ring-primary/50 h-11"
								/>
							</div>

							<div className="space-y-1.5 pt-2">
								<label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
									<Info className="h-4 w-4 text-primary" /> Popis obsahu
								</label>
								<RichTextEditor
									value={description || ""}
									onChange={(val: string) => setDescription(val)}
									placeholder="Napíšte podrobný popis..."
								/>
							</div>
							
							<div className="grid grid-cols-2 gap-4 pt-2">
								<div className="space-y-1.5">
									<label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
										ISBN
									</label>
									<Input
										placeholder="napr. 978-80..."
										value={isbn || ""}
										onChange={(e) => setIsbn(e.target.value)}
										className="rounded-xl bg-slate-50/50 dark:bg-slate-900 focus-visible:ring-primary/50 h-11"
									/>
								</div>
								
								<div className="space-y-1.5">
									<label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
										Dostupné kusy *
									</label>
									<Input
										type="number"
										min={0}
										placeholder="Zadajte počet"
										value={availableCopies}
										onChange={(e) => setAvailableCopies(Number(e.target.value))}
										required
										className="rounded-xl bg-slate-50/50 dark:bg-slate-900 focus-visible:ring-primary/50 h-11"
									/>
								</div>
							</div>
						</div>

						<div className="space-y-5 mt-8 lg:mt-0">
							<h3 className="text-lg font-bold text-foreground border-b border-primary/10 pb-2">
								Kategorizácia
							</h3>
							
							<div className="space-y-1.5">
								<label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
									Autor diela *
								</label>
								<Select
									value={authorId ?? ""}
									onValueChange={(val) => setAuthorId(val ?? "")}
								>
									<SelectTrigger className="rounded-xl bg-slate-50/50 dark:bg-slate-900 focus-visible:ring-primary/50 h-11">
										<SelectValue placeholder="Vyberte autora" />
									</SelectTrigger>
									<SelectContent>
										{resolvedAuthors.map((a) => (
											<SelectItem key={a.id} value={a.id}>
												{a.name}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>

							<div className="space-y-1.5 pt-2">
								<label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
									Žáner / Kategória *
								</label>
								<Select
									value={categoryId ?? ""}
									onValueChange={(val) => setCategoryId(val ?? "")}
								>
									<SelectTrigger className="rounded-xl bg-slate-50/50 dark:bg-slate-900 focus-visible:ring-primary/50 h-11">
										<SelectValue placeholder="Vyberte kategóriu" />
									</SelectTrigger>
									<SelectContent>
										{resolvedCategories.map((c) => (
											<SelectItem key={c.id} value={c.id}>
												{c.name}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
						</div>
					</div>

					<div className="space-y-8">
						<div className="space-y-5">
							<h3 className="text-lg font-bold text-foreground border-b border-primary/10 pb-2">
								Vizuál
							</h3>
							
							<div className="space-y-1.5">
								<label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
									Obálka knihy (Odporúčaný pomer 2:3)
								</label>
								<Input
									placeholder="Zadajte URL obrázka obálky"
									value={coverUrl ?? ""}
									onChange={(e) => setCoverUrl(e.target.value)}
									className="rounded-xl bg-slate-50/50 dark:bg-slate-900 focus-visible:ring-primary/50 h-11"
								/>							</div>
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

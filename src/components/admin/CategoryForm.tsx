"use client";

import React, { useState } from "react";
import { trpc } from "@/trpc/client";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tag } from "lucide-react";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	CardDescription,
} from "@/components/ui/card";

interface CategoryFormProps {
	initialData?: { id: string; name: string };
	onSuccess?: () => void;
}

export function CategoryForm({ initialData, onSuccess }: CategoryFormProps) {
	const [name, setName] = useState(initialData?.name || "");
	const utils = trpc.useUtils();

	const createCategory = trpc.categories.create.useMutation({
		onSuccess: () => {
			toast.success("Kategória vytvorená!");
			setName("");
			utils.categories.getAll.invalidate();
			onSuccess?.();
		},
		onError: (e) => toast.error(e.message),
	});

	const updateCategory = trpc.categories.update.useMutation({
		onSuccess: () => {
			toast.success("Kategória upravená!");
			utils.categories.getAll.invalidate();
			onSuccess?.();
		},
		onError: (e) => toast.error(e.message),
	});

	const isEditing = !!initialData;

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (isEditing) {
			updateCategory.mutate({ id: initialData.id, name });
		} else {
			createCategory.mutate({ name });
		}
	};

	return (
		<Card className="border-0 shadow-xl rounded-3xl overflow-hidden bg-white/80 dark:bg-slate-950/80 backdrop-blur-md ring-1 ring-slate-200 dark:ring-slate-800">
			<CardHeader className="bg-linear-to-r from-emerald-600/5 to-teal-600/5 border-b border-slate-100 dark:border-slate-800 pb-6 px-6">
				<div className="flex items-center gap-3">
					<div className="p-2.5 bg-primary/10 rounded-2xl">
						<Tag className="h-5 w-5 text-primary" />
					</div>
					<div>
						<CardTitle className="text-xl font-bold tracking-tight">
							{isEditing ? "Upraviť kategóriu" : "Nová kategória"}
						</CardTitle>
						<CardDescription className="text-xs mt-0.5">Názov žánru alebo tematického okruhu.</CardDescription>
					</div>
				</div>
			</CardHeader>
			<CardContent className="pt-8 px-6">
				<form onSubmit={handleSubmit} className="space-y-6">
					<div className="space-y-1.5">
						<label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
							Názov kategórie *
						</label>
						<Input
							placeholder="napr. Sci-Fi, Román..."
							value={name}
							onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
								setName(e.target.value)
							}
							required
							className="rounded-xl bg-slate-50/50 dark:bg-slate-900 focus-visible:ring-primary/50 h-11"
						/>
					</div>
					<Button
						disabled={createCategory.isPending || updateCategory.isPending}
						type="submit"
						size="lg"
						className="w-full rounded-xl h-12 font-bold shadow-md shadow-primary/10 hover:shadow-primary/20 transition-all hover:-translate-y-0.5"
					>
						{isEditing ? "Uložiť zmeny" : "Vytvoriť kategóriu"}
					</Button>
				</form>
			</CardContent>
		</Card>
	);
}

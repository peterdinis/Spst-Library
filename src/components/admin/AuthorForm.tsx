"use client";

import React, { useState } from "react";
import Image from "next/image";
import { trpc } from "@/trpc/client";
import { toast } from "sonner";
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
import { FileUpload } from "./FileUpload";
import { User } from "lucide-react";

interface AuthorFormProps {
	initialData?: {
		id: string;
		name: string;
		bio?: string | null;
		imageUrl?: string | null;
	};
	onSuccess?: () => void;
}

export function AuthorForm({ initialData, onSuccess }: AuthorFormProps) {
	const [name, setName] = useState(initialData?.name || "");
	const [bio, setBio] = useState(initialData?.bio || "");
	const [imageUrl, setImageUrl] = useState(initialData?.imageUrl || "");
	const utils = trpc.useUtils();

	const createAuthor = trpc.authors.create.useMutation({
		onSuccess: () => {
			toast.success("Autor úspešne vytvorený!");
			setName("");
			setBio("");
			setImageUrl("");
			utils.authors.getAll.invalidate();
			onSuccess?.();
		},
		onError: (e) => toast.error(e.message),
	});

	const updateAuthor = trpc.authors.update.useMutation({
		onSuccess: () => {
			toast.success("Autor úspešne upravený!");
			utils.authors.getAll.invalidate();
			onSuccess?.();
		},
		onError: (e) => toast.error(e.message),
	});

	const isEditing = !!initialData;

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (isEditing) {
			updateAuthor.mutate({
				id: initialData.id,
				name,
				bio: bio || undefined,
				imageUrl: imageUrl || null,
			});
		} else {
			createAuthor.mutate({
				name,
				bio: bio || undefined,
				imageUrl: imageUrl || undefined,
			});
		}
	};

	return (
		<Card className="shadow-lg border-slate-200/80 dark:border-slate-800 rounded-2xl overflow-hidden bg-white dark:bg-slate-900">
			<CardHeader className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/50">
				<CardTitle className="text-xl">
					{isEditing ? "Upraviť autora" : "Nový autor"}
				</CardTitle>
				<CardDescription>
					Meno, životopis a voliteľná fotka (Azure Blob).
				</CardDescription>
			</CardHeader>
			<CardContent className="pt-6 space-y-6">
				<form onSubmit={handleSubmit} className="space-y-5">
					<div className="space-y-2">
						<label className="text-sm font-medium text-slate-700 dark:text-slate-200">
							Meno
						</label>
						<Input
							placeholder="Meno autora"
							value={name}
							onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
								setName(e.target.value)
							}
							required
							className="rounded-xl"
						/>
					</div>

					<div className="space-y-2">
						<label className="text-sm font-medium text-slate-700 dark:text-slate-200">
							Životopis
						</label>
						<Textarea
							placeholder="Krátky životopis (voliteľné)"
							value={bio || ""}
							onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
								setBio(e.target.value)
							}
							className="rounded-xl min-h-[100px]"
						/>
					</div>

					<div className="space-y-2">
						<label className="text-sm font-medium text-slate-700 dark:text-slate-200">
							Fotka autora
						</label>
						<FileUpload
							uploadFolder="authors"
							onUploadComplete={setImageUrl}
							defaultValue={imageUrl || undefined}
							imageCropAspectRatio={1}
							imageResizeTargetWidth={400}
							imageResizeTargetHeight={400}
						/>
						{imageUrl ? (
							<div className="flex items-center gap-3 rounded-xl border border-slate-200 dark:border-slate-700 p-3 bg-slate-50 dark:bg-slate-800/50">
								<div className="relative size-14 rounded-full overflow-hidden border border-slate-200 dark:border-slate-600 shrink-0">
									<Image src={imageUrl} alt="" fill className="object-cover" />
								</div>
								<p className="text-xs text-slate-500 dark:text-slate-400 truncate flex-1">
									{imageUrl}
								</p>
								<Button
									type="button"
									variant="ghost"
									size="sm"
									className="shrink-0"
									onClick={() => setImageUrl("")}
								>
									Odstrániť
								</Button>
							</div>
						) : (
							<p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
								<User className="size-3.5" />
								Bez fotky — v katalógu sa zobrazí predvolená ikona.
							</p>
						)}
					</div>

					<Button
						disabled={createAuthor.isPending || updateAuthor.isPending}
						type="submit"
						className="w-full rounded-xl h-11 font-semibold"
					>
						{isEditing ? "Uložiť zmeny" : "Vytvoriť autora"}
					</Button>
				</form>
			</CardContent>
		</Card>
	);
}

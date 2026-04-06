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
import { toast } from "sonner";
import { Loader2, UserPlus, Info } from "lucide-react";
import { RichTextEditor } from "./RichTextEditor";

export type AuthorFormInitial = {
	id: string;
	name: string | null;
	bio: string | null;
	imageUrl?: string | null;
	image?: string | null;
};

interface AuthorFormProps {
	initialData?: AuthorFormInitial;
	onSuccess?: () => void;
}

export function AuthorForm({ initialData, onSuccess }: AuthorFormProps) {
	const router = useRouter();
	const [name, setName] = useState(initialData?.name ?? "");
	const [bio, setBio] = useState(initialData?.bio ?? "");
	const [imageUrl, setImageUrl] = useState(
		initialData?.imageUrl ?? initialData?.image ?? "",
	);

	const context = trpc.useUtils();

	const createMutation = trpc.authors.create.useMutation({
		onSuccess: () => {
			toast.success("Autor bol úspešne vytvorený.");
			router.push("/admin/authors");
			context.authors.getAll.invalidate();
			onSuccess?.();
		},
		onError: (e) => toast.error(e.message),
	});

	const updateMutation = trpc.authors.update.useMutation({
		onSuccess: () => {
			toast.success("Autor bol úspešne upravený.");
			router.push("/admin/authors");
			context.authors.getAll.invalidate();
			onSuccess?.();
		},
		onError: (e) => toast.error(e.message),
	});

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		const payload = {
			name: name.trim(),
			bio: bio || undefined,
			imageUrl: imageUrl || undefined,
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
						<UserPlus className="h-6 w-6 text-primary" />
					</div>
					<div>
						<CardTitle className="text-2xl font-bold tracking-tight">
							{initialData ? "Upraviť autora" : "Nový autor"}
						</CardTitle>
						<CardDescription>
							Správa profilu autora a jeho životopisu.
						</CardDescription>
					</div>
				</div>
			</CardHeader>
			<CardContent className="pt-8 px-8">
				<form onSubmit={handleSubmit} className="space-y-8">
					<div className="space-y-2">
						<label className="text-sm font-medium text-slate-700 dark:text-slate-200">
							Celé meno
						</label>
						<Input
							placeholder="Meno autora"
							value={name}
							onChange={(e) => setName(e.target.value)}
							required
							className="rounded-xl"
						/>
					</div>

					<div className="space-y-2">
						<label className="text-sm font-medium text-slate-700 dark:text-slate-200 flex items-center gap-2">
							<Info className="h-4 w-4 text-primary" /> Životopis
						</label>
						<RichTextEditor
							value={bio || ""}
							onChange={(val: string) => setBio(val)}
							placeholder="Krátky životopis autora..."
						/>
					</div>

					<div className="space-y-2">
						<label className="text-sm font-medium text-slate-700 dark:text-slate-200">
							Fotka autora
						</label>
						<FileUpload
							defaultValue={imageUrl || ""}
							onUploadComplete={setImageUrl}
							uploadFolder="authors"
							aspectRatio={1}
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
								"Pridať autora"
							)}
						</Button>
					</div>
				</form>
			</CardContent>
		</Card>
	);
}

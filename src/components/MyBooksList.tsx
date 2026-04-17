"use client";

import Image from "next/image";
import { trpc } from "@/trpc/client";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { useAction } from "next-safe-action/hooks";
import { returnBookAction } from "@/lib/actions";
import { toast } from "sonner";

export function MyBooksList() {
	const {
		data: books,
		isLoading,
		refetch,
	} = trpc.books.getBorrowedByUser.useQuery();

	const { execute, isExecuting } = useAction(returnBookAction, {
		onSuccess: () => {
			toast.success("Kniha bola úspešne vrátená.");
			refetch();
		},
		onError: (error) => {
			toast.error(
				error.error.serverError || "Nepodarilo sa vrátiť knihu. Skúste to znova.",
			);
		},
	});

	if (isLoading)
		return (
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{[...Array(3)].map((_, i) => (
					<div key={i} className="h-48 bg-slate-200 animate-pulse rounded-xl" />
				))}
			</div>
		);

	if (!books?.length) {
		return (
			<div className="text-center p-12 bg-card rounded-xl border shadow-sm">
				<h3 className="text-xl font-semibold mb-2">Žiadne požičané knihy</h3>
				<p className="text-slate-500 mb-6">
					Zatiaľ ste si nepožičali žiadnu knihu. Pozrite si náš katalóg!
				</p>
			</div>
		);
	}

	return (
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
			{books.map((record) => (
				<Card key={record.id} className="flex flex-col">
					<CardHeader>
						{record.book?.coverUrl && (
							<div className="relative w-full h-40 mb-4">
								<Image
									src={record.book.coverUrl}
									alt={record.book.title}
									fill
								sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
									className="object-cover rounded-md"
								/>
							</div>
						)}
						<CardTitle>{record.book?.title || "Neznáma kniha"}</CardTitle>
						<CardDescription>
							Termín vrátenia:{" "}
							{new Date(record.dueDate).toLocaleDateString("sk-SK")}
						</CardDescription>
					</CardHeader>
					<CardContent className="flex-1">
						<p className="text-sm">
							<span className="font-medium">Vypožičané:</span>{" "}
							{new Date(record.borrowDate).toLocaleDateString("sk-SK")}
						</p>
					</CardContent>
					<CardFooter>
						<Button
							variant="outline"
							className="w-full"
							disabled={isExecuting}
							onClick={() =>
								execute({ borrowId: record.id, bookId: record.bookId })
							}
						>
							Vrátiť knihu
						</Button>
					</CardFooter>
				</Card>
			))}
		</div>
	);
}

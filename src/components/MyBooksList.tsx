"use client";

import { useState } from "react";
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
import { returnBookAction, clearReturnHistoryAction } from "@/lib/actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { PaginationControls } from "@/components/ui/pagination-controls";
import { Trash2 } from "lucide-react";

export function MyBooksList() {
	const [currentPage, setCurrentPage] = useState(1);
	const ITEMS_PER_PAGE = 6;

	const utils = trpc.useUtils();
	const router = useRouter();

	const {
		data: books,
		isLoading,
	} = trpc.books.getBorrowedByUser.useQuery();

	const { execute: executeReturn, isExecuting: isReturning } = useAction(returnBookAction, {
		onSuccess: () => {
			toast.success("Kniha bola úspešne vrátená.");
			utils.books.getBorrowedByUser.invalidate();
			utils.profile.getDashboard.invalidate();
			window.location.reload()
		},
		onError: ({ error }) => {
			toast.error(
				error.serverError || "Nepodarilo sa vrátiť knihu. Skúste to znova.",
			);
		},
	});

	const { execute: executeClear, isExecuting: isClearing } = useAction(clearReturnHistoryAction, {
		onSuccess: () => {
			toast.success("História vrátených kníh bola úspešne vymazaná.");
			setCurrentPage(1);
			utils.books.getBorrowedByUser.invalidate();
			utils.profile.getDashboard.invalidate();
			router.refresh();
		},
		onError: ({ error }) => {
			toast.error(
				error.serverError || "Nepodarilo sa vymazať históriu. Skúste to znova.",
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

	const hasReturnedBooks = books.some((b) => b.status === "returned");
	const totalPages = Math.ceil(books.length / ITEMS_PER_PAGE);
	const paginatedBooks = books.slice(
		(currentPage - 1) * ITEMS_PER_PAGE,
		currentPage * ITEMS_PER_PAGE
	);

	return (
		<div className="space-y-6">
			{hasReturnedBooks && (
				<div className="flex justify-end">
					<Button
						variant="destructive"
						size="sm"
						className="rounded-xl shadow-sm"
						disabled={isClearing}
						onClick={() => {
							if (confirm("Naozaj chcete natrvalo vymazať históriu vrátených kníh? Zníži sa vám tým počet v Čitateľskej výzve!")) {
								executeClear({});
							}
						}}
					>
						<Trash2 className="mr-2 h-4 w-4" />
						Vyčistiť zoznam vrátených
					</Button>
				</div>
			)}

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{paginatedBooks.map((record) => (
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
							{record.status === "borrowed" ? (
								<Button
									variant="outline"
									className="w-full"
									disabled={isReturning}
									onClick={() =>
										executeReturn({ borrowId: record.id, bookId: record.bookId })
									}
								>
									Vrátiť knihu
								</Button>
							) : (
								<Button disabled variant="secondary" className="w-full text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 opacity-100">
									✓ Vrátená {record.returnDate ? new Date(record.returnDate).toLocaleDateString("sk-SK") : ""}
								</Button>
							)}
						</CardFooter>
					</Card>
				))}
			</div>

			<PaginationControls
				currentPage={currentPage}
				totalPages={totalPages}
				onPageChange={setCurrentPage}
			/>
		</div>
	);
}

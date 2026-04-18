"use client";

import { useState, useEffect } from "react";
import { trpc } from "@/trpc/client";
import { toast } from "sonner";
import { PaginationControls } from "@/components/ui/pagination-controls";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	BookOpen,
	Tags,
	Users,
	Undo2,
	PackageCheck,
	ClipboardList,
	Bell,
	Trash2,
	Activity
} from "lucide-react";

function formatDate(value: Date | string | null | undefined) {
	if (!value) return "—";
	return new Date(value).toLocaleString("sk-SK", {
		dateStyle: "short",
		timeStyle: "short",
	});
}

function EventIcon({ type }: { type: string }) {
	if (type === "book_created")
		return <BookOpen className="h-4 w-4 text-violet-600" />;
	if (type === "author_created")
		return <Users className="h-4 w-4 text-amber-600" />;
	if (type === "category_created")
		return <Tags className="h-4 w-4 text-purple-600" />;
	if (type === "borrowed")
		return <PackageCheck className="h-4 w-4 text-emerald-600" />;
	if (type === "returned") return <Undo2 className="h-4 w-4 text-sky-600" />;
	if (type === "order_created")
		return <ClipboardList className="h-4 w-4 text-rose-600" />;
	return <Bell className="h-4 w-4 text-muted-foreground" />;
}

export function AdminNotificationsPanel() {
	const { data, isLoading, error } =
		trpc.notifications.listAdminFeed.useQuery();

	const [clearedAt, setClearedAt] = useState<number>(0);
	const [currentPage, setCurrentPage] = useState(1);
	const ITEMS_PER_PAGE = 8;

	useEffect(() => {
		const stored = localStorage.getItem("adminFeedClearedAt");
		if (stored) {
			setClearedAt(Number(stored));
		}
	}, []);

	const handleClear = () => {
		const now = Date.now();
		localStorage.setItem("adminFeedClearedAt", now.toString());
		setClearedAt(now);
		setCurrentPage(1);
		toast.success("Aktivitný kanál bol vyčistený.");
	};

	if (isLoading)
		return <div className="h-48 animate-pulse rounded-2xl bg-muted" />;
	if (error) {
		return (
			<p className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
				{error.message}
			</p>
		);
	}

	const validData = (data || []).filter((item) => {
		if (!item.createdAt) return false;
		return new Date(item.createdAt).getTime() > clearedAt;
	});

	const totalPages = Math.ceil(validData.length / ITEMS_PER_PAGE);
	const paginatedData = validData.slice(
		(currentPage - 1) * ITEMS_PER_PAGE,
		currentPage * ITEMS_PER_PAGE
	);

	return (
		<Card className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
			<CardHeader className="flex flex-row items-center justify-between border-b border-border bg-muted/30 px-4 py-3">
				<div className="flex items-center gap-3">
					<div className="rounded-xl bg-primary/10 p-2 text-primary">
						<Activity className="h-5 w-5" />
					</div>
					<CardTitle className="text-base font-semibold">
						Najnovšie aktivity v systéme
					</CardTitle>
				</div>
				<Button
					variant="ghost"
					size="sm"
					onClick={handleClear}
					className="h-8 rounded-lg text-destructive hover:bg-destructive/10 hover:text-destructive transition-colors"
				>
					<Trash2 className="h-4 w-4 mr-2" />
					Vyčistiť kanál
				</Button>
			</CardHeader>
			<CardContent className="p-0 flex flex-col">
				{!paginatedData.length ? (
					<p className="px-6 py-12 text-center text-sm text-muted-foreground">
						Zatiaľ nie sú dostupné žiadne (alebo neprečítané) udalosti.
					</p>
				) : (
					<div className="overflow-x-auto">
						<Table>
							<TableHeader>
								<TableRow className="border-b bg-muted/20 hover:bg-muted/20">
									<TableHead className="w-17.5">Typ</TableHead>
									<TableHead>Udalosť</TableHead>
									<TableHead className="max-w-[min(100%,28rem)]">Detail</TableHead>
									<TableHead className="whitespace-nowrap">Čas</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{paginatedData.map((item) => (
									<TableRow key={item.id} className="hover:bg-muted/40">
										<TableCell>
											<span className="inline-flex h-8 w-8 items-center justify-center rounded-xl border border-border bg-muted/30">
												<EventIcon type={item.type} />
											</span>
										</TableCell>
										<TableCell className="font-medium">{item.title}</TableCell>
										<TableCell className="text-sm text-muted-foreground">
											<span className="line-clamp-2">{item.description}</span>
										</TableCell>
										<TableCell className="whitespace-nowrap text-sm text-muted-foreground">
											{formatDate(item.createdAt)}
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</div>
				)}
				<PaginationControls
					currentPage={currentPage}
					totalPages={totalPages}
					onPageChange={setCurrentPage}
				/>
			</CardContent>
		</Card>
	);
}

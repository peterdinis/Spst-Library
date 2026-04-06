"use client";

import { trpc } from "@/trpc/client";
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
} from "lucide-react";

function formatDate(value: Date | string | null | undefined) {
	if (!value) return "—";
	return new Date(value).toLocaleString("sk-SK", {
		dateStyle: "short",
		timeStyle: "short",
	});
}

function EventIcon({ type }: { type: string }) {
	if (type === "book_created") return <BookOpen className="h-4 w-4 text-indigo-600" />;
	if (type === "author_created") return <Users className="h-4 w-4 text-amber-600" />;
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
	const { data, isLoading, error } = trpc.notifications.listAdminFeed.useQuery();

	if (isLoading) return <div className="h-48 animate-pulse rounded-2xl bg-muted" />;
	if (error) {
		return (
			<p className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
				{error.message}
			</p>
		);
	}

	if (!data?.length) {
		return (
			<p className="rounded-2xl border border-dashed border-border bg-muted/20 px-6 py-12 text-center text-sm text-muted-foreground">
				Zatiaľ nie sú dostupné žiadne udalosti.
			</p>
		);
	}

	return (
		<div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
			<Table>
				<TableHeader>
					<TableRow className="border-b bg-muted/20 hover:bg-muted/20">
						<TableHead className="w-[70px]">Typ</TableHead>
						<TableHead>Udalosť</TableHead>
						<TableHead className="max-w-[min(100%,28rem)]">Detail</TableHead>
						<TableHead className="whitespace-nowrap">Čas</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{data.map((item) => (
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
	);
}

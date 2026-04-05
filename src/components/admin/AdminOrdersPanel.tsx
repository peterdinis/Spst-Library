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
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

const statusLabels: Record<string, string> = {
	pending: "Čaká",
	approved: "Schválené",
	fulfilled: "Vydané",
	cancelled: "Zrušené",
};

export function AdminOrdersPanel() {
	const utils = trpc.useUtils();
	const { data: orders, isLoading, error } = trpc.orders.listAll.useQuery();

	const updateStatus = trpc.orders.updateStatus.useMutation({
		onSuccess: () => {
			utils.orders.listAll.invalidate();
			toast.success("Stav objednávky bol uložený.");
		},
		onError: (e) => toast.error(e.message || "Nepodarilo sa uložiť stav."),
	});

	if (isLoading) {
		return <div className="h-48 animate-pulse rounded-2xl bg-muted" />;
	}

	if (error) {
		return (
			<p className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
				{error.message}
			</p>
		);
	}

	if (!orders?.length) {
		return (
			<p className="rounded-2xl border border-dashed border-border bg-muted/20 px-6 py-12 text-center text-sm text-muted-foreground">
				Zatiaľ žiadne objednávky.
			</p>
		);
	}

	return (
		<div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
			<Table>
				<TableHeader>
					<TableRow className="border-b bg-muted/20 hover:bg-muted/20">
						<TableHead className="whitespace-nowrap">Dátum</TableHead>
						<TableHead>Kniha</TableHead>
						<TableHead>Čitateľ</TableHead>
						<TableHead className="max-w-[min(100%,14rem)]">Poznámka</TableHead>
						<TableHead className="min-w-[10rem] whitespace-nowrap">
							Stav
						</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{orders.map((row) => (
						<TableRow key={row.id} className="hover:bg-muted/40">
							<TableCell className="whitespace-nowrap text-muted-foreground text-sm">
								{row.createdAt
									? new Date(row.createdAt).toLocaleString("sk-SK", {
											dateStyle: "short",
											timeStyle: "short",
										})
									: "—"}
							</TableCell>
							<TableCell className="font-medium">
								{row.book?.title ?? "—"}
								{row.book?.author?.name ? (
									<span className="block text-xs text-muted-foreground font-normal">
										{row.book.author.name}
									</span>
								) : null}
							</TableCell>
							<TableCell>
								<span className="text-sm">{row.user?.name ?? "—"}</span>
								{row.user?.email ? (
									<span className="block text-xs text-muted-foreground">
										{row.user.email}
									</span>
								) : null}
							</TableCell>
							<TableCell className="max-w-md text-sm text-muted-foreground">
								<span className="line-clamp-2">{row.note || "—"}</span>
							</TableCell>
							<TableCell className="whitespace-nowrap align-middle">
								<Select
									value={row.status}
									onValueChange={(status) =>
										updateStatus.mutate({
											id: row.id,
											status: status as
												| "pending"
												| "approved"
												| "fulfilled"
												| "cancelled",
										})
									}
									disabled={updateStatus.isPending}
								>
									<SelectTrigger className="h-9 w-full min-w-[10.5rem] rounded-xl">
										<SelectValue>
											{(value) =>
												statusLabels[String(value)] ?? String(value ?? "")
											}
										</SelectValue>
									</SelectTrigger>
									<SelectContent>
										{Object.entries(statusLabels).map(([value, label]) => (
											<SelectItem key={value} value={value}>
												{label}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	);
}

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
		return (
			<p className="text-sm text-muted-foreground">Načítavam objednávky…</p>
		);
	}

	if (error) {
		return <p className="text-sm text-destructive">{error.message}</p>;
	}

	if (!orders?.length) {
		return (
			<p className="text-sm text-muted-foreground">Zatiaľ žiadne objednávky.</p>
		);
	}

	return (
		<div className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm">
			<Table>
				<TableHeader>
					<TableRow className="bg-muted/50 hover:bg-muted/50">
						<TableHead>Dátum</TableHead>
						<TableHead>Kniha</TableHead>
						<TableHead>Čitateľ</TableHead>
						<TableHead>Poznámka</TableHead>
						<TableHead className="w-[160px]">Stav</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{orders.map((row) => (
						<TableRow key={row.id}>
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
							<TableCell className="max-w-[200px] truncate text-sm text-muted-foreground">
								{row.note || "—"}
							</TableCell>
							<TableCell>
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
									<SelectTrigger className="h-9 rounded-xl w-full">
										<SelectValue>
											{(value) =>
												statusLabels[String(value)] ??
												String(value ?? "")
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

"use client";

import { useState } from "react";
import { PaginationControls } from "@/components/ui/pagination-controls";

import { trpc } from "@/trpc/client";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, User, ShieldX, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface AdminLoggedUsersPanelProps {
	filter?: "all" | "regular";
}

export function AdminLoggedUsersPanel({
	filter = "all",
}: AdminLoggedUsersPanelProps) {
	const [currentPage, setCurrentPage] = useState(1);
	const ITEMS_PER_PAGE = 10;
	const utils = trpc.useUtils();
	const { data, isLoading, error } = trpc.users.listLoggedUsers.useQuery();

	const toggleAdmin = trpc.users.toggleAdminStatus.useMutation({
		onSuccess: () => {
			toast.success("Práva boli úspešne zmenené.");
			utils.users.listLoggedUsers.invalidate();
		},
		onError: (err) => {
			toast.error(err.message);
		},
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

	let users = data?.users ?? [];

	if (filter === "regular") {
		users = users.filter((u) => !u.isAdmin);
	}

	if (users.length === 0) {
		return (
			<p className="rounded-2xl border border-dashed border-border bg-muted/20 px-6 py-12 text-center text-sm text-muted-foreground">
				{filter === "regular"
					? "Nenašli sa žiadni bežní používatelia."
					: "Zatiaľ sa neprihlásili žiadni používatelia cez Entra ID."}
			</p>
		);
	}

	return (
		<div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
			<Table containerClassName="max-h-[600px] overflow-auto">
				<TableHeader className="sticky top-0 bg-white dark:bg-slate-900 z-10 shadow-[0_1px_0_0_rgba(0,0,0,0.1)] dark:shadow-[0_1px_0_0_rgba(255,255,255,0.1)]">
					<TableRow className="border-b bg-muted/20 hover:bg-muted/20">
						<TableHead className="w-20">Profil</TableHead>
						<TableHead>Meno</TableHead>
						<TableHead>E-mail</TableHead>
						<TableHead>Rola</TableHead>
						<TableHead>Akcie</TableHead>
						<TableHead className="text-right">ID</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{(users || [])
						.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)
						.map((u) => (
						<TableRow
							key={u.id}
							className="hover:bg-muted/40 transition-colors"
						>
							<TableCell>
								<Avatar className="h-9 w-9 border border-border/50">
									<AvatarImage src={u.image ?? ""} alt={u.name ?? ""} />
									<AvatarFallback className="bg-primary/5 text-primary text-xs">
										{u.name?.slice(0, 2).toUpperCase() ?? "U"}
									</AvatarFallback>
								</Avatar>
							</TableCell>
							<TableCell className="font-medium">
								<div className="flex items-center gap-2">
									{u.name ?? "Neznámy"}
									{u.isAdmin && (
										<ShieldCheck className="h-4 w-4 text-primary" />
									)}
								</div>
							</TableCell>
							<TableCell className="text-sm text-muted-foreground">
								{u.email}
							</TableCell>
							<TableCell>
								{u.isAdmin ? (
									<Badge
										variant="default"
										className="bg-primary/10 text-primary hover:bg-primary/20 border-primary/20"
									>
										Admin
									</Badge>
								) : (
									<Badge variant="secondary" className="font-normal">
										Používateľ
									</Badge>
								)}
							</TableCell>
							<TableCell>
								{u.isAdmin && (
									<Button
										variant="ghost"
										size="sm"
										className="text-destructive hover:bg-destructive/10 hover:text-destructive rounded-xl h-8 px-3 text-xs font-semibold"
										onClick={() =>
											toggleAdmin.mutate({ id: u.id, isAdmin: false })
										}
										disabled={toggleAdmin.isPending}
									>
										{toggleAdmin.isPending ? (
											<Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" />
										) : (
											<ShieldX className="h-3.5 w-3.5 mr-1.5" />
										)}
										Odobrať práva
									</Button>
								)}
								{!u.isAdmin && (
									<Button
										variant="ghost"
										size="sm"
										className="text-primary hover:bg-primary/10 hover:text-primary rounded-xl h-8 px-3 text-xs font-semibold"
										onClick={() =>
											toggleAdmin.mutate({ id: u.id, isAdmin: true })
										}
										disabled={toggleAdmin.isPending}
									>
										{toggleAdmin.isPending ? (
											<Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" />
										) : (
											<ShieldCheck className="h-3.5 w-3.5 mr-1.5" />
										)}
										Pridať admina
									</Button>
								)}
							</TableCell>
							<TableCell className="text-right font-mono text-[10px] text-muted-foreground whitespace-nowrap">
								{u.id.slice(0, 8)}...
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
			<PaginationControls
				currentPage={currentPage}
				totalPages={Math.ceil((users?.length || 0) / ITEMS_PER_PAGE)}
				onPageChange={setCurrentPage}
			/>
		</div>
	);
}

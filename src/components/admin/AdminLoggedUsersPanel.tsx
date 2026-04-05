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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, User } from "lucide-react";

export function AdminLoggedUsersPanel() {
	const { data, isLoading, error } = trpc.users.listLoggedUsers.useQuery();

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

	const users = data?.users ?? [];

	if (users.length === 0) {
		return (
			<p className="rounded-2xl border border-dashed border-border bg-muted/20 px-6 py-12 text-center text-sm text-muted-foreground">
				Zatiaľ sa neprihlásili žiadni používatelia cez Entra ID.
			</p>
		);
	}

	return (
		<div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
			<Table>
				<TableHeader>
					<TableRow className="border-b bg-muted/20 hover:bg-muted/20">
						<TableHead className="w-[80px]">Avatar</TableHead>
						<TableHead>Meno</TableHead>
						<TableHead>E-mail</TableHead>
						<TableHead>Rola</TableHead>
						<TableHead className="text-right">ID</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{users.map((u) => (
						<TableRow key={u.id} className="hover:bg-muted/40">
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
									<Badge variant="default" className="bg-primary/10 text-primary hover:bg-primary/20 border-primary/20">
										Admin
									</Badge>
								) : (
									<Badge variant="secondary" className="font-normal">
										Používateľ
									</Badge>
								)}
							</TableCell>
							<TableCell className="text-right font-mono text-[10px] text-muted-foreground">
								{u.id.slice(0, 8)}...
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	);
}

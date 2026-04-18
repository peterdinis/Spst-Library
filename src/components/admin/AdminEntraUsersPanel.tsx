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
import { AlertCircle } from "lucide-react";

export function AdminEntraUsersPanel() {
	const { data, isLoading, error } = trpc.entra.listDirectoryUsers.useQuery();

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
	const errMsg = data?.error;
	const missingGraphEnv = data?.missingGraphEnv ?? [];

	return (
		<div className="space-y-4">
			{errMsg ? (
				<div className="rounded-2xl border border-destructive/40 bg-destructive/10 px-4 py-3 flex gap-3 text-sm">
					<AlertCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
					<div>
						<p className="font-semibold text-destructive">Graph API</p>
						<p className="text-destructive/90 mt-1">{errMsg}</p>
						{missingGraphEnv.length > 0 ? (
							<ul className="mt-2 list-inside list-disc text-xs text-destructive/80">
								{missingGraphEnv.map((key) => (
									<li key={key}>
										Chýba:{" "}
										<code className="rounded bg-destructive/20 px-1">{key}</code>
									</li>
								))}
							</ul>
						) : null}
					</div>
				</div>
			) : null}

			{!users.length && !errMsg ? (
				<p className="rounded-2xl border border-dashed border-border bg-muted/20 px-6 py-12 text-center text-sm text-muted-foreground">
					Žiadni používatelia (alebo prázdny tenant).
				</p>
			) : null}

			{users.length > 0 ? (
				<div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
					<Table>
						<TableHeader>
							<TableRow className="border-b bg-muted/20 hover:bg-muted/20">
								<TableHead>Meno</TableHead>
								<TableHead>E-mail</TableHead>
								<TableHead className="max-w-[min(100%,18rem)]">UPN</TableHead>
								<TableHead className="whitespace-nowrap">ID</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{users.map((u) => (
								<TableRow key={u.id} className="hover:bg-muted/40">
									<TableCell className="font-medium">{u.displayName}</TableCell>
									<TableCell className="text-sm text-muted-foreground">
										{u.mail ?? "—"}
									</TableCell>
									<TableCell className="break-all text-sm">
										{u.userPrincipalName}
									</TableCell>
									<TableCell className="font-mono text-xs text-muted-foreground whitespace-nowrap">
										{u.id.slice(0, 8)}…
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</div>
			) : null}
		</div>
	);
}

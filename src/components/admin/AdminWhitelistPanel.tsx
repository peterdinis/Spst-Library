"use client";

import { trpc } from "@/trpc/client";
import { useState } from "react";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, UserPlus, ShieldAlert, Loader2 } from "lucide-react";
import { toast } from "sonner";

export function AdminWhitelistPanel() {
	const [newEmail, setNewEmail] = useState("");
	const utils = trpc.useUtils();

	const { data, isLoading } = trpc.adminWhitelist.list.useQuery();

	const addMutation = trpc.adminWhitelist.add.useMutation({
		onSuccess: () => {
			toast.success("E-mail bol pridaný na whitelist.");
			setNewEmail("");
			utils.adminWhitelist.list.invalidate();
		},
		onError: (err) => {
			toast.error(err.message);
		},
	});

	const removeMutation = trpc.adminWhitelist.remove.useMutation({
		onSuccess: () => {
			toast.success("E-mail bol odstránený z whitelistu.");
			utils.adminWhitelist.list.invalidate();
		},
		onError: (err) => {
			toast.error(err.message);
		},
	});

	const handleAdd = (e: React.FormEvent) => {
		e.preventDefault();
		if (!newEmail) return;
		addMutation.mutate({ email: newEmail });
	};

	if (isLoading) {
		return <div className="h-64 animate-pulse rounded-2xl bg-muted" />;
	}

	const list = data?.list ?? [];

	return (
		<div className="space-y-6">
			<div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
				<h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
					<UserPlus className="h-5 w-5 text-primary" />
					Pridať špeciálne oprávnenie
				</h3>
				<form onSubmit={handleAdd} className="flex flex-col sm:flex-row gap-3">
					<Input
						type="email"
						placeholder="user@example.com"
						value={newEmail}
						onChange={(e) => setNewEmail(e.target.value)}
						className="max-w-md rounded-xl"
						required
					/>
					<Button
						type="submit"
						disabled={addMutation.isPending}
						className="rounded-xl px-6"
					>
						{addMutation.isPending ? (
							<Loader2 className="h-4 w-4 animate-spin mr-2" />
						) : (
							<UserPlus className="h-4 w-4 mr-2" />
						)}
						Pridať na whitelist
					</Button>
				</form>
				<p className="text-xs text-muted-foreground mt-3 flex items-center gap-1.5">
					<ShieldAlert className="h-3.5 w-3.5 text-amber-500" />
					Tento e-mail získa admin prístup hneď po prihlásení, aj bez manuálneho nastavenia v DB.
				</p>
			</div>

			<div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
				<Table>
					<TableHeader>
						<TableRow className="border-b bg-muted/20 hover:bg-muted/20">
							<TableHead>Whitelisted E-mail</TableHead>
							<TableHead>Pridané dňa</TableHead>
							<TableHead className="text-right">Akcia</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{list.length === 0 ? (
							<TableRow>
								<TableCell colSpan={3} className="h-32 text-center text-muted-foreground">
									Žiadne špeciálne oprávnenia neboli zatiaľ udelené.
								</TableCell>
							</TableRow>
						) : (
							list.map((item) => (
								<TableRow key={item.id} className="hover:bg-muted/40 transition-colors">
									<TableCell className="font-medium">{item.email}</TableCell>
									<TableCell className="text-sm text-muted-foreground">
										{item.createdAt ? new Date(item.createdAt).toLocaleDateString() : '—'}
									</TableCell>
									<TableCell className="text-right">
										<Button
											variant="ghost"
											size="icon-sm"
											className="text-destructive hover:bg-destructive/10 rounded-xl"
											onClick={() => removeMutation.mutate({ id: item.id })}
											disabled={removeMutation.isPending}
											title="Odstrániť z whitelistu"
										>
											<Trash2 className="h-4 w-4" />
										</Button>
									</TableCell>
								</TableRow>
							))
						)}
					</TableBody>
				</Table>
			</div>
		</div>
	);
}

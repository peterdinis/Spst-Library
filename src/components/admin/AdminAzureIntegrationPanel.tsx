"use client";

import { trpc } from "@/trpc/client";
import { Badge } from "@/components/ui/badge";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { AlertCircle, CheckCircle2, Cloud, Database } from "lucide-react";
import { cn } from "@/lib/utils";

const GRAPH_ENV_LABELS: Record<string, string> = {
	tenantId: "Tenant ID",
	clientId: "Client ID",
	clientSecret: "Client secret",
};

const STORAGE_ENV_LABELS: Record<string, string> = {
	connectionString: "Connection string",
	accountName: "AccountName",
	accountKey: "AccountKey",
};

type Props = {
	variant?: "full" | "compact";
	className?: string;
};

export function AdminAzureIntegrationPanel({
	variant = "full",
	className,
}: Props) {
	const { data, isLoading, error } = trpc.azure.getIntegrationStatus.useQuery();

	if (isLoading) {
		return (
			<div
				className={cn(
					"h-32 animate-pulse rounded-2xl bg-muted",
					variant === "compact" && "h-24",
					className,
				)}
			/>
		);
	}

	if (error) {
		return (
			<p
				className={cn(
					"rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive",
					className,
				)}
			>
				{error.message}
			</p>
		);
	}

	if (!data) return null;

	const { microsoftGraph, azureBlobStorage } = data;

	if (variant === "compact") {
		return (
			<div
				className={cn(
					"flex flex-wrap gap-3 rounded-2xl border border-border bg-card/80 px-4 py-3 text-sm",
					className,
				)}
			>
				<span className="flex items-center gap-2 font-medium text-muted-foreground">
					<Cloud className="size-4" />
					Azure
				</span>
				<Badge
					variant={microsoftGraph.ready ? "secondary" : "destructive"}
					className="font-normal"
				>
					Graph {microsoftGraph.ready ? "OK" : "chýba"}
				</Badge>
				<Badge
					variant={azureBlobStorage.ready ? "secondary" : "destructive"}
					className="font-normal"
				>
					Blob {azureBlobStorage.ready ? "OK" : "chýba"}
				</Badge>
			</div>
		);
	}

	return (
		<div className={cn("grid gap-6 md:grid-cols-2", className)}>
			<Card className="overflow-hidden rounded-2xl border-border shadow-sm">
				<CardHeader className="border-b border-border/80 bg-muted/30 pb-4">
					<div className="flex items-start justify-between gap-3">
						<div className="flex items-center gap-2">
							<div className="rounded-xl bg-primary/10 p-2 text-primary">
								<Cloud className="size-5" />
							</div>
							<div>
								<CardTitle className="text-base">Microsoft Graph (Entra)</CardTitle>
								<CardDescription className="text-xs">
									Zoznam používateľov, prihlásenie cez Entra
								</CardDescription>
							</div>
						</div>
						{microsoftGraph.ready ? (
							<CheckCircle2 className="size-6 shrink-0 text-emerald-600" />
						) : (
							<AlertCircle className="size-6 shrink-0 text-amber-600" />
						)}
					</div>
				</CardHeader>
				<CardContent className="pt-4 text-sm leading-relaxed text-muted-foreground">
					<p>{microsoftGraph.message}</p>
					{microsoftGraph.missing.length > 0 ? (
						<ul className="mt-3 list-inside list-disc space-y-1 text-xs font-medium text-foreground">
							{microsoftGraph.missing.map((key) => (
								<li key={key}>
									{GRAPH_ENV_LABELS[key] ?? key}
									<span className="text-muted-foreground">
										{" "}
										— premenné AUTH_MICROSOFT_ENTRA_ID_* alebo AZURE_AD_*
									</span>
								</li>
							))}
						</ul>
					) : null}
				</CardContent>
			</Card>

			<Card className="overflow-hidden rounded-2xl border-border shadow-sm">
				<CardHeader className="border-b border-border/80 bg-muted/30 pb-4">
					<div className="flex items-start justify-between gap-3">
						<div className="flex items-center gap-2">
							<div className="rounded-xl bg-violet-500/10 p-2 text-violet-600 dark:text-violet-400">
								<Database className="size-5" />
							</div>
							<div>
								<CardTitle className="text-base">Azure Blob Storage</CardTitle>
								<CardDescription className="text-xs">
									Obálky kníh a fotky (SAS upload)
								</CardDescription>
							</div>
						</div>
						{azureBlobStorage.ready ? (
							<CheckCircle2 className="size-6 shrink-0 text-emerald-600" />
						) : (
							<AlertCircle className="size-6 shrink-0 text-amber-600" />
						)}
					</div>
				</CardHeader>
				<CardContent className="pt-4 text-sm leading-relaxed text-muted-foreground">
					<p className="font-medium text-foreground">
						Kontajner (obdoba S3 bucket):{" "}
						<code className="rounded bg-muted px-1.5 py-0.5 text-xs">
							{azureBlobStorage.containerName}
						</code>
					</p>
					<p className="mt-2">{azureBlobStorage.message}</p>
					<p className="mt-3 text-xs text-muted-foreground">
						Premenné: <code className="text-foreground">AZURE_STORAGE_CONNECTION_STRING</code>{" "}
						(povinné),{" "}
						<code className="text-foreground">AZURE_STORAGE_CONTAINER_NAME</code> (voliteľné, predvolené
						„covers“).
					</p>
					{azureBlobStorage.missing.length > 0 ? (
						<ul className="mt-3 list-inside list-disc space-y-1 text-xs font-medium text-foreground">
							{azureBlobStorage.missing.map((key) => (
								<li key={key}>{STORAGE_ENV_LABELS[key] ?? key}</li>
							))}
						</ul>
					) : null}
				</CardContent>
			</Card>
		</div>
	);
}

"use client";

import {
	AlertCircle,
	CheckCircle2,
	Cloud,
	KeyRound,
	type LucideIcon,
	Mail,
	Upload,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { trpc } from "@/trpc/client";

const GRAPH_ENV_LABELS: Record<string, string> = {
	tenantId: "Tenant ID",
	clientId: "Client ID",
	clientSecret: "Client secret",
};

type Props = {
	variant?: "full" | "compact";
	className?: string;
};

export function AdminIntegrationsPanel({ variant = "full", className }: Props) {
	const { data, isLoading, error } = trpc.integrations.getStatus.useQuery();

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

	const { microsoftGraph, nextAuth, uploadthing, email } = data;

	const compactItems = [
		{ id: "graph", label: "Graph", ok: microsoftGraph.ready },
		{ id: "auth", label: "NextAuth", ok: nextAuth.ready },
		{ id: "ut", label: "UploadThing", ok: uploadthing.ready },
		{ id: "mail", label: "SMTP", ok: email.ready },
	] as const;

	if (variant === "compact") {
		return (
			<div
				className={cn(
					"flex flex-wrap gap-3 rounded-2xl border border-border bg-card/80 px-4 py-3 text-sm",
					className,
				)}
			>
				<span className="flex items-center gap-2 font-medium text-muted-foreground">
					Integrácie
				</span>
				{compactItems.map((item) => (
					<Badge
						key={item.id}
						variant={item.ok ? "secondary" : "destructive"}
						className="font-normal"
					>
						{item.label} {item.ok ? "OK" : "chýba"}
					</Badge>
				))}
			</div>
		);
	}

	return (
		<div className={cn("grid gap-6 md:grid-cols-2", className)}>
			<IntegrationCard
				icon={Cloud}
				title="Microsoft Graph (Entra)"
				description="Zoznam používateľov, prihlásenie cez Entra"
				ready={microsoftGraph.ready}
				message={microsoftGraph.message}
				missingLabels={microsoftGraph.missing.map(
					(key) => GRAPH_ENV_LABELS[key] ?? key,
				)}
				envHint="Premenné AUTH_MICROSOFT_ENTRA_ID_* alebo AZURE_AD_*"
			/>
			<IntegrationCard
				icon={KeyRound}
				title="NextAuth"
				description="Relácie a podpis cookies (AUTH_SECRET)"
				ready={nextAuth.ready}
				message={nextAuth.message}
				missingLabels={nextAuth.missing}
			/>
			<IntegrationCard
				icon={Upload}
				title="UploadThing"
				description="Nahrávanie obálok kníh a fotiek autorov"
				ready={uploadthing.ready}
				message={uploadthing.message}
				missingLabels={uploadthing.missing}
			/>
			<IntegrationCard
				icon={Mail}
				title="E-mail (SMTP)"
				description="Transakčné e-maily (nodemailer)"
				ready={email.ready}
				message={email.message}
				missingLabels={email.missing}
				envHint="SMTP_HOST, SMTP_PORT, EMAIL_FROM; voliteľne SMTP_USER / SMTP_PASS"
			/>
		</div>
	);
}

function IntegrationCard({
	icon: Icon,
	title,
	description,
	ready,
	message,
	missingLabels,
	envHint,
}: {
	icon: LucideIcon;
	title: string;
	description: string;
	ready: boolean;
	message: string;
	missingLabels: string[];
	envHint?: string;
}) {
	return (
		<Card className="overflow-hidden rounded-2xl border-border shadow-sm">
			<CardHeader className="border-b border-border/80 bg-muted/30 pb-4">
				<div className="flex items-start justify-between gap-3">
					<div className="flex items-center gap-2">
						<div className="rounded-xl bg-primary/10 p-2 text-primary">
							<Icon className="size-5" />
						</div>
						<div>
							<CardTitle className="text-base">{title}</CardTitle>
							<CardDescription className="text-xs">
								{description}
							</CardDescription>
						</div>
					</div>
					{ready ? (
						<CheckCircle2 className="size-6 shrink-0 text-emerald-600" />
					) : (
						<AlertCircle className="size-6 shrink-0 text-amber-600" />
					)}
				</div>
			</CardHeader>
			<CardContent className="pt-4 text-sm leading-relaxed text-muted-foreground">
				<p>{message}</p>
				{missingLabels.length > 0 ? (
					<ul className="mt-3 list-inside list-disc space-y-1 text-xs font-medium text-foreground">
						{missingLabels.map((label) => (
							<li key={label}>{label}</li>
						))}
					</ul>
				) : null}
				{envHint && !ready ? (
					<p className="mt-3 text-xs text-muted-foreground">{envHint}</p>
				) : null}
			</CardContent>
		</Card>
	);
}

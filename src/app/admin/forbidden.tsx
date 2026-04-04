import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ShieldOff } from "lucide-react";

export default function AdminForbidden() {
	return (
		<div className="flex min-h-dvh flex-1 flex-col items-center justify-center bg-background px-4 py-16">
			<div className="mx-auto max-w-md text-center">
				<div className="mx-auto mb-6 flex size-16 items-center justify-center rounded-2xl border border-border bg-muted/50">
					<ShieldOff
						className="size-8 text-muted-foreground"
						aria-hidden
					/>
				</div>
				<h1 className="font-heading text-2xl font-bold tracking-tight text-foreground md:text-3xl">
					Prístup zamietnutý
				</h1>
				<p className="mt-3 text-sm leading-relaxed text-muted-foreground">
					Nemáte oprávnenie správcu. Ak potrebujete prístup do administrácie,
					obráťte sa na správcu systému — v databáze musí byť pre váš účet
					nastavené pole <span className="font-mono text-xs">is_admin</span>.
				</p>
				<div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
					<Link
						href="/"
						className={cn(buttonVariants({ variant: "default" }), "w-full sm:w-auto")}
					>
						Späť na úvod
					</Link>
					<Link
						href="/books"
						className={cn(
							buttonVariants({ variant: "outline" }),
							"w-full sm:w-auto",
						)}
					>
						Katalóg kníh
					</Link>
				</div>
			</div>
		</div>
	);
}

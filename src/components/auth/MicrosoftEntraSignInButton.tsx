"use client";

import { useState, type ReactNode } from "react";
import { signIn } from "next-auth/react";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type MicrosoftEntraSignInButtonProps = {
	callbackUrl: string;
	className?: string;
	children: ReactNode;
	/** Ikona vľavo pred textom (skryje sa počas presmerovania). */
	icon?: ReactNode;
	/** Krátky text pod tlačidlom počas presmerovania na Microsoft. */
	pendingHint?: string;
};

export function MicrosoftEntraSignInButton({
	callbackUrl,
	className,
	children,
	icon,
	pendingHint = "Otvárame bezpečné prihlásenie u Microsoft…",
}: MicrosoftEntraSignInButtonProps) {
	const [pending, setPending] = useState(false);

	return (
		<div className="flex w-full flex-col gap-3">
			<Button
				type="button"
				disabled={pending}
				className={cn(className)}
				onClick={async () => {
					setPending(true);
					try {
						await signIn("microsoft-entra-id", { callbackUrl });
					} catch {
						setPending(false);
					}
				}}
			>
				{pending ? (
					<Loader2
						className="size-5 shrink-0 animate-spin"
						aria-hidden
					/>
				) : (
					icon
				)}
				{children}
			</Button>
			{pending ? (
				<p
					className="flex items-center justify-center gap-2 text-center text-sm text-muted-foreground"
					role="status"
					aria-live="polite"
				>
					<Loader2
						className="size-4 shrink-0 animate-spin text-muted-foreground"
						aria-hidden
					/>
					{pendingHint}
				</p>
			) : null}
		</div>
	);
}

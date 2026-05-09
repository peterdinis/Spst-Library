"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

type ModeToggleProps = {
	triggerClassName?: string;
};

const themes = [
	{ value: "light", icon: Sun, label: "Svetlá" },
	{ value: "system", icon: Monitor, label: "Systém" },
	{ value: "dark", icon: Moon, label: "Tmavá" },
] as const;

export function ModeToggle({ triggerClassName }: ModeToggleProps) {
	const { theme, setTheme } = useTheme();
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	const activeTheme = theme ?? "system";

	if (!mounted) {
		return (
			<div
				className={cn(
					"flex h-8 items-center gap-0.5 rounded-full border bg-muted p-1 opacity-50",
					triggerClassName
				)}
				aria-hidden
			>
				{themes.map(({ value, icon: Icon }) => (
					<div key={value} className="flex h-6 w-6 items-center justify-center rounded-full">
						<Icon className="h-3.5 w-3.5 text-muted-foreground" />
					</div>
				))}
			</div>
		);
	}

	return (
		<div
			role="radiogroup"
			aria-label="Nastavenie témy"
			className={cn(
				"flex h-8 items-center gap-0.5 rounded-full border bg-muted p-1",
				triggerClassName
			)}
		>
			{themes.map(({ value, icon: Icon, label }) => {
				const isActive = activeTheme === value;
				return (
					<button
						key={value}
						role="radio"
						aria-checked={isActive}
						aria-label={label}
						onClick={() => setTheme(value)}
						className={cn(
							"relative flex h-6 w-6 items-center justify-center rounded-full transition-all duration-200",
							isActive
								? "bg-background text-foreground shadow-sm"
								: "text-muted-foreground hover:text-foreground"
						)}
					>
						<Icon className="h-3.5 w-3.5" />
						<span className="sr-only">{label}</span>
					</button>
				);
			})}
		</div>
	);
}
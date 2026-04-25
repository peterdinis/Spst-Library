"use client";

import { Check, Laptop, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type ModeToggleProps = {
	triggerClassName?: string;
};

export function ModeToggle({ triggerClassName }: ModeToggleProps) {
	const { theme, resolvedTheme, setTheme } = useTheme();
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) {
		return (
			<Button variant="ghost" size="icon" aria-label="Prepnúť tému" disabled>
				<Sun className="h-[1.2rem] w-[1.2rem]" />
				<span className="sr-only">Prepnúť tému</span>
			</Button>
		);
	}

	const activeTheme = theme ?? "system";

	return (
		<DropdownMenu>
			<DropdownMenuTrigger
				render={
					<Button
						variant="ghost"
						size="icon"
						className={cn("relative", triggerClassName)}
						aria-label="Nastavenie témy"
					/>
				}
			>
				<Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
				<Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
				<span className="sr-only">Nastavenie témy</span>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" className="w-44">
				<DropdownMenuItem
					onClick={() => setTheme("light")}
					className="flex items-center gap-2"
				>
					<Sun className="h-4 w-4" />
					Svetlá
					{activeTheme === "light" ? <Check className="ml-auto h-4 w-4" /> : null}
				</DropdownMenuItem>
				<DropdownMenuItem
					onClick={() => setTheme("dark")}
					className="flex items-center gap-2"
				>
					<Moon className="h-4 w-4" />
					Tmavá
					{activeTheme === "dark" ? <Check className="ml-auto h-4 w-4" /> : null}
				</DropdownMenuItem>
				<DropdownMenuItem
					onClick={() => setTheme("system")}
					className="flex items-center gap-2"
				>
					<Laptop className="h-4 w-4" />
					Systém
					{activeTheme === "system" ? (
						<Check className="ml-auto h-4 w-4" />
					) : null}
				</DropdownMenuItem>
				<div className="px-2 pb-1 pt-2 text-[11px] text-muted-foreground">
					Aktuálne: {resolvedTheme === "dark" ? "Tmavá" : "Svetlá"}
				</div>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

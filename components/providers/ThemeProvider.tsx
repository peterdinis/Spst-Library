"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import {
	type ComponentProps,
	unstable_ViewTransition as ViewTransition,
} from "react";

export function ThemeProvider({
	children,
	...props
}: ComponentProps<typeof NextThemesProvider>) {
	return (
		<NextThemesProvider {...props}>
			<ViewTransition enter={"slide-in"}>{children}</ViewTransition>
		</NextThemesProvider>
	);
}

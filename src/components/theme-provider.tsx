"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

/**
 * next-themes musí obaľovať strom od prvého klientskeho renderu (vrátane injektovaného skriptu).
 * Predchádzajúci „až po mount“ obal nechal `useTheme().setTheme` ako no-op a oneskoril `class="dark"` na `<html>`.
 */
export function ThemeProvider({
	children,
	...props
}: React.ComponentProps<typeof NextThemesProvider>) {
	return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}

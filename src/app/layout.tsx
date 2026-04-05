import type { Metadata } from "next";
import { Ubuntu } from "next/font/google";
import "./globals.css";
import { TRPCProvider } from "@/trpc/Provider";
import { Toaster } from "@/components/ui/sonner";
import { Navbar } from "@/components/layout/Navbar";

const ubuntu = Ubuntu({
	variable: "--font-ubuntu",
	subsets: ["latin"],
	weight: ["300", "400", "500", "700"],
});

import { ThemeProvider } from "@/components/theme-provider";
import { ScrollToTop } from "@/components/ScrollToTop";

export const metadata: Metadata = {
	title: "SPST Knižnica",
	description: "Spravujte a vypožičiavajte si knihy zo školskej knižnice SPST.",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="sk" suppressHydrationWarning suppressContentEditableWarning>
			<body
				className={`${ubuntu.variable} font-sans antialiased flex min-h-screen flex-col bg-background text-foreground`}
			>
				<ThemeProvider
					attribute="class"
					defaultTheme="system"
					enableSystem
					disableTransitionOnChange
				>
					<TRPCProvider>
						<Navbar />
						{children}
						<ScrollToTop />
						<Toaster />
					</TRPCProvider>
				</ThemeProvider>
			</body>
		</html>
	);
}

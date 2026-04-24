import type { Metadata } from "next";
import { Suspense, ViewTransition } from "react";
import { Ubuntu } from "next/font/google";
import "./globals.css";
import "@uploadthing/react/styles.css";
import { TRPCProvider } from "@/trpc/Provider";
import { Toaster } from "@/components/ui/sonner";
import { Navbar, NavbarSkeleton } from "@/components/layout/Navbar";
import { getSiteUrl, siteConfig } from "@/lib/site-config";

const ubuntu = Ubuntu({
	variable: "--font-ubuntu",
	subsets: ["latin"],
	weight: ["300", "400", "500", "700"],
});

import { ThemeProvider } from "@/components/theme-provider";
import { ScrollToTop } from "@/components/ScrollToTop";

export const metadata: Metadata = {
	metadataBase: getSiteUrl(),
	title: {
		default: `${siteConfig.name} – školská knižnica`,
		template: `%s | ${siteConfig.name}`,
	},
	description: siteConfig.description,
	keywords: [...siteConfig.keywords],
	applicationName: siteConfig.shortName,
	openGraph: {
		type: "website",
		locale: "sk_SK",
		siteName: siteConfig.name,
		title: siteConfig.name,
		description: siteConfig.description,
	},
	twitter: {
		card: "summary_large_image",
		title: siteConfig.name,
		description: siteConfig.description,
	},
	robots: { index: true, follow: true },
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
						<ViewTransition>
							<Suspense fallback={<NavbarSkeleton />}>
								<Navbar />
							</Suspense>
							{children}
							<ScrollToTop />
							<Toaster />
						</ViewTransition>
					</TRPCProvider>
				</ThemeProvider>
			</body>
		</html>
	);
}

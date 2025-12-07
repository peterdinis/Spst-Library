import type { Metadata } from "next";
import { Ubuntu } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/shared/Navigation";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { AuthProvider } from "@/components/providers/AuthContext";
import QueryProvider from "@/components/providers/QueryProvider";

const ubuntu = Ubuntu({
	subsets: ["latin"],
	weight: ["300", "400", "500", "700"],
	variable: "--font-ubuntu",
});

export const metadata: Metadata = {
	title: {
		default: "Školská knižnica | Digitálny katalóg",
		template: "%s | Školská knižnica",
	},
	description:
		"Digitálny katalóg školských knižníc - vyhľadávanie kníh, autorov, rezervácie a správa čitateľských kont",
	keywords: [
		"školská knižnica",
		"digitálna knižnica",
		"knižný katalóg",
		"vyhľadávanie kníh",
		"rezervácia kníh",
		"školské knihy",
		"študentská knižnica",
		"knižničný systém",
	],
	authors: [{ name: "Školská knižnica" }, { name: "Vzdelávacia inštitúcia" }],
	creator: "Školská knižnica",
	publisher: "Školská knižnica",
	formatDetection: {
		email: false,
		address: false,
		telephone: false,
	},
	metadataBase: new URL("https://skolska-kniznica.example.com"),
	alternates: {
		canonical: "/",
		languages: {
			"sk-SK": "/sk",
		},
	},
	openGraph: {
		type: "website",
		locale: "sk_SK",
		url: "https://skolska-kniznica.example.com",
		title: "Školská knižnica | Digitálny katalóg",
		description:
			"Digitálny katalóg školských knižníc - vyhľadávanie kníh, autorov, rezervácie a správa čitateľských kont",
		siteName: "Školská knižnica",
		images: [
			{
				url: "/og-image.png",
				width: 1200,
				height: 630,
				alt: "Školská knižnica - Digitálny katalóg",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: "Školská knižnica | Digitálny katalóg",
		description: "Digitálny katalóg školských knižníc",
		images: ["/twitter-image.png"],
		creator: "@skolskakniznica",
	},
	robots: {
		index: true,
		follow: true,
		googleBot: {
			index: true,
			follow: true,
			"max-video-preview": -1,
			"max-image-preview": "large",
			"max-snippet": -1,
		},
	},
	verification: {
		google: "google-site-verification-code",
		yandex: "yandex-verification-code",
		yahoo: "yahoo-verification-code",
	},
	category: "education",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="sk" className={ubuntu.variable} suppressHydrationWarning>
			<head>
				<meta
					name="theme-color"
					content="#1e40af"
					media="(prefers-color-scheme: light)"
				/>
				<meta
					name="theme-color"
					content="#0f172a"
					media="(prefers-color-scheme: dark)"
				/>
				<meta
					name="viewport"
					content="width=device-width, initial-scale=1, maximum-scale=5"
				/>
			</head>
			<body className="font-sans">
				<ThemeProvider
					attribute="class"
					defaultTheme="system"
					enableSystem
					disableTransitionOnChange
				>
					<AuthProvider>
						<QueryProvider>
							<Navigation />
							<main className="min-h-screen pt-16">{children}</main>
						</QueryProvider>
					</AuthProvider>
				</ThemeProvider>
			</body>
		</html>
	);
}

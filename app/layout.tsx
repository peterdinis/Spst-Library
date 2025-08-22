import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import Navigation from "@/components/shared/Navigation";

export const metadata: Metadata = {
  title: "SPŠT Knižnica Bardejov",
  description:
    "Oficiálna knižnica Strednej priemyselnej školy technickej v Bardejove. Prezrite si dostupné knihy, spravujte výpožičky a objavujte nové tituly.",
  keywords: [
    "SPŠT Knižnica",
    "Stredná priemyselná škola technická Bardejov",
    "knižnica Bardejov",
    "výpožičky kníh",
    "študentská knižnica",
    "SPŠT Bardejov",
  ],
  authors: [
    { name: "Peter Dinis", url: "https://dinis-portfolio.vercel.app/" },
  ],
  icons: [
    {
      rel: "icon",
      url: "https://www.spsbj.sk/wp-content/uploads/cropped-original-32x32.png",
    },
  ],
  openGraph: {
    type: "website",
    url: "https://www.spsbj.sk/",
    title: "SPŠT Knižnica | Bardejov",
    description:
      "Navštívte oficiálnu knižnicu Strednej priemyselnej školy technickej v Bardejove. Prezrite si dostupné knihy, spravujte výpožičky a objavujte nové tituly.",
    siteName: "SPŠT Knižnica",
  },
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body
				className={`antialiased`}
			>
				<ThemeProvider
          attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
					<Navigation />
					{children}
				</ThemeProvider>
			</body>
		</html>
	);
}

import type { Metadata } from "next";
import { Ubuntu } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import TransitionProvider from "@/components/providers/TransitionProvider";
import ScrollToTop from "@/components/shared/ScrollToTop";
import QueryProvider from "@/components/providers/QueryProvider";
import Navigation from "@/components/shared/Navigation";

const ubuntu = Ubuntu({
  weight: "700",
  subsets: ["latin"],
});

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
  authors: [{ name: "Peter Dinis" }],
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
    <html lang="en" suppressHydrationWarning>
      <body className={`${ubuntu} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
          storageKey="spst-key"
        >
          <TransitionProvider>
            <QueryProvider>
              <Navigation />
              {children}
              <ScrollToTop />
            </QueryProvider>
          </TransitionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

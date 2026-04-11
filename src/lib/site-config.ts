/**
 * Centrálna SEO / OG konfigurácia. Nastavte NEXT_PUBLIC_APP_URL v produkcii (napr. https://vasadomena.sk).
 */
export const siteConfig = {
	name: "SPŠT Knižnica",
	shortName: "SPŠT Knižnica",
	description:
		"Digitálna školská knižnica – katalóg kníh, výpožičky a čitateľský profil pre študentov a pedagógov SPŠT.",
	keywords: [
		"knižnica",
		"SPŠT",
		"škola",
		"knihy",
		"výpožičky",
		"katalóg",
	],
} as const;

export function getSiteUrl(): URL {
	const raw =
		process.env.NEXT_PUBLIC_APP_URL ||
		(process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null) ||
		"http://localhost:3000";
	try {
		return new URL(raw);
	} catch {
		return new URL("http://localhost:3000");
	}
}

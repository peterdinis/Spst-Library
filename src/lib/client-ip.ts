/**
 * Prvá adresa v reťazci X-Forwarded-For (typicky pôvodný klient za proxy).
 */
export function getClientIpFromForwardedHeader(forwarded: string | null): string {
	if (!forwarded?.trim()) return "127.0.0.1";
	const first = forwarded.split(",")[0]?.trim();
	return first || "127.0.0.1";
}

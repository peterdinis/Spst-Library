/**
 * Zoznam používateľov z Microsoft Entra ID cez Graph API (client credentials).
 * V Azure App Registration pridajte application permission **User.Read.All** (alebo Directory.Read.All)
 * a udeľte admin consent. Používajú sa rovnaké premenné ako pre NextAuth Entra provider.
 */

export type EntraDirectoryUser = {
	id: string;
	displayName: string;
	mail: string | null;
	userPrincipalName: string;
};

function getGraphCredentials() {
	const tenantId =
		process.env.AUTH_MICROSOFT_ENTRA_ID_TENANT_ID ??
		process.env.AZURE_AD_TENANT_ID;
	const clientId =
		process.env.AUTH_MICROSOFT_ENTRA_ID_CLIENT_ID ??
		process.env.AZURE_AD_CLIENT_ID;
	const clientSecret =
		process.env.AUTH_MICROSOFT_ENTRA_ID_CLIENT_SECRET ??
		process.env.AZURE_AD_CLIENT_SECRET;

	if (!tenantId || !clientId || !clientSecret) {
		return null;
	}
	return { tenantId, clientId, clientSecret };
}

async function getGraphAccessToken(): Promise<string> {
	const creds = getGraphCredentials();
	if (!creds) {
		throw new Error(
			"Chýbajú údaje pre Graph API nastavte AUTH_MICROSOFT_ENTRA_ID_TENANT_ID, CLIENT_ID a CLIENT_SECRET.",
		);
	}

	const tokenUrl = `https://login.microsoftonline.com/${creds.tenantId}/oauth2/v2.0/token`;
	const body = new URLSearchParams({
		client_id: creds.clientId,
		client_secret: creds.clientSecret,
		scope: "https://graph.microsoft.com/.default",
		grant_type: "client_credentials",
	});

	const res = await fetch(tokenUrl, {
		method: "POST",
		headers: { "Content-Type": "application/x-www-form-urlencoded" },
		body,
	});

	const data = (await res.json()) as {
		access_token?: string;
		error_description?: string;
	};
	if (!res.ok || !data.access_token) {
		throw new Error(
			data.error_description || `Graph token: ${res.status} ${res.statusText}`,
		);
	}
	return data.access_token;
}

export async function fetchEntraDirectoryUsers(): Promise<
	EntraDirectoryUser[]
> {
	const token = await getGraphAccessToken();
	const select = "id,displayName,mail,userPrincipalName";
	let url: string | undefined =
		`https://graph.microsoft.com/v1.0/users?$select=${select}&$orderby=displayName&$top=100`;
	const all: EntraDirectoryUser[] = [];

	while (url) {
		const res = await fetch(url, {
			headers: { Authorization: `Bearer ${token}` },
		});
		const data = (await res.json()) as {
			value?: EntraDirectoryUser[];
			"@odata.nextLink"?: string;
			error?: { message?: string };
		};

		if (!res.ok) {
			throw new Error(data.error?.message || `Graph users: ${res.status}`);
		}

		if (data.value?.length) {
			all.push(...data.value);
		}
		url = data["@odata.nextLink"];
	}

	return all;
}

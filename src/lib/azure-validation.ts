/**
 * Kontrola konfigurácie Microsoft Entra / Graph.
 */

export type GraphEnvField = "tenantId" | "clientId" | "clientSecret";

export type GraphConfigResult = {
	ready: boolean;
	missing: GraphEnvField[];
	message: string;
};

export type AzureIntegrationStatus = {
	microsoftGraph: GraphConfigResult;
	anyReady: boolean;
};

function readGraphEnv() {
	const tenantId =
		process.env.AUTH_MICROSOFT_ENTRA_ID_TENANT_ID ??
		process.env.AZURE_AD_TENANT_ID;
	const clientId =
		process.env.AUTH_MICROSOFT_ENTRA_ID_CLIENT_ID ??
		process.env.AZURE_AD_CLIENT_ID;
	const clientSecret =
		process.env.AUTH_MICROSOFT_ENTRA_ID_CLIENT_SECRET ??
		process.env.AZURE_AD_CLIENT_SECRET;
	return { tenantId, clientId, clientSecret };
}

export function getMicrosoftGraphConfigStatus(): GraphConfigResult {
	const { tenantId, clientId, clientSecret } = readGraphEnv();
	const missing: GraphEnvField[] = [];
	if (!tenantId?.trim()) missing.push("tenantId");
	if (!clientId?.trim()) missing.push("clientId");
	if (!clientSecret?.trim()) missing.push("clientSecret");

	const ready = missing.length === 0;
	const hint =
		"Nastavte AUTH_MICROSOFT_ENTRA_ID_TENANT_ID, AUTH_MICROSOFT_ENTRA_ID_CLIENT_ID a AUTH_MICROSOFT_ENTRA_ID_CLIENT_SECRET (alebo ekvivalent AZURE_AD_*). V Azure App Registration udeľte oprávnenie User.Read.All a administrátorský súhlas.";

	return {
		ready,
		missing,
		message: ready
			? "Microsoft Graph: pripravené (token sa overí pri prvom volaní)."
			: `Microsoft Graph: chýba konfigurácia (${missing.join(", ")}). ${hint}`,
	};
}

export function isMicrosoftGraphConfigured(): boolean {
	return getMicrosoftGraphConfigStatus().ready;
}

export function getAzureIntegrationStatus(): AzureIntegrationStatus {
	const microsoftGraph = getMicrosoftGraphConfigStatus();
	return {
		microsoftGraph,
		anyReady: microsoftGraph.ready,
	};
}

/**
 * Kontrola konfigurácie Microsoft Entra / Graph a Azure Blob Storage (bez úniku tajomstiev).
 * Premenné zodpovedajú next-auth Entra provideru a fallbackom v microsoft-graph.ts / azure-storage.ts.
 */

import { getAzureBlobContainerName } from "@/lib/azure-blob-config";

export type GraphEnvField = "tenantId" | "clientId" | "clientSecret";

export type GraphConfigResult = {
	ready: boolean;
	missing: GraphEnvField[];
	/** Krátka správa pre administrátora (SK) */
	message: string;
};

export type StorageConfigResult = {
	ready: boolean;
	missing: ("connectionString" | "accountName" | "accountKey")[];
	message: string;
	/** Názov blob kontajnera (voliteľná premenná AZURE_STORAGE_CONTAINER_NAME, inak „covers“). */
	containerName: string;
};

export type AzureIntegrationStatus = {
	microsoftGraph: GraphConfigResult;
	azureBlobStorage: StorageConfigResult;
	/** true ak je aspoň jedna integrácia pripravená */
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

function parseConnectionString(conn: string): {
	accountName?: string;
	accountKey?: string;
} {
	const parts = conn.split(";").reduce(
		(acc, part) => {
			const [key, ...value] = part.split("=");
			if (key) acc[key] = value.join("=");
			return acc;
		},
		{} as Record<string, string>,
	);
	return {
		accountName: parts.AccountName,
		accountKey: parts.AccountKey,
	};
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

export function getAzureStorageConfigStatus(): StorageConfigResult {
	const containerName = getAzureBlobContainerName();
	const raw = process.env.AZURE_STORAGE_CONNECTION_STRING?.trim();
	const missing: StorageConfigResult["missing"] = [];

	if (!raw) {
		missing.push("connectionString");
		return {
			ready: false,
			missing,
			containerName,
			message: `Azure Blob Storage: chýba AZURE_STORAGE_CONNECTION_STRING (upload do kontajnera „${containerName}“; voliteľne AZURE_STORAGE_CONTAINER_NAME).`,
		};
	}

	const parsed = parseConnectionString(raw);
	if (!parsed.accountName) missing.push("accountName");
	if (!parsed.accountKey) missing.push("accountKey");

	const ready = missing.length === 0;
	return {
		ready,
		missing,
		containerName,
		message: ready
			? `Azure Blob Storage: connection string je načítaný. Kontajner: „${containerName}“ (premenná AZURE_STORAGE_CONTAINER_NAME, ak chcete iný názov ako predvolený „covers“).`
			: "Azure Blob Storage: connection string je neplatný alebo chýba AccountName / AccountKey.",
	};
}

export function isAzureStorageConfigured(): boolean {
	return getAzureStorageConfigStatus().ready;
}

export function getAzureIntegrationStatus(): AzureIntegrationStatus {
	const microsoftGraph = getMicrosoftGraphConfigStatus();
	const azureBlobStorage = getAzureStorageConfigStatus();
	return {
		microsoftGraph,
		azureBlobStorage,
		anyReady: microsoftGraph.ready || azureBlobStorage.ready,
	};
}

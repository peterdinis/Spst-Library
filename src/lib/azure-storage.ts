import {
	BlobServiceClient,
	BlobSASPermissions,
	generateBlobSASQueryParameters,
	StorageSharedKeyCredential,
} from "@azure/storage-blob";

const AZURE_STORAGE_CONNECTION_STRING = process.env
	.AZURE_STORAGE_CONNECTION_STRING as string;

function getStorageCredentials() {
	if (!AZURE_STORAGE_CONNECTION_STRING) return null;

	const parts = AZURE_STORAGE_CONNECTION_STRING.split(";").reduce(
		(acc, part) => {
			const [key, ...value] = part.split("=");
			acc[key] = value.join("=");
			return acc;
		},
		{} as Record<string, string>,
	);

	return {
		accountName: parts.AccountName,
		accountKey: parts.AccountKey,
		endpoint: parts.BlobEndpoint || `https://${parts.AccountName}.blob.core.windows.net`,
	};
}

export type AzureUploadOptions = {
	/** Optional folder prefix inside the container (e.g. "books", "authors") */
	prefix?: string;
};

/** Vytvorí SAS URL pre priamy upload z klienta (PUT blob) */
export async function generateAzureSASUrl(
	fileName: string,
	options?: AzureUploadOptions,
): Promise<{ url: string; blobName: string }> {
	const creds = getStorageCredentials();
	if (!creds || !creds.accountName || !creds.accountKey) {
		throw new Error("Azure Storage credentials missing or invalid.");
	}

	const containerName = "covers";
	const prefix = options?.prefix ? `${options.prefix.replace(/\/$/, "")}/` : "";
	const safeName = fileName.replace(/[^a-zA-Z0-9.]/g, "_");
	const blobName = `${prefix}${Date.now()}-${safeName}`;

	const sharedKeyCredential = new StorageSharedKeyCredential(
		creds.accountName,
		creds.accountKey,
	);

	const expiresOn = new Date();
	expiresOn.setMinutes(expiresOn.getMinutes() + 30); // 30 minút platnosť

	const sasToken = generateBlobSASQueryParameters(
		{
			containerName,
			blobName,
			permissions: BlobSASPermissions.parse("cw"), // create + write
			startsOn: new Date(),
			expiresOn,
		},
		sharedKeyCredential,
	).toString();

	const url = `${creds.endpoint.replace(/\/$/, "")}/${containerName}/${blobName}?${sasToken}`;

	return { url, blobName };
}

export async function uploadImageToAzure(
	file: File,
	options?: AzureUploadOptions,
): Promise<string> {
	if (!AZURE_STORAGE_CONNECTION_STRING) {
		throw new Error("Azure Storage Connection String not found");
	}

	const blobServiceClient = BlobServiceClient.fromConnectionString(
		AZURE_STORAGE_CONNECTION_STRING,
	);
	const containerName = "covers";
	const containerClient = blobServiceClient.getContainerClient(containerName);

	// Ensure container exists
	await containerClient.createIfNotExists({
		access: "blob",
	});

	const prefix = options?.prefix ? `${options.prefix.replace(/\/$/, "")}/` : "";
	const blobName = `${prefix}${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.]/g, "_")}`;
	const blockBlobClient = containerClient.getBlockBlobClient(blobName);

	const buffer = Buffer.from(await file.arrayBuffer());

	await blockBlobClient.uploadData(buffer, {
		blobHTTPHeaders: { blobContentType: file.type },
	});

	return blockBlobClient.url;
}

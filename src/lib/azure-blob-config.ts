/**
 * Azure Blob Storage: názov kontajnera (obdoba S3 „bucketu“).
 * Ak nie je nastavené, použije sa „covers“.
 */
export function getAzureBlobContainerName(): string {
	const raw = process.env.AZURE_STORAGE_CONTAINER_NAME?.trim();
	return raw && raw.length > 0 ? raw : "covers";
}

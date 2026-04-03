import { BlobServiceClient } from '@azure/storage-blob';

const AZURE_STORAGE_CONNECTION_STRING = process.env.AZURE_STORAGE_CONNECTION_STRING as string;

export type AzureUploadOptions = {
  /** Optional folder prefix inside the container (e.g. "books", "authors") */
  prefix?: string;
};

export async function uploadImageToAzure(file: File, options?: AzureUploadOptions): Promise<string> {
  if (!AZURE_STORAGE_CONNECTION_STRING) {
    throw new Error('Azure Storage Connection String not found');
  }

  const blobServiceClient = BlobServiceClient.fromConnectionString(AZURE_STORAGE_CONNECTION_STRING);
  const containerName = 'covers';
  const containerClient = blobServiceClient.getContainerClient(containerName);

  // Ensure container exists
  await containerClient.createIfNotExists({
    access: 'blob',
  });

  const prefix = options?.prefix ? `${options.prefix.replace(/\/$/, '')}/` : '';
  const blobName = `${prefix}${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
  const blockBlobClient = containerClient.getBlockBlobClient(blobName);

  const buffer = Buffer.from(await file.arrayBuffer());

  await blockBlobClient.uploadData(buffer, {
    blobHTTPHeaders: { blobContentType: file.type },
  });

  return blockBlobClient.url;
}

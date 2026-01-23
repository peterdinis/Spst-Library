import { createUploadthing, type FileRouter } from "uploadthing/server";

const f = createUploadthing();

// FileRouter for author image uploads and book cover uploads
export const uploadRouter = {
	authorImage: f({
		image: {
			maxFileSize: "4MB",
			maxFileCount: 1,
		},
	})
		.middleware(async ({ req }) => {
			// TODO: Add real authentication when available
			// For now, we'll allow uploads without strict auth
			return { userId: "anonymous" };
		})
		.onUploadComplete(async ({ metadata, file }) => {

			// Return all necessary data for Convex integration
			return {
				uploadedBy: metadata.userId,
				fileKey: file.key,
				fileName: file.name,
				fileUrl: file.url,
				fileSize: file.size,
				fileType: file.type,
			};
		}),
	bookCover: f({
		image: {
			maxFileSize: "4MB",
			maxFileCount: 1,
		},
	})
		.middleware(async ({ req }) => {
			// TODO: Add real authentication when available
			// For now, we'll allow uploads without strict auth
			return { userId: "anonymous" };
		})
		.onUploadComplete(async ({ metadata, file }) => {

			// Return all necessary data for Convex integration
			return {
				uploadedBy: metadata.userId,
				fileKey: file.key,
				fileName: file.name,
				fileUrl: file.url,
				fileSize: file.size,
				fileType: file.type,
			};
		}),
} satisfies FileRouter;

export type UploadRouter = typeof uploadRouter;

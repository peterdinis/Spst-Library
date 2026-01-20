import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

export const ourFileRouter = {
  authorImage: f({
    image: {
      maxFileSize: "4MB",
      maxFileCount: 1,
    },
  })
    .middleware(async ({ req }) => {
      // Implement authentication here
      // For now, return a simple user object
      return { userId: "user-id" };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // Only return JSON-serializable data
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

export type OurFileRouter = typeof ourFileRouter;
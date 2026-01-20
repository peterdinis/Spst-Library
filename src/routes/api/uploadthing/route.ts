import { createFileRoute } from "@tanstack/react-router";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { createRouteHandler } from "uploadthing/server";

// 1. Create UploadThing router
const f = createUploadthing();

export const ourFileRouter = {
  authorImage: f({
    image: {
      maxFileSize: "4MB",
      maxFileCount: 1,
    },
  })
    .middleware(async () => {
      return { userId: "user-id" };
    })
    .onUploadComplete(async ({ metadata, file }) => {
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

// 2. Create the handler
const handler = createRouteHandler({
  router: ourFileRouter,
});

// 3. Export TanStack Router Route for API endpoint
export const Route = createFileRoute('/api/uploadthing')({
  loader: async () => {
    return null;
  },
});

// 4. Export HTTP handlers
export const GET = handler;
export const POST = handler;
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

const f = createUploadthing();

const auth = (req: Request) => ({ id: "fakeId" }); // Replace with real auth

export const ourFileRouter = {
  authorImage: f({
    image: {
      maxFileSize: "4MB",
      maxFileCount: 1,
    },
  })
    .middleware(async ({ req }) => {
      const user = await auth(req);
      if (!user) throw new UploadThingError("Unauthorized");
      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete for userId:", metadata.userId);
      console.log("file url", file.url);

      // You can save the file info to your database here
      // For example:
      // await saveFileToDatabase({
      //   storageId: file.key,
      //   url: file.url,
      //   name: file.name,
      //   type: file.type,
      //   size: file.size,
      //   uploadedBy: metadata.userId,
      //   entityType: "author_photo",
      // });

      return { uploadedBy: metadata.userId, file };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
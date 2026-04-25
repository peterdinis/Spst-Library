import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { auth } from "@/auth";
import { userHasAdminAccess } from "@/lib/admin-access";
import { db } from "@/db";
import { images } from "@/db/schema";

const f = createUploadthing();

export const ourFileRouter = {
	bookCover: f({
		image: { maxFileSize: "4MB", maxFileCount: 1 },
	})
		.middleware(async () => {
			const session = await auth();
			if (!session?.user?.id) throw new UploadThingError("Unauthorized");
			const isAdmin = await userHasAdminAccess(session);
			if (!isAdmin) throw new UploadThingError("Forbidden");

			return { userId: session.user.id } as const;
		})
		.onUploadComplete(async ({ metadata, file }) => {
			console.log("Upload complete for userId:", metadata.userId);
			
			await db.insert(images).values({
				id: file.key,
				url: file.url,
				fileName: file.name,
				size: file.size,
				userId: metadata.userId,
			});

			return { uploadedBy: metadata.userId };
		}),

	authorPhoto: f({
		image: { maxFileSize: "4MB", maxFileCount: 1 },
	})
		.middleware(async () => {
			const session = await auth();
			if (!session?.user?.id) throw new UploadThingError("Unauthorized");
			const isAdmin = await userHasAdminAccess(session);
			if (!isAdmin) throw new UploadThingError("Forbidden");

			return { userId: session.user.id } as const;
		})
		.onUploadComplete(async ({ metadata, file }) => {
			console.log("Upload complete for userId:", metadata.userId);
			
			await db.insert(images).values({
				id: file.key,
				url: file.url,
				fileName: file.name,
				size: file.size,
				userId: metadata.userId,
			});

			return { uploadedBy: metadata.userId };
		}),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;

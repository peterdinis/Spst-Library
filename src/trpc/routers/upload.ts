import { router, adminProcedure } from "../server";
import { generateAzureSASUrl } from "@/lib/azure-storage";
import { z } from "zod";

export const uploadRouter = router({
	/** Získa presigned URL (SAS) pre priamy upload na Azure Blob Storage */
	getPresignedUrl: adminProcedure
		.input(
			z.object({
				fileName: z.string().min(1),
				folder: z.enum(["books", "authors"]).default("books"),
			}),
		)
		.mutation(async ({ input }) => {
			try {
				const { url, blobName } = await generateAzureSASUrl(input.fileName, {
					prefix: input.folder,
				});
				return { url, blobName };
			} catch (e: unknown) {
				const message = e instanceof Error ? e.message : "Chyba pri generovaní SAS tokenu.";
				throw new Error(message);
			}
		}),
});

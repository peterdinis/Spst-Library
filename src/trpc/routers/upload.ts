import { router, adminProcedure } from "../server";
import { generateAzureSASUrl } from "@/lib/azure-storage";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { getAzureStorageConfigStatus } from "@/lib/azure-validation";

export const uploadRouter = router({
	/** Získa presigned URL (SAS) pre priamy upload na Azure Blob Storage */
	getPresignedUrl: adminProcedure
		.input(
			z.object({
				fileName: z
					.string()
					.min(1)
					.max(260)
					.refine(
						(name) => /\.(jpe?g|png|gif|webp)$/i.test(name),
						"Názov súboru musí končiť príponou obrázka (jpg, png, gif, webp).",
					),
				folder: z.enum(["books", "authors"]).default("books"),
			}),
		)
		.mutation(async ({ input }) => {
			const storage = getAzureStorageConfigStatus();
			if (!storage.ready) {
				throw new TRPCError({
					code: "PRECONDITION_FAILED",
					message: storage.message,
				});
			}
			try {
				const { url, blobName } = await generateAzureSASUrl(input.fileName, {
					prefix: input.folder,
				});
				return { url, blobName };
			} catch (e: unknown) {
				const message =
					e instanceof Error ? e.message : "Chyba pri generovaní SAS tokenu.";
				throw new TRPCError({
					code: "INTERNAL_SERVER_ERROR",
					message,
				});
			}
		}),
});

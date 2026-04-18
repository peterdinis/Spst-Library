import { router, adminProcedure } from "../server";
import { getAzureIntegrationStatus } from "@/lib/azure-validation";

export const azureRouter = router({
	/** Stav konfigurácie Entra/Graph a Azure Blob (bez citlivých údajov). */
	getIntegrationStatus: adminProcedure.query(() => {
		return getAzureIntegrationStatus();
	}),
});

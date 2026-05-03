import { getPlatformIntegrationsStatus } from "@/lib/integration-status";
import { adminProcedure, router } from "../server";

export const integrationsRouter = router({
	/** Stav napojení na externé platformy (Entra/Graph, NextAuth, UploadThing, e-mail). */
	getStatus: adminProcedure.query(() => {
		return getPlatformIntegrationsStatus();
	}),
});

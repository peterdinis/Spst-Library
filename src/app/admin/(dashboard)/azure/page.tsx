import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminAzureIntegrationPanel } from "@/components/admin/AdminAzureIntegrationPanel";

export const metadata = {
	title: "Azure integrácie | Admin",
	description:
		"Kontrola premenných prostredia pre Microsoft Entra / Graph a Azure Blob Storage.",
};

export default function AdminAzurePage() {
	return (
		<div className="space-y-10 pb-12">
			<AdminPageHeader
				title="Azure a Microsoft 365"
				description="Overte, či sú nastavené premenné pre Graph API (používatelia Entra, prihlásenie) a Azure Blob (nahávanie obálok). Tajné kľúče sa nikde nezobrazujú."
			/>
			<AdminAzureIntegrationPanel variant="full" />
		</div>
	);
}

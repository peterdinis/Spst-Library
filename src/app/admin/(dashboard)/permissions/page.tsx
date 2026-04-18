import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminWhitelistPanel } from "@/components/admin/AdminWhitelistPanel";
import { AdminAzureIntegrationPanel } from "@/components/admin/AdminAzureIntegrationPanel";

export const metadata = {
	title: "Špeciálne oprávnenia | Admin Dashboard",
	description:
		"Správa automatického admin prístupu pre konkrétne e-mailové adresy.",
};

export default function AdminPermissionsPage() {
	return (
		<div className="space-y-10 pb-12">
			<AdminPageHeader
				title="Špeciálne oprávnenia"
				description="Pridajte e-mailové adresy na whitelist. Používatelia s týmto e-mailom získajú admin prístup hneď po prvom prihlásení cez Microsoft Entra."
			/>
			<AdminAzureIntegrationPanel variant="compact" />
			<AdminWhitelistPanel />
		</div>
	);
}

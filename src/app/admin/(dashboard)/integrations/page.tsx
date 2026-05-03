import { AdminIntegrationsPanel } from "@/components/admin/AdminIntegrationsPanel";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";

export const metadata = {
	title: "Integrácie | Admin",
	description:
		"Stav napojenia na Microsoft Entra / Graph, NextAuth, UploadThing a SMTP (bez zobrazenia tajomstiev).",
};

export default function AdminIntegrationsPage() {
	return (
		<div className="space-y-10 pb-12">
			<AdminPageHeader
				title="Integrácie a platformy"
				description="Overte premenné prostredia pre prihlásenie, úložisko súborov a e-mail. Hodnoty tajomstiev sa nikde nezobrazujú."
			/>
			<AdminIntegrationsPanel variant="full" />
		</div>
	);
}

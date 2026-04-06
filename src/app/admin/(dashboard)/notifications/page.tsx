import { AdminNotificationsPanel } from "@/components/admin/AdminNotificationsPanel";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";

export default function AdminNotificationsPage() {
	return (
		<div className="space-y-10 pb-12">
			<AdminPageHeader
				title="Notifikácie a udalosti"
				description="Prehľad dôležitých udalostí v aplikácii: nové knihy/autori/kategórie, požičania, vrátenia a objednávky."
			/>
			<AdminNotificationsPanel />
		</div>
	);
}

import { AdminOrdersPanel } from "@/components/admin/AdminOrdersPanel";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";

export default function AdminOrdersPage() {
	return (
		<div className="space-y-10 pb-12">
			<AdminPageHeader
				title="Objednávky kníh"
				description="Žiadosti čitateľov na prevzatie titulu v knižnici. Upravte stav po spracovaní."
			/>
			<AdminOrdersPanel />
		</div>
	);
}

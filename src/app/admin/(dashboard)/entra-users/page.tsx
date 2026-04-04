import { AdminEntraUsersPanel } from "@/components/admin/AdminEntraUsersPanel";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";

export default function AdminEntraUsersPage() {
	return (
		<div className="space-y-10 pb-12">
			<AdminPageHeader
				title="Používatelia Entra"
				description="Zoznam z Microsoft Entra ID cez Graph API. Vyžaduje oprávnenie User.Read.All a administrátorský súhlas v Azure."
			/>
			<AdminEntraUsersPanel />
		</div>
	);
}

import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminLoggedUsersPanel } from "@/components/admin/AdminLoggedUsersPanel";

export const metadata = {
	title: "Prihlásení používatelia | Admin Dashboard",
	description: "Zoznam používateľov, ktorí sa už do aplikácie prihlásili cez Entra ID.",
};

export default function AdminUsersPage() {
	return (
		<div className="space-y-10 pb-12">
			<AdminPageHeader
				title="Prihlásení používatelia"
				description="Zoznam používateľov z vašej databázy (tí, ktorí sa do knižnice aspoň raz prihlásili)."
			/>
			<AdminLoggedUsersPanel />
		</div>
	);
}

import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminLoggedUsersPanel } from "@/components/admin/AdminLoggedUsersPanel";

export const metadata = {
	title: "Bežní používatelia | Admin Dashboard",
	description: "Zoznam registrovaných používateľov bez administrátorských práv.",
};

export default function RegularUsersPage() {
	return (
		<div className="space-y-10 pb-12">
			<AdminPageHeader
				title="Bežní používatelia"
				description="Zoznam používateľov, ktorí majú štandardný prístup k službám knižnice."
			/>
			<AdminLoggedUsersPanel filter="regular" />
		</div>
	);
}

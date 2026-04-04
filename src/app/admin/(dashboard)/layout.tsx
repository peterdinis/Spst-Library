import { forbidden, redirect } from "next/navigation";

import { AdminShell } from "@/components/admin/AdminShell";
import { auth } from "@/auth";
import { userHasAdminAccess } from "@/lib/admin-access";

export default async function AdminDashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const session = await auth();

	if (!session?.user) {
		redirect("/admin/login");
	}

	if (!(await userHasAdminAccess(session))) {
		forbidden();
	}

	return <AdminShell>{children}</AdminShell>;
}

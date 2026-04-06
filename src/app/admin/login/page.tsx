import { auth } from "@/auth";
import { userHasAdminAccess } from "@/lib/admin-access";
import { redirect } from "next/navigation";
import { AdminLoginClient } from "./AdminLoginClient";

export default async function AdminLoginPage() {
	const session = await auth();
	if (session?.user) {
		if (await userHasAdminAccess(session)) {
			redirect("/admin");
		}
		redirect("/welcome");
	}

	return <AdminLoginClient />;
}

import { auth } from "@/auth";
import { userHasAdminAccess } from "@/lib/admin-access";
import DockNavbarClient from "./DockNavbarClient";

const Navbar = async () => {
	const session = await auth();
	const isLoggedIn = Boolean(session?.user);
	const hasAdminAccess = isLoggedIn ? await userHasAdminAccess(session) : false;

	return (
		<DockNavbarClient
			isLoggedIn={isLoggedIn}
			hasAdminAccess={hasAdminAccess}
			name={session?.user?.name}
			email={session?.user?.email}
		/>
	);
};

export default Navbar;
import { auth } from "@/auth";
import { userHasAdminAccess } from "@/lib/admin-access";
import TopNavbarClient from "./TopNavbarClient";

const Navbar = async () => {
	const session = await auth();
	const isLoggedIn = Boolean(session?.user);
	const hasAdminAccess = isLoggedIn ? await userHasAdminAccess(session) : false;

	return (
		<TopNavbarClient
			isLoggedIn={isLoggedIn}
			hasAdminAccess={hasAdminAccess}
			name={session?.user?.name}
			email={session?.user?.email}
		/>
	);
};

export default Navbar;
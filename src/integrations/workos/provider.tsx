import { AuthKitProvider, useUser } from "@workos-inc/authkit-react";
import { useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useMutation } from "convex/react";
import { api } from "convex/_generated/api";

const VITE_WORKOS_CLIENT_ID = import.meta.env.VITE_WORKOS_CLIENT_ID;
if (!VITE_WORKOS_CLIENT_ID) {
	throw new Error("Add your WorkOS Client ID to the .env.local file");
}

const VITE_WORKOS_API_HOSTNAME = import.meta.env.VITE_WORKOS_API_HOSTNAME;
if (!VITE_WORKOS_API_HOSTNAME) {
	throw new Error("Add your WorkOS API Hostname to the .env.local file");
}

function UserSync() {
	const { user: workosUser } = useUser();
	const createOrUpdateUser = useMutation(api.users.createOrUpdateFromWorkOS);

	useEffect(() => {
		if (workosUser) {
			// Automatically sync user to Convex when WorkOS user is available
			createOrUpdateUser({
				workosId: workosUser.id,
				email: workosUser.email,
				firstName: workosUser.firstName || workosUser.email.split("@")[0],
				lastName: workosUser.lastName || "",
				fullName:
					`${workosUser.firstName || ""} ${workosUser.lastName || ""}`.trim() ||
					workosUser.email,
				imageUrl: workosUser.profilePictureUrl,
				workosOrganizationId: workosUser.organizationId,
				workosConnectionId: workosUser.connectionId,
				workosProfile: workosUser.rawAttributes
					? {
							idpId: workosUser.rawAttributes.idp_id,
							firstName: workosUser.rawAttributes.first_name,
							lastName: workosUser.rawAttributes.last_name,
							email: workosUser.rawAttributes.email,
							username: workosUser.rawAttributes.username,
							rawAttributes: workosUser.rawAttributes,
						}
					: undefined,
			}).catch((error) => {
				console.error("Failed to sync user to Convex:", error);
			});
		}
	}, [workosUser, createOrUpdateUser]);

	return null;
}

export default function AppWorkOSProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	const navigate = useNavigate();

	return (
		<AuthKitProvider
			clientId={VITE_WORKOS_CLIENT_ID}
			apiHostname={VITE_WORKOS_API_HOSTNAME}
			onRedirectCallback={({ state }) => {
				if (state?.returnTo) {
					navigate(state.returnTo);
				}
			}}
		>
			<UserSync />
			{children}
		</AuthKitProvider>
	);
}

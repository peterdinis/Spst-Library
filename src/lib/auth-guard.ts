import { redirect } from "@tanstack/react-router";

/**
 * Centralized auth guard for TanStack Router's beforeLoad.
 * Ensures the user has an auth token in localStorage.
 */
export const authGuard = ({ location }: { location: { pathname: string } }) => {
	// Check if we're on the client side
	if (typeof window === "undefined") {
		return;
	}

	const token = localStorage.getItem("auth_token");

	if (!token) {
		throw redirect({
			to: "/login",
			search: {
				redirect: location.pathname,
			},
		});
	}
};

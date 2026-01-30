import ProfileWrapper from "@/components/auth/ProfileWrapper";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/profile/")({
	beforeLoad: ({ location }) => {
		// Check if user is authenticated (only on client side)
		if (typeof window === "undefined") {
			// Skip auth check on server
			return;
		}

		const token = localStorage.getItem("auth_token");
		if (!token) {
			// Redirect to login with return path
			throw redirect({
				to: "/login",
				search: {
					redirect: location.pathname,
				},
			});
		}
	},
	component: ProfileWrapper,
});

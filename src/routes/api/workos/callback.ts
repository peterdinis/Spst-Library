import { createFileRoute } from "@tanstack/react-router";
import { httpAction } from "convex/server";
import { api } from "convex/_generated/api";

export const Route = createFileRoute("/api/workos/callback")({
	server: {
		handlers: {
			POST: async ({ request }) => {
				try {
					const body = await request.json();

					// WorkOS sends user data after authentication
					// This endpoint is called by WorkOS after successful authentication
					const {
						user: {
							id: workosId,
							email,
							firstName,
							lastName,
							profilePictureUrl,
							organizationId,
							connectionId,
							rawAttributes,
						},
					} = body;

					// Validate required fields
					if (!workosId || !email) {
						return new Response(
							JSON.stringify({ error: "Missing required fields" }),
							{
								status: 400,
								headers: { "Content-Type": "application/json" },
							},
						);
					}

					// Create or update user in Convex
					// Note: This would need to be called from a Convex action
					// For now, we'll return the user data and handle it client-side
					const userData = {
						workosId,
						email,
						firstName: firstName || email.split("@")[0],
						lastName: lastName || "",
						fullName: `${firstName || ""} ${lastName || ""}`.trim() || email,
						imageUrl: profilePictureUrl,
						workosOrganizationId: organizationId,
						workosConnectionId: connectionId,
						workosProfile: rawAttributes
							? {
									idpId: rawAttributes.idp_id,
									firstName: rawAttributes.first_name,
									lastName: rawAttributes.last_name,
									email: rawAttributes.email,
									username: rawAttributes.username,
									rawAttributes,
								}
							: undefined,
					};

					return new Response(JSON.stringify({ success: true, user: userData }), {
						status: 200,
						headers: { "Content-Type": "application/json" },
					});
				} catch (error) {
					console.error("WorkOS callback error:", error);
					return new Response(
						JSON.stringify({ error: "Internal server error" }),
						{
							status: 500,
							headers: { "Content-Type": "application/json" },
						},
					);
				}
			},
		},
	},
});

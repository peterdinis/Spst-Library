import ProfileWrapper from "@/components/auth/ProfileWrapper";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/profile/")({
	component: ProfileWrapper,
});

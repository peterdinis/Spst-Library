import ProfileWrapper from "@/components/auth/ProfileWrapper";
import { createFileRoute } from "@tanstack/react-router";
import { authGuard } from "@/lib/auth-guard";

export const Route = createFileRoute("/profile/")({
	beforeLoad: authGuard,
	component: ProfileWrapper,
});

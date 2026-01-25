import DashboardSkeleton from "@/components/shared/DashboardSkeleton";
import { NotFoundComponent } from "@/components/shared/NotFoundComponent";
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/profile")({
	component: ProfileLayout,
	pendingComponent: DashboardSkeleton,
	notFoundComponent: () => (
		<NotFoundComponent message="Nepodarilo sa načítať profil používateľa" />
	),
});

function ProfileLayout() {
	return <Outlet />;
}

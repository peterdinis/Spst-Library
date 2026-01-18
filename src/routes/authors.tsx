import DashboardSkeleton from "@/components/shared/DashboardSkeleton";
import { NotFoundComponent } from "@/components/shared/NotFoundComponent";
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/authors")({
	component: AuthorsLayout,
	pendingComponent: DashboardSkeleton,
	notFoundComponent: () => (
		<NotFoundComponent message="Stránka so spisovateľmi nebola nájdená" />
	),
});

function AuthorsLayout() {
	return <Outlet />;
}

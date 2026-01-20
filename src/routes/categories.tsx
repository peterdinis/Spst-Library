import DashboardSkeleton from "@/components/shared/DashboardSkeleton";
import { NotFoundComponent } from "@/components/shared/NotFoundComponent";
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/categories")({
	component: CategoriesLayout,
	pendingComponent: DashboardSkeleton,
	notFoundComponent: () => (
		<NotFoundComponent message="Stránka s kategóriami nebola nájdená" />
	),
});

function CategoriesLayout() {
	return <Outlet />;
}

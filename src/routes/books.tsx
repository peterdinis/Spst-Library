import DashboardSkeleton from "@/components/shared/DashboardSkeleton";
import { NotFoundComponent } from "@/components/shared/NotFoundComponent";
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/books")({
	component: BooksLayout,
	pendingComponent: DashboardSkeleton,
	notFoundComponent: () => (
		<NotFoundComponent message="Stránka s knihami nebola nájdená" />
	),
});

function BooksLayout() {
	return <Outlet />;
}

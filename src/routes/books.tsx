import DashboardSkeleton from "@/components/shared/DashboardSkeleton";
import { ErrorComponent } from "@/components/shared/ErrorComponent";
import { NotFoundComponent } from "@/components/shared/NotFoundComponent";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/books")({
	component: App,
	pendingComponent: () => <DashboardSkeleton />,
	errorComponent: () => {
		return <ErrorComponent error={"Nepodarilo sa načítať hlavnú stránku"} />;
	},
	notFoundComponent: () => {
		return <NotFoundComponent message="Táto stránka neexistuje" />;
	},
	preload: true,
});

function App() {
	return <>BOOKS</>;
}

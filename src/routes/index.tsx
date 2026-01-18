import Hero from "@/components/home/Hero";
import Services from "@/components/home/Services";
import DashboardSkeleton from "@/components/shared/DashboardSkeleton";
import { ErrorComponent } from "@/components/shared/ErrorComponent";
import Footer from "@/components/shared/Footer";
import { NotFoundComponent } from "@/components/shared/NotFoundComponent";
import { createFileRoute} from "@tanstack/react-router";

export const Route = createFileRoute("/")({
	component: App,
	pendingComponent: () => <DashboardSkeleton />,
	errorComponent: () => {
		return <ErrorComponent error={"Nepodarilo sa načítať hlavnú stránku"} />;
	},
	notFoundComponent: () => {
		return <NotFoundComponent message="Táto stránka neexistuje" />;
	},
});

function App() {
	return (
		<>
			<Hero />
			<Services />
			<Footer />
		</>
	);
}

import Hero from "@/components/home/Hero";
import BookLoader from "@/components/shared/BookLoader";
import DashboardSkeleton from "@/components/shared/DashboardSkeleton";
import { ErrorComponent } from "@/components/shared/ErrorComponent";
import { NotFoundComponent } from "@/components/shared/NotFoundComponent";
import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense } from "react";

const Services = lazy(() => import("@/components/home/Services"));
const Footer = lazy(() => import("@/components/shared/Footer"));

export const Route = createFileRoute("/")({
	component: App,
	pendingComponent: () => <DashboardSkeleton />,
	errorComponent: () => {
		return <ErrorComponent error={"Nepodarilo sa načítať hlavnú stránku"} />;
	},
	notFoundComponent: () => {
		return <NotFoundComponent message="Táto stránka neexistuje" />;
	},
	ssr: false
});

function App() {
	return (
		<>
			<Hero />
			<Suspense fallback={<BookLoader />}>
				<Services />
				<Footer />
			</Suspense>
		</>
	);
}

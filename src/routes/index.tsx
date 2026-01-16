import DashboardSkeleton from '@/components/shared/DashboardSkeleton';
import { NotFoundComponent } from '@/components/shared/NotFoundComponent';
import { createFileRoute, ErrorComponent } from '@tanstack/react-router'

export const Route = createFileRoute("/")({
	component: App,
	pendingComponent: () => <DashboardSkeleton />,
	errorComponent: () => {
		return <ErrorComponent error={"Nepodarilo sa načítať hlavnú stránku"} />;
	},
	notFoundComponent: () => {
		return <NotFoundComponent message="Táto stránka neexistuje" />;
	},
	loader: async () => {
		await new Promise((resolve) => setTimeout(resolve, 1000));
		return {};
	},
});

function App() {

  return (
    <>
      HI
    </>
  )
}

import Hero from '@/components/home/Hero';
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
  preload: true
});

function App() {

  return (
    <>
      <Hero />
    </>
  )
}

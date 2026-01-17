import Hero from '@/components/home/Hero';
import Services from '@/components/home/Services';
import DashboardSkeleton from '@/components/shared/DashboardSkeleton';
import { ErrorComponent } from '@/components/shared/ErrorComponent';
import Footer from '@/components/shared/Footer';
import { NotFoundComponent } from '@/components/shared/NotFoundComponent';
import { createFileRoute, useRouter } from '@tanstack/react-router'
import { useEffect } from 'react';

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
  const router = useRouter();
  
  // Preload other important routes
  useEffect(() => {
    const preloadRoutes = async () => {
      try {
        // Preload často používané trasy
        await Promise.all([
          router.preloadRoute({ to: '/books' }),
          router.preloadRoute({ to: '/categories' }),
          router.preloadRoute({ to: '/authors' }),
          router.preloadRoute({ to: '/login' }),
          router.preloadRoute({ to: '/register' }),
        ]);
      } catch (error) {
        console.log('Preload failed:', error);
      }
    };
    
    preloadRoutes();
  }, [router]);

  return (
    <>
      <Hero />
      <Services />
      <Footer />
    </>
  )
}
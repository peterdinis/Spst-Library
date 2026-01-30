import NewAuthorPage from "@/components/authors/CreateNewAuthor";
import { createFileRoute } from "@tanstack/react-router";
import { authGuard } from "@/lib/auth-guard";

export const Route = createFileRoute("/authors/create")({
	beforeLoad: authGuard,
	component: RouteComponent,
});

function RouteComponent() {
	return <NewAuthorPage />;
}

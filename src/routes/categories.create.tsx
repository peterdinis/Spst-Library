import CreateCategoryForm from "@/components/categories/CreateCategoryForm";
import { createFileRoute } from "@tanstack/react-router";
import { authGuard } from "@/lib/auth-guard";

export const Route = createFileRoute("/categories/create")({
	beforeLoad: authGuard,
	component: RouteComponent,
});

function RouteComponent() {
	return <CreateCategoryForm />;
}

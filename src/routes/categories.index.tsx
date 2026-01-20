import AllCategoriesWrapper from "@/components/categories/AllCategoriesWrapper";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/categories/")({
	component: AllCategoriesWrapper,
});

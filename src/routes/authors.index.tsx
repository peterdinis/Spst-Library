import { AllAuthorsWrapper } from "@/components/authors/AuthorsWrapper";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/authors/")({
	component: AllAuthorsWrapper,
});

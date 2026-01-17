import AllBooksWrapper from "@/components/books/AllBooksWrapper";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/books/")({
	component: AllBooksWrapper,
});

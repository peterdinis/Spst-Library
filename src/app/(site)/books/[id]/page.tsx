import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { BookDetailsClient } from "@/components/BookDetailsClient";
import { getBookById } from "@/lib/data";
import { userHasAdminAccess } from "@/lib/admin-access";

export default async function BookDetailsPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;

	const row = await getBookById(id);

	if (!row) {
		notFound();
	}

	const book = {
		id: row.id,
		title: row.title,
		description: row.description,
		coverUrl: row.coverUrl,
		isbn: row.isbn,
		availableCopies: row.availableCopies,
		author: row.author?.name ?? null,
		authorId: row.authorId,
		category: row.category?.name ?? null,
	};

	const session = await auth();
	const isPatron =
		Boolean(session?.user) && !(await userHasAdminAccess(session));

	return (
		<BookDetailsClient
			book={book}
			user={session?.user ?? null}
			isPatron={isPatron}
		/>
	);
}

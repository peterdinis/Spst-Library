import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { BookDetailsClient } from "@/components/BookDetailsClient";
import { getBookById, isBookBorrowedByUser } from "@/lib/data";

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
	const userId = session?.user?.id;

	const isAlreadyBorrowed =
		userId ? await isBookBorrowedByUser(userId, id) : false;

	return (
		<BookDetailsClient
			book={book}
			user={session?.user ?? null}
			isAlreadyBorrowed={!!isAlreadyBorrowed}
		/>
	);
}

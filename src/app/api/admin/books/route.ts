import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { userHasAdminAccess } from "@/lib/admin-access";
import { db } from "@/db";
import { books } from "@/db/schema";
import { revalidatePath } from "next/cache";

export async function POST(req: NextRequest) {
	const session = await auth();
	if (!session?.user) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}
	if (!(await userHasAdminAccess(session))) {
		return NextResponse.json({ error: "Forbidden" }, { status: 403 });
	}

	try {
		const formData = await req.formData();
		const title = formData.get("title") as string;
		const description = formData.get("description") as string;
		const isbn = formData.get("isbn") as string;
		const availableCopies =
			parseInt(formData.get("availableCopies") as string, 10) || 1;
		const authorId = formData.get("authorId") as string;
		const categoryId = formData.get("categoryId") as string;
		const coverUrl = formData.get("coverUrl") as string;

		if (!title || !authorId || !categoryId || !coverUrl) {
			return NextResponse.json(
				{ error: "Missing required fields" },
				{ status: 400 },
			);
		}

		const id = crypto.randomUUID();

		await db.insert(books).values({
			id,
			title,
			description,
			isbn,
			availableCopies,
			authorId,
			categoryId,
			coverUrl,
		});

		revalidatePath("/");
		revalidatePath("/admin/books");

		// Redirect back to admin page
		return NextResponse.redirect(new URL("/admin/books", req.url), 303);
	} catch (error: any) {
		console.error("Book creation failed", error);
		return NextResponse.json({ error: error.message }, { status: 500 });
	}
}

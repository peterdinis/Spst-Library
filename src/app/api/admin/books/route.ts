import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/db";
import { books } from "@/db/schema";
import { uploadImageToAzure } from "@/lib/azure-storage";
import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const isbn = formData.get("isbn") as string;
    const availableCopies = parseInt(formData.get("availableCopies") as string, 10) || 1;
    const authorId = formData.get("authorId") as string;
    const categoryId = formData.get("categoryId") as string;
    const coverFile = formData.get("cover") as File;

    if (!title || !authorId || !categoryId || !coverFile) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const coverUrl = await uploadImageToAzure(coverFile);
    const id = crypto.randomUUID();

    db.insert(books).values({
      id,
      title,
      description,
      isbn,
      availableCopies,
      authorId,
      categoryId,
      coverUrl,
    }).run();

    revalidatePath("/");
    revalidatePath("/admin/books");

    // Redirect back to admin page
    return NextResponse.redirect(new URL("/admin/books", req.url), 303);
  } catch (error: any) {
    console.error("Book creation failed", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

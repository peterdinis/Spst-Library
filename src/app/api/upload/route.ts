import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { uploadImageToAzure } from "@/lib/azure-storage";

export async function POST(req: NextRequest) {
	const session = await auth();
	const allowWithoutAuth =
		process.env.ALLOW_ADMIN_UPLOAD_WITHOUT_AUTH === "true" ||
		process.env.NODE_ENV !== "production";

	if (!allowWithoutAuth && !session?.user) {
		return new NextResponse("Unauthorized", { status: 401 });
	}

	try {
		const formData = await req.formData();
		const file = formData.get("filepond") as File;

		if (!file) {
			return new NextResponse("No file provided", { status: 400 });
		}

		const folderRaw = formData.get("folder");
		const folder =
			typeof folderRaw === "string" &&
			(folderRaw === "authors" || folderRaw === "books")
				? folderRaw
				: "books";

		const url = await uploadImageToAzure(file, { prefix: folder });
		return NextResponse.json({ url });
	} catch (error: unknown) {
		console.error("Upload failed", error);
		const message =
			error instanceof Error ? error.message : "Internal Server Error";
		return new NextResponse(message, { status: 500 });
	}
}

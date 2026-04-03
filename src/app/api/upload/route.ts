import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { uploadImageToAzure } from "@/lib/azure-storage";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("filepond") as File;

    if (!file) {
      return new NextResponse("No file provided", { status: 400 });
    }

    const url = await uploadImageToAzure(file);
    return NextResponse.json({ url });
  } catch (error: any) {
    console.error("Upload failed", error);
    return new NextResponse(error.message || "Internal Server Error", { status: 500 });
  }
}

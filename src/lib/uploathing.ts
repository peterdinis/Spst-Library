import { OurFileRouter } from "@/routes/api/uploadthing/route";
import {
	generateUploadButton,
	generateUploadDropzone,
	generateReactHelpers,
} from "@uploadthing/react";

export const UploadButton = generateUploadButton<OurFileRouter>();
export const UploadDropzone = generateUploadDropzone<OurFileRouter>();

export const { useUploadThing, uploadFiles } =
	generateReactHelpers<OurFileRouter>();

// Specific upload function for author images
export const uploadAuthorImage = async (file: File) => {
	const formData = new FormData();
	formData.append("files", file);

	try {
		const response = await fetch("/api/uploadthing/author", {
			method: "POST",
			body: formData,
		});

		if (!response.ok) {
			throw new Error("Upload failed");
		}

		const result = await response.json();
		return result;
	} catch (error) {
		console.error("Upload error:", error);
		throw error;
	}
};

import { createRouteHandler } from "uploadthing/server";
import { uploadRouter } from "@/server/uploadthing";

// Create the UploadThing route handler
const handlers = createRouteHandler({
	router: uploadRouter,
	config: {
		token: process.env.UPLOADTHING_TOKEN,
	},
});

// Export handlers that can be used by the server
export async function GET(request: Request) {
	return handlers(request);
}

export async function POST(request: Request) {
	return handlers(request);
}

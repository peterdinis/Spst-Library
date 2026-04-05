import { router, publicProcedure } from "../server";
import { authorsRouter } from "./authors";
import { categoriesRouter } from "./categories";
import { booksRouter } from "./books";
import { notificationsRouter } from "./notifications";
import { settingsRouter } from "./settings";
import { ordersRouter } from "./orders";
import { entraRouter } from "./entra";
import { usersRouter } from "./users";
import { adminWhitelistRouter } from "./adminWhitelist";
import { uploadRouter } from "./upload";

export const appRouter = router({
	healthInfo: publicProcedure.query(() => {
		return { status: "ok" };
	}),
	authors: authorsRouter,
	categories: categoriesRouter,
	books: booksRouter,
	notifications: notificationsRouter,
	settings: settingsRouter,
	orders: ordersRouter,
	entra: entraRouter,
	users: usersRouter,
	adminWhitelist: adminWhitelistRouter,
	upload: uploadRouter,
});

export type AppRouter = typeof appRouter;

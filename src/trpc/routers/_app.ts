import { publicProcedure, router } from "../server";
import { adminWhitelistRouter } from "./adminWhitelist";
import { authorsRouter } from "./authors";
import { booksRouter } from "./books";
import { categoriesRouter } from "./categories";
import { entraRouter } from "./entra";
import { integrationsRouter } from "./integrations";
import { notificationsRouter } from "./notifications";
import { ordersRouter } from "./orders";
import { profileRouter } from "./profile";
import { settingsRouter } from "./settings";
import { usersRouter } from "./users";

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
	profile: profileRouter,
	integrations: integrationsRouter,
});

export type AppRouter = typeof appRouter;

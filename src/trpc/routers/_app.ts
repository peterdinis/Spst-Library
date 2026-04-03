import { router, publicProcedure } from '../server';
import { authorsRouter } from './authors';
import { categoriesRouter } from './categories';
import { booksRouter } from './books';
import { notificationsRouter } from './notifications';
import { settingsRouter } from './settings';
import { ordersRouter } from './orders';
import { entraRouter } from './entra';

export const appRouter = router({
  healthInfo: publicProcedure.query(() => {
    return { status: 'ok' };
  }),
  authors: authorsRouter,
  categories: categoriesRouter,
  books: booksRouter,
  notifications: notificationsRouter,
  settings: settingsRouter,
  orders: ordersRouter,
  entra: entraRouter,
});

export type AppRouter = typeof appRouter;

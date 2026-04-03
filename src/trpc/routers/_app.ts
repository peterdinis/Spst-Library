import { router, publicProcedure } from '../server';
import { authorsRouter } from './authors';
import { categoriesRouter } from './categories';
import { booksRouter } from './books';
import { notificationsRouter } from './notifications';
import { settingsRouter } from './settings';

export const appRouter = router({
  healthInfo: publicProcedure.query(() => {
    return { status: 'ok' };
  }),
  authors: authorsRouter,
  categories: categoriesRouter,
  books: booksRouter,
  notifications: notificationsRouter,
  settings: settingsRouter,
});

export type AppRouter = typeof appRouter;

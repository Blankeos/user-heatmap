import { createTRPCRouter } from './trpcContext';

import { visitsRouter } from './routers/visits.router';

export const appRouter = createTRPCRouter({
	visits: visitsRouter
});

export type AppRouter = typeof appRouter;

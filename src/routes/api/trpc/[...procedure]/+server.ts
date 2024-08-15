import { appRouter } from '$server/appRouter';
import { createSvelteKitTRPCContext } from '$server/trpcContext';
import type { RequestHandler } from '@sveltejs/kit';
import { fetchRequestHandler } from '@trpc/server/adapters/fetch';

const handler = ((event) =>
	fetchRequestHandler({
		req: event.request,
		router: appRouter,
		endpoint: '/api/trpc',
		createContext: createSvelteKitTRPCContext(event.locals),
		onError: (e) => {
			console.error(`❌ tRPC GET failed on ${e.path ?? '<no-path>'}: ${e.error.message}`, e);
		}
	})) satisfies RequestHandler;

export { handler as GET, handler as POST };

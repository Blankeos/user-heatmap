import type { AppRouter } from '$server/appRouter';
import { createTRPCProxyClient, getFetch, httpBatchLink } from '@trpc/client';
import superJSON from 'superjson';

type FetchEsque = ReturnType<typeof getFetch>;

export const trpc = createTRPCProxyClient<AppRouter>({
	transformer: superJSON,
	links: [httpBatchLink({ url: '/api/trpc' })]
});

export const trpcServer = (fetch: FetchEsque) =>
	createTRPCProxyClient<AppRouter>({
		transformer: superJSON,
		links: [httpBatchLink({ fetch, url: '/api/trpc' })]
	});

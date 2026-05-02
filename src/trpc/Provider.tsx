"use client";

import { QueryClient, QueryClientProvider, QueryCache, MutationCache } from "@tanstack/react-query";
import { httpBatchLink, TRPCClientError } from "@trpc/client";
import { useState } from "react";
import { trpc } from "./client";

export function TRPCProvider({ children }: { children: React.ReactNode }) {
	const [queryClient] = useState(
		() =>
			new QueryClient({
				queryCache: new QueryCache({
					onError: (error) => {
						if (error instanceof TRPCClientError && error.data?.code === "TOO_MANY_REQUESTS") {
							if (typeof window !== "undefined") {
								window.dispatchEvent(new Event("rate-limit-exceeded"));
							}
						}
					},
				}),
				mutationCache: new MutationCache({
					onError: (error) => {
						if (error instanceof TRPCClientError && error.data?.code === "TOO_MANY_REQUESTS") {
							if (typeof window !== "undefined") {
								window.dispatchEvent(new Event("rate-limit-exceeded"));
							}
						}
					},
				}),
				defaultOptions: {
					queries: {
						refetchOnWindowFocus: false,
						staleTime: 60 * 1000,
						gcTime: 5 * 60 * 1000,
					},
				},
			}),
	);

	const [trpcClient] = useState(() =>
		trpc.createClient({
			links: [
				httpBatchLink({
					url: "/api/trpc",
				}),
			],
		}),
	);

	return (
		<trpc.Provider client={trpcClient} queryClient={queryClient}>
			<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
		</trpc.Provider>
	);
}

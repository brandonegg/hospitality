import { createTRPCProxyClient, httpLink } from "@trpc/client";
import { createTRPCMsw } from "msw-trpc";
import superjson from "superjson";

import type { AppRouter } from "../../src/server/api/root";

export const trpcMsw = createTRPCMsw<AppRouter>({
  transformer: { input: superjson, output: superjson },
});

export const trpc = createTRPCProxyClient<AppRouter>({
  transformer: superjson,
  links: [
    httpLink({
      url: "http://localhost:3000/api/trpc",
      headers() {
        return {
          "content-type": "application/json",
        };
      },
    }),
  ],
});

import { bedRouter } from "./routers/bed";
import { exampleRouter } from "./routers/example";
import { getAppointRouter } from "./routers/getAppoint";
import { hoursRouter } from "./routers/hours";
import { invoiceRouter } from "./routers/invoice";
import { removeAppointRouter } from "./routers/myAppoint";
import { rateRouter } from "./routers/rate";
import { storeAvailRouter } from "./routers/storeAvail";
import { userRouter } from "./routers/user";
import { createTRPCRouter } from "./trpc";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here
 */
export const appRouter = createTRPCRouter({
  example: exampleRouter,
  user: userRouter,
  bed: bedRouter,
  rate: rateRouter,
  invoice: invoiceRouter,
  storeAvail: storeAvailRouter,
  getAppoint: getAppointRouter,
  myAppoint: removeAppointRouter,
  hours: hoursRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

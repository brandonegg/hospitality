import { testRouter } from "./routers/admin-test";
import { bedRouter } from "./routers/bed";
import { exampleRouter } from "./routers/example";
import { getAppointRouter } from "./routers/getAppoint";
import { hoursRouter } from "./routers/hours";
import { invoiceRouter } from "./routers/invoice";
import { labTestRouter } from "./routers/lab-test";
import { medsRouter } from "./routers/meds";
import { removeAppointRouter } from "./routers/myAppoint";
import { paymentRouter } from "./routers/payment";
import { prescribeRouter } from "./routers/prescribe";
import { rateRouter } from "./routers/rate";
import { storeAvailRouter } from "./routers/storeAvail";
import { userRouter } from "./routers/user";
import { visitReportRouter } from "./routers/visitReport";
import { vitalsRouter } from "./routers/vitals";
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
  meds: medsRouter,
  invoice: invoiceRouter,
  prescribe: prescribeRouter,
  storeAvail: storeAvailRouter,
  getAppoint: getAppointRouter,
  myAppoint: removeAppointRouter,
  hours: hoursRouter,
  payment: paymentRouter,
  visitReport: visitReportRouter,
  vitals: vitalsRouter,
  test: testRouter,
  labTest: labTestRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

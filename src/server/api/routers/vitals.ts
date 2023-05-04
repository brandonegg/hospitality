import type { VitalsReport } from "@prisma/client";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const vitalsRouter = createTRPCRouter({
  getMostRecent: protectedProcedure.query(async ({ ctx }) => {
    //   const recents = await ctx.prisma.vitalsReport.findMany({
    //     where: { patientId: input.userId },
    //     orderBy: { date: "desc" },
    //     take: 1,
    //   });
    const recents: VitalsReport[] | undefined = await ctx.prisma.$queryRaw`
															SELECT * FROM VitalsReport
															WHERE patientId = ${ctx.session.user.id}
															ORDER BY date DESC
															LIMIT 1;`;

    if (!recents) {
      return;
    }

    return recents[0];
  }),
});

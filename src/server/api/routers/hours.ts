import { createId } from "@paralleldrive/cuid2";
import type { Hours } from "@prisma/client";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "../trpc";

export const hoursRouter = createTRPCRouter({
  setHours: publicProcedure
    .input(
      z.object({
        startHour: z.number(),
        endHour: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const databaseResponse: Hours[] = await ctx.prisma.$queryRawUnsafe(
        `SELECT * FROM Hours`
      );
      if (databaseResponse.length == 0) {
        // if there is no hours in the database set it to the default
        await ctx.prisma.$executeRawUnsafe(
          `INSERT INTO Hours (id, startHour, endHour) VALUES ("${createId()}", 14, 38);`
        );
      }
      const result: Hours[] = await ctx.prisma.$queryRawUnsafe(
        `SELECT * FROM Hours`
      );
      const hourSetting = result[0] as Hours;
      const insertId = hourSetting.id;
      await ctx.prisma.$executeRawUnsafe(
        `UPDATE Hours SET startHour=${input.startHour}, endHour=${input.endHour} WHERE id="${insertId}"`
      );

      return result;
    }),
  getHours: publicProcedure.query(async ({ ctx }) => {
    const databaseResponse: Hours[] = await ctx.prisma.$queryRawUnsafe(
      `SELECT * FROM Hours`
    );
    if (databaseResponse.length == 0) {
      // if there is no hours in the database set it to the default
      await ctx.prisma.$executeRawUnsafe(
        `INSERT INTO Hours (id, startHour, endHour) VALUES ("${createId()}", 14, 38);`
      );
    } else {
      return databaseResponse[0];
    }
    const result: Hours[] = await ctx.prisma.$queryRawUnsafe(
      `SELECT * FROM Hours`
    );
    return result[0];
  }),
});

import { describe, expect, test } from "@jest/globals";
import type { Address, Availability, OriginalAvailability, PrismaClient, User } from "@prisma/client";
import { type inferProcedureInput, TRPCError } from "@trpc/server";
import { mockDeep } from "jest-mock-extended";

import { appRouter, type AppRouter } from "../../src/server/api/root";
import type { RouterOutputs } from "../../src/utils/api";

const mockAvailabilty: Availability | OriginalAvailability | null = {
  id: "test-id",
  day: 1,
  startTime: "9:00 am",
  endTime: "9:30 am",
  docId: "test-doc-id",
  date: new Date(),
};

const emptyAvail : Availability | OriginalAvailability | null = null;

describe("availability router", () => {
  test("store an availability in current week", async () => {
    // mock the prisma client db
    const prismaMock = mockDeep<PrismaClient>();

    const caller = appRouter.createCaller({
      session: null,
      prisma: prismaMock,
    });

    type Input = inferProcedureInput<AppRouter["storeAvail"]["storeAvails"]>;
    
    const input: Input = {  
      day: 1,
      startTime: "9:00 am",
      docId: "test-doc-id",
      weekCount: 0,
    };

    const mockOutput: RouterOutputs["storeAvail"]["storeAvails"] = {
      day: 1,
      startTime: "9:00 am",
      endTime: "9:30 am",
      docId: "test-doc-id",
      date: new Date()
    };

    prismaMock.availability.findFirst.mockResolvedValue(emptyAvail);
    prismaMock.availability.create.mockResolvedValue(mockOutput as Availability);

    const result = await caller.storeAvail.storeAvails(input);

    expect(result).toEqual(mockOutput);
  });

  test("store an availability in next week", async () => {
    // mock the prisma client db
    const prismaMock = mockDeep<PrismaClient>();

    const caller = appRouter.createCaller({
      session: null,
      prisma: prismaMock,
    });

    type Input = inferProcedureInput<AppRouter["storeAvail"]["storeAvails"]>;
    
    const input: Input = {  
      day: 1,
      startTime: "9:00 am",
      docId: "test-doc-id",
      weekCount: 1,
    };

    const today = new Date();
    today.setDate(today.getDate() + 7)

    const mockOutput: RouterOutputs["storeAvail"]["storeAvails"] = {
      day: 1,
      startTime: "9:00 am",
      endTime: "10:30 am",
      docId: "test-doc-id",
      date: today,
    };

    prismaMock.availability.findFirst.mockResolvedValue(emptyAvail);
    prismaMock.availability.create.mockResolvedValue(mockOutput as Availability);

    const result = await caller.storeAvail.storeAvails(input);
    console.log(result);
    console.log(mockOutput);
    expect(result).toMatchObject(mockOutput);
  });


});
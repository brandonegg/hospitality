import { describe, test } from "@jest/globals";
import type { Availability, PrismaClient } from "@prisma/client";
import { mockDeep } from "jest-mock-extended";

import { appRouter } from "../../src/server/api/root";

const mockAvail: Availability = {
  id: "test-id",
  day: 1,
  startTime: "9:30 am",
  endTime: "10:00 am",
  docId: 1,
};

const emptyAvail: Availability | null = null;

describe("availability", () => {
  test("no availability in database", () => {
    const prismaMock = mockDeep<PrismaClient>();

    const caller = appRouter.createCaller({
      session: null,
      prisma: prismaMock,
    });

    prismaMock.availability.findFirst.mockResolvedValue(emptyAvail);
  });

  test("user in database", () => {
    const prismaMock = mockDeep<PrismaClient>();

    const caller = appRouter.createCaller({
      session: null,
      prisma: prismaMock,
    });

    prismaMock.availability.findFirst.mockResolvedValue(mockAvail);
  });
});
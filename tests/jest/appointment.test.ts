import { describe, test } from "@jest/globals";
import type { Appointment, PrismaClient } from "@prisma/client";
import { mockDeep } from "jest-mock-extended";

import { appRouter } from "../../src/server/api/root";

const mockAppointment: Appointment = {
  id: "test-id",
  day: 1,
  startTime: "9:30 am",
  endTime: "10:00 am",
  docId: "test-doc-id",
  userName: "testUser2",
  date: new Date(),
};

const emptyAppoint: Appointment | null = null;

describe("appointment", () => {
  test("no appointment in database", () => {
    const prismaMock = mockDeep<PrismaClient>();

    const caller = appRouter.createCaller({
      session: null,
      prisma: prismaMock,
    });

    prismaMock.appointment.findFirst.mockResolvedValue(emptyAppoint);
  });

  test("user in database", () => {
    const prismaMock = mockDeep<PrismaClient>();

    const caller = appRouter.createCaller({
      session: null,
      prisma: prismaMock,
    });

    prismaMock.appointment.findFirst.mockResolvedValue(mockAppointment);
  });
});
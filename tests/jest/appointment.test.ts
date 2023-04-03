import { describe, test } from "@jest/globals";
import type { Appointment, PrismaClient } from "@prisma/client";
import { mockDeep } from "jest-mock-extended";

import { appRouter } from "../../src/server/api/root";
import { prisma } from "../../src/server/db";
import { api } from "../../src/utils/api";

const mockAppointment: Appointment = {
  id: "test-id",
  day: 1,
  startTime: "9:30 am",
  endTime: "10:00 am",
  docId: "test-doc-id",
  userId: "testUser2",
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

// describe("test making an appointment removing availability time", () => {
//   test("appointment made", () => {

    
//     const { mutate }= api.storeAvail.storeAvails.useMutation();
//     console.log(mutate({day: 1, startTime: "9:30 am", docId: "test-doc-id", weekCount:0}))

//   });
// });
import { describe, test } from "@jest/globals";
import type { Appointment, PrismaClient } from "@prisma/client";
import { mockDeep } from "jest-mock-extended";

import { storeTestHelper } from "../../src/pages/api/storeAppoint";
import { appRouter } from "../../src/server/api/root";
import { makeCorrectDate } from "../../src/server/api/routers/storeAvail";

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

describe("test making an appointment removing availability time", () => {
  test("does the appointment object that is removed match the avail that is created when docId is not all doc", () => {
    // startTime,day,docId,weekCount,userId
    const times:[string,number,string,number,string][] = [["9:30 am", 1, "test-doc-id", 0, "testUser2"]];
    const results = storeTestHelper(times);

    const newDay = makeCorrectDate(new Date((new Date()).toDateString()), 1, 0);

    const expectedOutput = {
      day:1, 
      startTime: "9:30 am",
      endTime: "10:00 am",
      docId: "test-doc-id",
      userId: "testUser2",
      date: newDay, // later get the correct date
    };
    expect((results as object[])[0]).toEqual(expectedOutput);
  });
  test("does the appointment object that is removed match the avail that is created when docId is all doc", () => {
    // startTime,day,docId,weekCount,userId
    const times:[string,number,string,number,string][] = [["9:30 am", 1, "AllDoctors", 0, "testUser2"]];
    const results = storeTestHelper(times, "actualDoctorIdNotAllDoctors");

    const newDay = makeCorrectDate(new Date((new Date()).toDateString()), 1, 0);

    const expectedOutput = {
      day:1, 
      startTime: "9:30 am",
      endTime: "10:00 am",
      docId: "actualDoctorIdNotAllDoctors",
      userId: "testUser2",
      date: newDay, // later get the correct date
    };
    expect((results as object[])[0]).toEqual(expectedOutput);
  });
  test("new startTime", () => {
    // startTime,day,docId,weekCount,userId
    const times:[string,number,string,number,string][] = [["10:00 am", 1, "test-doc-id", 0, "testUser2"]];
    const results = storeTestHelper(times);

    const newDay = makeCorrectDate(new Date((new Date()).toDateString()), 1, 0);

    const expectedOutput = {
      day:1, 
      startTime: "10:00 am",
      endTime: "10:30 am",
      docId: "test-doc-id",
      userId: "testUser2",
      date: newDay, // later get the correct date
    };
    expect((results as object[])[0]).toEqual(expectedOutput);
  });
  test("new startTime", () => {
    // startTime,day,docId,weekCount,userId
    const times:[string,number,string,number,string][] = [["10:30 am", 1, "test-doc-id", 0, "testUser2"]];
    const results = storeTestHelper(times);

    const newDay = makeCorrectDate(new Date((new Date()).toDateString()), 1, 0);

    const expectedOutput = {
      day:1, 
      startTime: "10:30 am",
      endTime: "11:00 am",
      docId: "test-doc-id",
      userId: "testUser2",
      date: newDay, // later get the correct date
    };
    expect((results as object[])[0]).toEqual(expectedOutput);
  });
  test("new startTime", () => {
    // startTime,day,docId,weekCount,userId
    const times:[string,number,string,number,string][] = [["11:00 am", 1, "test-doc-id", 0, "testUser2"]];
    const results = storeTestHelper(times);

    const newDay = makeCorrectDate(new Date((new Date()).toDateString()), 1, 0);

    const expectedOutput = {
      day:1, 
      startTime: "11:00 am",
      endTime: "11:30 am",
      docId: "test-doc-id",
      userId: "testUser2",
      date: newDay, // later get the correct date
    };
    expect((results as object[])[0]).toEqual(expectedOutput);
  });
  test("new startTime am to pm", () => {
    // startTime,day,docId,weekCount,userId
    const times:[string,number,string,number,string][] = [["11:30 am", 1, "test-doc-id", 0, "testUser2"]];
    const results = storeTestHelper(times);

    const newDay = makeCorrectDate(new Date((new Date()).toDateString()), 1, 0);

    const expectedOutput = {
      day:1, 
      startTime: "11:30 am",
      endTime: "12:00 pm",
      docId: "test-doc-id",
      userId: "testUser2",
      date: newDay, // later get the correct date
    };
    expect((results as object[])[0]).toEqual(expectedOutput);
  });
  test("new startTime pm to am", () => {
    // startTime,day,docId,weekCount,userId
    const times:[string,number,string,number,string][] = [["11:30 pm", 1, "test-doc-id", 0, "testUser2"]];
    const results = storeTestHelper(times);

    const newDay = makeCorrectDate(new Date((new Date()).toDateString()), 1, 0);

    const expectedOutput = {
      day:1, 
      startTime: "11:30 pm",
      endTime: "12:00 am",
      docId: "test-doc-id",
      userId: "testUser2",
      date: newDay, // later get the correct date
    };
    expect((results as object[])[0]).toEqual(expectedOutput);
  });
  test("AllDoctors id doesn't save AllDoctors", () => {
    // startTime,day,docId,weekCount,userId
    const times:[string,number,string,number,string][] = [["11:30 pm", 1, "AllDoctors", 0, "testUser2"]];
    const results = storeTestHelper(times, "testDocId");

    const newDay = makeCorrectDate(new Date((new Date()).toDateString()), 1, 0);

    const expectedOutput = {
      day:1, 
      startTime: "11:30 pm",
      endTime: "12:00 am",
      docId: "AllDoctors",
      userId: "testUser2",
      date: newDay, // later get the correct date
    };
    expect((results as object[])[0]).not.toEqual(expectedOutput);
  });
});
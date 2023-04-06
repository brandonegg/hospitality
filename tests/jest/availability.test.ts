import { describe, expect, test } from "@jest/globals";
import type { Availability, OriginalAvailability, PrismaClient } from "@prisma/client";
import { type inferProcedureInput } from "@trpc/server";
import { mockDeep } from "jest-mock-extended";

import { appRouter, type AppRouter } from "../../src/server/api/root";
import { makeCorrectDate,makeEndTime,processInput } from "../../src/server/api/routers/storeAvail";
import type { RouterOutputs } from "../../src/utils/api";

const today = new Date();
today.setDate(today.getDate() - (today.getDay()-1));

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
      id: "randomId",
      day: 1,
      startTime: "9:00 am",
      endTime: "9:30 am",
      docId: "test-doc-id",
      date: new Date()
    };

    prismaMock.availability.findFirst.mockResolvedValue(emptyAvail);
    prismaMock.availability.create.mockResolvedValue(mockOutput );

    const result = await caller.storeAvail.storeAvails(input);

    expect(result).toStrictEqual(mockOutput);
  });
});

describe("makeEndTime", () => {
  test("basic end time 00 am", () => expect(makeEndTime("9:00 am")).toBe("9:30 am"));
  test("basic end time 30 am", () => expect(makeEndTime("9:30 am")).toBe("10:00 am"));
  test("basic end time 00 pm", () => expect(makeEndTime("9:00 pm")).toBe("9:30 pm"));
  test("basic end time 30 pm", () => expect(makeEndTime("9:30 pm")).toBe("10:00 pm"));
  test("am to pm", () => expect(makeEndTime("11:30 am")).toBe("12:00 pm"));
  test("pm to am", () => expect(makeEndTime("11:30 pm")).toBe("12:00 am"));
  test("end time 11:30 pm", () => expect(makeEndTime("11:30 pm")).toBe("12:00 am"));
  test("end time 12:00 am", () => expect(makeEndTime("12:00 am")).toBe("12:30 am"));
  test("end time 12:30 am", () => expect(makeEndTime("12:30 am")).toBe("1:00 am"));
  test("end time 12:00 pm", () => expect(makeEndTime("12:00 pm")).toBe("12:30 pm"));
  test("end time 12:30 pm", () => expect(makeEndTime("12:30 pm")).toBe("1:00 pm"));
  test("end time 7:30 am", () => expect(makeEndTime("7:30 am")).toBe("8:00 am"));
});

// https://www.convertunits.com/dates/daysfromdate/ to confirm date times
describe("makeCorrectDate", () => {
  describe("no week offset, no day offset", () =>{
    test("Monday, no week offset, no day offset", () => expect(makeCorrectDate(new Date("March 12, 2023"), 0,0).toDateString()).toStrictEqual(new Date("March 12, 2023").toDateString()));
    test("Tuesday, no week offset, no day offset", () => expect(makeCorrectDate(new Date("March 13, 2023"), 1,0).toDateString()).toStrictEqual(new Date("March 13, 2023").toDateString()));
    test("Wednesday, no week offset, no day offset", () => expect(makeCorrectDate(new Date("March 14, 2023"), 2,0).toDateString()).toStrictEqual(new Date("March 14, 2023").toDateString()));
    test("Thursday, no week offset, no day offset", () => expect(makeCorrectDate(new Date("March 15, 2023"), 3,0).toDateString()).toStrictEqual(new Date("March 15, 2023").toDateString()));
    test("Friday, no week offset, no day offset", () => expect(makeCorrectDate(new Date("March 16, 2023"), 4,0).toDateString()).toStrictEqual(new Date("March 16, 2023").toDateString()));
    test("Saturday, no week offset, no day offset", () => expect(makeCorrectDate(new Date("March 17, 2023"), 5,0).toDateString()).toStrictEqual(new Date("March 17, 2023").toDateString()));
    test("Sunday, no week offset, no day offset", () => expect(makeCorrectDate(new Date("March 18, 2023"), 6,0).toDateString()).toStrictEqual(new Date("March 18, 2023").toDateString()));
  });
  describe ("week offset, no day offset", () => {
    test("1 week offset, no day offset", () => expect(makeCorrectDate(new Date("March 17, 2023"), 5,1).toDateString()).toStrictEqual(new Date("March 24, 2023").toDateString()));
    test("2 week offset, no day offset", () => expect(makeCorrectDate(new Date("March 17, 2023"), 5,2).toDateString()).toStrictEqual(new Date("March 31, 2023").toDateString()));
    test("3 week offset, no day offset, new Month", () => expect(makeCorrectDate(new Date("March 17, 2023"), 5,3).toDateString()).toStrictEqual(new Date("April 7, 2023").toDateString()));
    test("-1 week offset, no day offset", () => expect(makeCorrectDate(new Date("March 17, 2023"), 5,-1).toDateString()).toStrictEqual(new Date("March 10, 2023").toDateString()));
    test("-2 week offset, no day offset", () => expect(makeCorrectDate(new Date("March 17, 2023"), 5,-2).toDateString()).toStrictEqual(new Date("March 3, 2023").toDateString()));
    test("-3 week offset, no day offset, new Month", () => expect(makeCorrectDate(new Date("March 17, 2023"), 5,-3).toDateString()).toStrictEqual(new Date("February 24, 2023").toDateString()));
  });
  describe("no week offset, day offset", () => {
    test("no week offset, 1 day offset", () => expect(makeCorrectDate(new Date("March 12, 2023"), 1,0).toDateString()).toStrictEqual(new Date("March 13, 2023").toDateString()));
    test("no week offset, 2 day offset", () => expect(makeCorrectDate(new Date("March 12, 2023"), 2,0).toDateString()).toStrictEqual(new Date("March 14, 2023").toDateString()));
    test("no week offset, 3 day offset", () => expect(makeCorrectDate(new Date("March 12, 2023"), 3,0).toDateString()).toStrictEqual(new Date("March 15, 2023").toDateString()));
    test("no week offset, 4 day offset", () => expect(makeCorrectDate(new Date("March 12, 2023"), 4,0).toDateString()).toStrictEqual(new Date("March 16, 2023").toDateString()));
    test("no week offset, 5 day offset", () => expect(makeCorrectDate(new Date("March 12, 2023"), 5,0).toDateString()).toStrictEqual(new Date("March 17, 2023").toDateString()));
    test("no week offset, 6 day offset", () => expect(makeCorrectDate(new Date("March 12, 2023"), 6,0).toDateString()).toStrictEqual(new Date("March 18, 2023").toDateString()));
  });
  describe("week offset, day offset", () => {
    test("1 week offset, 1 day offset", () => expect(makeCorrectDate(new Date("March 12, 2023"), 1,1).toDateString()).toStrictEqual(new Date("March 20, 2023").toDateString()));
    test("2 week offset, 2 day offset", () => expect(makeCorrectDate(new Date("March 12, 2023"), 2,2).toDateString()).toStrictEqual(new Date("March 28, 2023").toDateString()));
    test("3 week offset, 3 day offset, new Month", () => expect(makeCorrectDate(new Date("March 12, 2023"), 3,3).toDateString()).toStrictEqual(new Date("April 5, 2023").toDateString()));
    test("-1 week offset, 1 day offset", () => expect(makeCorrectDate(new Date("March 12, 2023"), 1,-1).toDateString()).toStrictEqual(new Date("March 6, 2023").toDateString()));
    test("-2 week offset, 2 day offset, new Month", () => expect(makeCorrectDate(new Date("March 12, 2023"), 2,-2).toDateString()).toStrictEqual(new Date("February 28, 2023").toDateString()));
    test("-3 week offset, 3 day offset, new Month", () => expect(makeCorrectDate(new Date("March 12, 2023"), 3,-3).toDateString()).toStrictEqual(new Date("February 22, 2023").toDateString()));
  });
  test("Leap year", () => expect(makeCorrectDate(new Date("March 14, 2024"), 4,-2).toDateString()).toStrictEqual(new Date("February 29, 2024").toDateString()));
});

describe("processInput", () => {
  test("Correct output", () => {    
    const input = {  
      day: 1,
      startTime: "9:00 am",
      docId: "test-doc-id",
      weekCount: 0,
    };
    const expectedOutput = {
      day: 1,
      startTime: "9:00 am",
      endTime: "9:30 am",
      docId: "test-doc-id",
      date: today.toDateString(),
    };
    const result = processInput(input);

    result.date = result.date.toDateString() as unknown as Date; // get rid of hours mins etc. for comparing
    expect(result).toStrictEqual(expectedOutput);
  });
  test("Incorrect output, wrong day", () => {    
    const input = {  
      day: 0,
      startTime: "9:00 am",
      docId: "test-doc-id",
      weekCount: 0,
    };
    const expectedOutput = {
      day: 1,
      startTime: "9:00 am",
      endTime: "9:30 pm",
      docId: "test-doc-id",
      date: today.toDateString(),
    };
    const result = processInput(input);

    result.date = result.date.toDateString() as unknown as Date; // get rid of hours mins etc. for comparing
    expect(result).not.toStrictEqual(expectedOutput);
  });
  test("Incorrect output, wrong am pm", () => {    
    const input = {  
      day: 1,
      startTime: "9:00 am",
      docId: "test-doc-id",
      weekCount: 0,
    };
    const expectedOutput = {
      day: 1,
      startTime: "9:00 am",
      endTime: "9:30 pm",
      docId: "test-doc-id",
      date: today.toDateString(),
    };
    const result = processInput(input);

    result.date = result.date.toDateString() as unknown as Date; // get rid of hours mins etc. for comparing
    expect(result).not.toStrictEqual(expectedOutput);

  });
  test("Incorrect output, wrong doctor id", () => {    
    const input = {  
      day: 1,
      startTime: "9:00 am",
      docId: "test-doc-id",
      weekCount: 0,
    };
    const expectedOutput = {
      day: 1,
      startTime: "9:00 am",
      endTime: "9:30 am",
      docId: "test-doc-id2",
      date: today.toDateString(),
    };
    const result = processInput(input);

    result.date = result.date.toDateString() as unknown as Date; // get rid of hours mins etc. for comparing
    expect(result).not.toStrictEqual(expectedOutput);
    
  });
  test("Incorrect output, wrong date", () => {    
    const input = {  
      day: 1,
      startTime: "9:00 am",
      docId: "test-doc-id",
      weekCount: 0,
    };
    const today2 = new Date(today.getTime());
    today2.setDate(today.getDate() + 1);
    const expectedOutput = {
      day: 1,
      startTime: "9:00 am",
      endTime: "9:30 am",
      docId: "test-doc-id2",
      date: today2.toDateString(),
    };
    const result = processInput(input);

    result.date = result.date.toDateString() as unknown as Date; // get rid of hours mins etc. for comparing
    expect(result).not.toStrictEqual(expectedOutput);
  });
  test("Incorrect output, wrong date", () => {    
    const input = {  
      day: 1,
      startTime: "9:00 am",
      docId: "test-doc-id",
      weekCount: 2,
    };
    const expectedOutput = {
      day: 1,
      startTime: "9:00 am",
      endTime: "9:30 am",
      docId: "test-doc-id2",
      date: today.toDateString(),
    };
    const result = processInput(input);

    result.date = result.date.toDateString() as unknown as Date; // get rid of hours mins etc. for comparing
    expect(result).not.toStrictEqual(expectedOutput);
  });
});

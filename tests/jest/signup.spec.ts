import { describe, expect, test } from "@jest/globals";
import { type inferProcedureInput } from "@trpc/server";

import { appRouter, type AppRouter } from "../../src/server/api/root";
// import { createInnerTRPCContext } from "../../src/server/api/trpc";
import { prisma } from "../../src/server/db";

describe("sign up router", () => {
  test("example router", async () => {
    const caller = appRouter.createCaller({ session: null, prisma: prisma });

    type Input = inferProcedureInput<AppRouter["example"]["hello"]>;
    const input: Input = {
      text: "test",
    };

    const result = await caller.example.hello(input);

    expect(result).toStrictEqual({ greeting: "Hello test" });
  });
});

import { describe, expect, test } from "@jest/globals";
import type { PrismaClient, User } from "@prisma/client";
import { type inferProcedureInput } from "@trpc/server";
import { mockDeep } from "jest-mock-extended";

import { appRouter, type AppRouter } from "../../src/server/api/root";
import type { RouterOutputs } from "../../src/utils/api";

describe("sign up router", () => {
  test("example router", async () => {
    // mock the prisma client db
    const prismaMock = mockDeep<PrismaClient>();

    const mockUser: User | null = null;

    const mockOutput: RouterOutputs["user"]["signup"] = {
      id: "test-id",
      name: "test user",
      email: "test-user@example.com",
      username: "test-username",
    };

    const caller = appRouter.createCaller({
      session: null,
      prisma: prismaMock,
    });

    type Input = inferProcedureInput<AppRouter["user"]["signup"]>;
    const input: Input = {
      firstName: "test",
      lastName: "user",
      dateOfBirth: "1990-01-01",
      username: "test-username",
      email: "test-user@example.com",
      password: "password",
      confirmPassword: "password",
    };

    prismaMock.user.findFirst.mockResolvedValue(mockUser);
    prismaMock.user.create.mockResolvedValue(mockOutput as User);

    const result = await caller.user.signup(input);

    expect(result).toBe(mockOutput);
  });
});

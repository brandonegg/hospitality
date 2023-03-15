import { describe, expect, test } from "@jest/globals";
import type { PrismaClient, User } from "@prisma/client";
import { type inferProcedureInput, TRPCError } from "@trpc/server";
import { mockDeep } from "jest-mock-extended";

import { appRouter, type AppRouter } from "../../src/server/api/root";
import type { RouterOutputs } from "../../src/utils/api";

const mockUser: User | null = {
  id: "test-id",
  name: "test user",
  addressId: "test-address-id",
  username: "test-username",
  email: "test-user@example.com",
  dateOfBirth: new Date("1990-01-01"),
  password: "password",
  phoneNumber: null,
  emailVerified: null,
  role: "PATIENT",
  image: null,
};

const emptyUser: User | null = null;

describe("forgot password", () => {
  test("rejects if user doesn't exists", async () => {
    // mock the prisma client db
    const prismaMock = mockDeep<PrismaClient>();

    const caller = appRouter.createCaller({
      session: null,
      prisma: prismaMock,
    });

    type Input = inferProcedureInput<AppRouter["user"]["forgotPassword"]>;
    const input: Input = {
      email: "test@test.com",
    };

    prismaMock.user.findFirst.mockResolvedValue(emptyUser);

    await expect(caller.user.forgotPassword(input)).rejects.toBeInstanceOf(
      TRPCError
    );
    await expect(caller.user.forgotPassword(input)).rejects.toThrow(
      new TRPCError({
        code: "BAD_REQUEST",
        message: "User with that email does not exist",
      })
    );
  });
});

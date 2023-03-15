import { describe, expect, test } from "@jest/globals";
import type { Address, PrismaClient, User } from "@prisma/client";
import { type inferProcedureInput, TRPCError } from "@trpc/server";
import { mockDeep } from "jest-mock-extended";
import * as jwt from "jsonwebtoken";

import { appRouter, type AppRouter } from "../../src/server/api/root";
import type { RouterOutputs } from "../../src/utils/api";

const resetToken = jwt.sign({ email: "test-user@example.com" }, "123456", {
  expiresIn: "5m",
});

const invalidToken = jwt.sign({}, "123456", {
  expiresIn: "5m",
});

describe("check reset token", () => {
  test("rejects if token doesn't exist", async () => {
    // mock the prisma client db
    const prismaMock = mockDeep<PrismaClient>();

    const caller = appRouter.createCaller({
      session: null,
      prisma: prismaMock,
    });

    type Input = inferProcedureInput<AppRouter["user"]["checkResetToken"]>;
    const input: Input = {
      token: "",
    };

    await expect(caller.user.checkResetToken(input)).rejects.toBeInstanceOf(
      TRPCError
    );
    await expect(caller.user.checkResetToken(input)).rejects.toThrow(
      new TRPCError({
        code: "BAD_REQUEST",
        message: "Token is required",
      })
    );
  });

  test("rejects if token is invalid", async () => {
    // mock the prisma client db
    const prismaMock = mockDeep<PrismaClient>();

    const caller = appRouter.createCaller({
      session: null,
      prisma: prismaMock,
    });

    type Input = inferProcedureInput<AppRouter["user"]["checkResetToken"]>;
    const input: Input = {
      token: "1234",
    };

    await expect(caller.user.checkResetToken(input)).rejects.toBeInstanceOf(
      TRPCError
    );
    await expect(caller.user.checkResetToken(input)).rejects.toThrow(
      new TRPCError({
        code: "BAD_REQUEST",
        message: "Invalid token",
      })
    );
  });

  test("valid token", () => {
    // mock the prisma client db
    const prismaMock = mockDeep<PrismaClient>();

    const caller = appRouter.createCaller({
      session: null,
      prisma: prismaMock,
    });

    type Input = inferProcedureInput<AppRouter["user"]["checkResetToken"]>;
    const input: Input = {
      token: resetToken,
    };

    const result = caller.user.checkResetToken(input);

    expect(result).toBeTruthy();
  });
});

describe("reset password", () => {
  test("rejects if password and confirm password do not match", async () => {
    // mock the prisma client db
    const prismaMock = mockDeep<PrismaClient>();

    const caller = appRouter.createCaller({
      session: null,
      prisma: prismaMock,
    });

    type Input = inferProcedureInput<AppRouter["user"]["resetPassword"]>;
    const input: Input = {
      token: resetToken,
      newPassword: "password",
      confirmPassword: "password1",
    };

    await expect(caller.user.resetPassword(input)).rejects.toBeInstanceOf(
      TRPCError
    );
    await expect(caller.user.resetPassword(input)).rejects.toThrow(
      new TRPCError({
        code: "BAD_REQUEST",
        message: "Passwords do not match",
      })
    );
  });

  test("rejects if token is invalid", async () => {
    // mock the prisma client db
    const prismaMock = mockDeep<PrismaClient>();

    const caller = appRouter.createCaller({
      session: null,
      prisma: prismaMock,
    });

    type Input = inferProcedureInput<AppRouter["user"]["resetPassword"]>;
    const input: Input = {
      token: "123456",
      newPassword: "password",
      confirmPassword: "password",
    };

    await expect(caller.user.resetPassword(input)).rejects.toBeInstanceOf(
      TRPCError
    );
    await expect(caller.user.resetPassword(input)).rejects.toThrow(
      new TRPCError({
        code: "BAD_REQUEST",
        message: "Invalid token",
      })
    );
  });

  test("successfully resets password", async () => {
    // mock the prisma client db
    const prismaMock = mockDeep<PrismaClient>();

    const caller = appRouter.createCaller({
      session: null,
      prisma: prismaMock,
    });

    type Input = inferProcedureInput<AppRouter["user"]["resetPassword"]>;
    const input: Input = {
      token: resetToken,
      newPassword: "password",
      confirmPassword: "password",
    };

    const result = await caller.user.resetPassword(input);

    expect(result).toBeTruthy();
    expect(result).toEqual("Password updated");
  });
});

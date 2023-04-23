import { describe, expect, test } from "@jest/globals";
import type { PrismaClient, User } from "@prisma/client";
import { Role } from "@prisma/client";
import { type inferProcedureInput, TRPCError } from "@trpc/server";
import { mockDeep } from "jest-mock-extended";
import type { Session } from "next-auth";

import type { RouterOutputs } from "../../src/lib/api";
import { appRouter, type AppRouter } from "../../src/server/api/root";

const mockSession: Session = {
  expires: new Date().toISOString(),
  user: {
    id: "test-id",
    name: "test user",
    username: "test-username",
    email: "test-user@test.com",
    role: Role.ADMIN,
  },
};

const mockUsers: User[] = [
  {
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
  },
];

describe("users router", () => {
  describe("getAll", () => {
    test('returns "unauthorized" if user is not logged in', async () => {
      // mock the prisma client db
      const prismaMock = mockDeep<PrismaClient>();

      const caller = appRouter.createCaller({
        session: null,
        prisma: prismaMock,
      });

      await expect(caller.user.getAll({ limit: 10 })).rejects.toBeInstanceOf(
        TRPCError
      );
      await expect(caller.user.getAll({ limit: 10 })).rejects.toThrow(
        new TRPCError({
          code: "UNAUTHORIZED",
        })
      );
    });

    test("returns all users", async () => {
      // mock the prisma client db
      const prismaMock = mockDeep<PrismaClient>();

      const caller = appRouter.createCaller({
        session: mockSession,
        prisma: prismaMock,
      });

      const mockResponse = {
        count: 1,
        items: mockUsers,
      };

      prismaMock.user.count.mockResolvedValue(mockResponse.count);
      prismaMock.user.findMany.mockResolvedValue(mockResponse.items);
      prismaMock.$transaction.mockResolvedValue([
        mockResponse.count,
        mockResponse.items,
      ]);

      const result = await caller.user.getAll({ limit: 10 });

      expect(result).toEqual(mockResponse);
    });
  });

  describe("create", () => {
    test('returns "unauthorized" if user is not logged in', async () => {
      // mock the prisma client db
      const prismaMock = mockDeep<PrismaClient>();

      const caller = appRouter.createCaller({
        session: null,
        prisma: prismaMock,
      });

      type Input = inferProcedureInput<AppRouter["user"]["create"]>;
      const input: Input = {
        firstName: "test",
        lastName: "user",
        dateOfBirth: "1990-01-01",
        username: "test-username",
        email: "test-user@example.com",
        password: "password",
        role: Role.PATIENT,
      };

      await expect(caller.user.create(input)).rejects.toBeInstanceOf(TRPCError);
      await expect(caller.user.create(input)).rejects.toThrow(
        new TRPCError({
          code: "UNAUTHORIZED",
        })
      );
    });

    test("creates a new user", async () => {
      // mock the prisma client db
      const prismaMock = mockDeep<PrismaClient>();

      const caller = appRouter.createCaller({
        session: mockSession,
        prisma: prismaMock,
      });

      const mockOutput: RouterOutputs["user"]["create"] = {
        id: "test-id",
        name: "test user",
        email: "test-user@example.com",
        username: "test-username",
        role: Role.PATIENT,
      };

      type Input = inferProcedureInput<AppRouter["user"]["create"]>;
      const input: Input = {
        firstName: "test",
        lastName: "user",
        dateOfBirth: "1990-01-01",
        username: "test-username",
        email: "test-user@example.com",
        password: "password",
        role: Role.PATIENT,
      };

      prismaMock.user.findFirst.mockResolvedValue(null);
      prismaMock.user.create.mockResolvedValue(mockOutput as User);

      const result = await caller.user.create(input);

      expect(result).toBe(mockOutput);
    });
  });

  describe("update", () => {
    test('returns "unauthorized" if user is not logged in', async () => {
      // mock the prisma client db
      const prismaMock = mockDeep<PrismaClient>();

      const caller = appRouter.createCaller({
        session: null,
        prisma: prismaMock,
      });

      type Input = inferProcedureInput<AppRouter["user"]["update"]>;
      const input: Input = {
        id: "test-id",
        name: "test user",
        role: Role.PATIENT,
      };

      await expect(caller.user.update(input)).rejects.toBeInstanceOf(TRPCError);
      await expect(caller.user.update(input)).rejects.toThrow(
        new TRPCError({
          code: "UNAUTHORIZED",
        })
      );
    });

    test("updates a user", async () => {
      // mock the prisma client db
      const prismaMock = mockDeep<PrismaClient>();

      const caller = appRouter.createCaller({
        session: mockSession,
        prisma: prismaMock,
      });

      type Input = inferProcedureInput<AppRouter["user"]["update"]>;
      const input: Input = {
        id: "test-id",
        name: "test user",
        role: Role.PATIENT,
      };

      prismaMock.user.update.mockResolvedValue(input as User);

      const result = await caller.user.update(input);

      expect(result).toBe(input);
    });
  });

  describe("delete", () => {
    test('returns "unauthorized" if user is not logged in', async () => {
      // mock the prisma client db
      const prismaMock = mockDeep<PrismaClient>();

      const caller = appRouter.createCaller({
        session: null,
        prisma: prismaMock,
      });

      type Input = inferProcedureInput<AppRouter["user"]["delete"]>;
      const input: Input = {
        id: "test-id",
      };

      await expect(caller.user.delete(input)).rejects.toBeInstanceOf(TRPCError);
      await expect(caller.user.delete(input)).rejects.toThrow(
        new TRPCError({
          code: "UNAUTHORIZED",
        })
      );
    });

    test("deletes a user", async () => {
      // mock the prisma client db
      const prismaMock = mockDeep<PrismaClient>();

      const caller = appRouter.createCaller({
        session: mockSession,
        prisma: prismaMock,
      });

      type Input = inferProcedureInput<AppRouter["user"]["delete"]>;
      const input: Input = {
        id: "test-id",
      };

      prismaMock.user.delete.mockResolvedValue(input as User);

      const result = await caller.user.delete(input);

      expect(result).toBe(input);
    });
  });
});

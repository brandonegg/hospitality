import { describe, expect, test } from "@jest/globals";
import type { PrismaClient, Rate } from "@prisma/client";
import { Role } from "@prisma/client";
import { type inferProcedureInput, TRPCError } from "@trpc/server";
import { mockDeep } from "jest-mock-extended";
import type { Session } from "next-auth";

import { appRouter, type AppRouter } from "../../src/server/api/root";
import type { RouterOutputs } from "../../src/utils/api";

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

const mockRate: Rate[] = [
  {
    id: "test-id",
    name: "test rate",
    description: "test description",
    price: 100,
  },
];

describe("rate router", () => {
  describe("getAll", () => {
    test('returns "unauthorized" if user is not logged in', async () => {
      // mock the prisma client db
      const prismaMock = mockDeep<PrismaClient>();

      const caller = appRouter.createCaller({
        session: null,
        prisma: prismaMock,
      });

      await expect(caller.rate.getAll({ limit: 10 })).rejects.toBeInstanceOf(
        TRPCError
      );
      await expect(caller.rate.getAll({ limit: 10 })).rejects.toThrow(
        new TRPCError({
          code: "UNAUTHORIZED",
        })
      );
    });

    test("returns all rates", async () => {
      // mock the prisma client db
      const prismaMock = mockDeep<PrismaClient>();

      const caller = appRouter.createCaller({
        session: mockSession,
        prisma: prismaMock,
      });

      const mockResponse = {
        count: 1,
        items: mockRate,
      };

      prismaMock.rate.count.mockResolvedValue(mockResponse.count);
      prismaMock.rate.findMany.mockResolvedValue(mockResponse.items);
      prismaMock.$transaction.mockResolvedValue([
        mockResponse.count,
        mockResponse.items,
      ]);

      const result = await caller.rate.getAll({ limit: 10 });

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

      type Input = inferProcedureInput<AppRouter["rate"]["create"]>;
      const input: Input = {
        name: "test rate",
        description: "test description",
        price: "100",
      };

      await expect(caller.rate.create(input)).rejects.toBeInstanceOf(TRPCError);
      await expect(caller.rate.create(input)).rejects.toThrow(
        new TRPCError({
          code: "UNAUTHORIZED",
        })
      );
    });

    test("creates a new rate", async () => {
      // mock the prisma client db
      const prismaMock = mockDeep<PrismaClient>();

      const caller = appRouter.createCaller({
        session: mockSession,
        prisma: prismaMock,
      });

      const mockOutput: RouterOutputs["rate"]["create"] = {
        id: "test-id",
        name: "test rate",
        description: "test description",
        price: 100,
      };

      type Input = inferProcedureInput<AppRouter["rate"]["create"]>;
      const input: Input = {
        name: "test rate",
        description: "test description",
        price: "100",
      };

      prismaMock.rate.findFirst.mockResolvedValue(null);
      prismaMock.rate.create.mockResolvedValue(mockOutput);

      const result = await caller.rate.create(input);

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

      type Input = inferProcedureInput<AppRouter["rate"]["update"]>;
      const input: Input = {
        id: "test-id",
        name: "test rate",
        description: "test description",
        price: "100",
      };

      await expect(caller.rate.update(input)).rejects.toBeInstanceOf(TRPCError);
      await expect(caller.rate.update(input)).rejects.toThrow(
        new TRPCError({
          code: "UNAUTHORIZED",
        })
      );
    });

    test("updates a rate", async () => {
      // mock the prisma client db
      const prismaMock = mockDeep<PrismaClient>();

      const caller = appRouter.createCaller({
        session: mockSession,
        prisma: prismaMock,
      });

      type Input = inferProcedureInput<AppRouter["rate"]["update"]>;
      const input: Input = {
        id: "test-id",
        name: "test rate",
        description: "test description",
        price: "100",
      };

      prismaMock.$executeRawUnsafe.mockResolvedValue(1);

      const result = await caller.rate.update(input);

      expect(result).toBe(mockRate.length);
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

      type Input = inferProcedureInput<AppRouter["rate"]["delete"]>;
      const input: Input = {
        id: "test-id",
      };

      await expect(caller.rate.delete(input)).rejects.toBeInstanceOf(TRPCError);
      await expect(caller.rate.delete(input)).rejects.toThrow(
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

      type Input = inferProcedureInput<AppRouter["rate"]["delete"]>;
      const input: Input = {
        id: "test-id",
      };

      prismaMock.$executeRawUnsafe.mockResolvedValue(1);

      const result = await caller.rate.delete(input);

      expect(result).toBe(mockRate.length);
    });
  });
});

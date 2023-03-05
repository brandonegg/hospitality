import { describe, test } from "@jest/globals";
import type { PrismaClient, User } from "@prisma/client";
import { mockDeep } from "jest-mock-extended";

import { appRouter } from "../../src/server/api/root";

const mockUser: User = {
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

describe("login", () => {
  test("no user in database", () => {
    const prismaMock = mockDeep<PrismaClient>();

    const caller = appRouter.createCaller({
      session: null,
      prisma: prismaMock,
    });

    prismaMock.user.findFirst.mockResolvedValue(emptyUser);
  });

  test("user in database", () => {
    const prismaMock = mockDeep<PrismaClient>();

    const caller = appRouter.createCaller({
      session: null,
      prisma: prismaMock,
    });

    prismaMock.user.findFirst.mockResolvedValue(mockUser);
  });
});

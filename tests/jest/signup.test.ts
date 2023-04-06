import { describe, expect, test } from "@jest/globals";
import type { Address, PrismaClient, User } from "@prisma/client";
import { Role } from "@prisma/client";
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

const mockAddress: Address | null = {
  id: "test-address-id",
  street: "1234 Main St",
  city: "Test City",
  state: "Test State",
  zipCode: 12345,
};

const emptyUser: User | null = null;

describe("sign up router", () => {
  test("rejects if password and confirm password do not match", async () => {
    // mock the prisma client db
    const prismaMock = mockDeep<PrismaClient>();

    const caller = appRouter.createCaller({
      session: null,
      prisma: prismaMock,
    });

    type Input = inferProcedureInput<AppRouter["user"]["signup"]>;
    const input: Input = {
      firstName: "test",
      lastName: "user",
      street: "1234 Main St",
      city: "Test City",
      state: "Test State",
      zipCode: "12345",
      dateOfBirth: "1990-01-01",
      username: "test-username",
      email: "test-user@example.com",
      password: "password1234",
      confirmPassword: "password",
    };

    await expect(caller.user.signup(input)).rejects.toBeInstanceOf(TRPCError);
    await expect(caller.user.signup(input)).rejects.toThrow(
      new TRPCError({
        code: "BAD_REQUEST",
        message: "Passwords do not match",
      })
    );
  });

  test('rejects if "username" is already taken', async () => {
    // mock the prisma client db
    const prismaMock = mockDeep<PrismaClient>();

    const caller = appRouter.createCaller({
      session: null,
      prisma: prismaMock,
    });

    type Input = inferProcedureInput<AppRouter["user"]["signup"]>;
    const input: Input = {
      firstName: "test",
      lastName: "user",
      street: "1234 Main St",
      city: "Test City",
      state: "Test State",
      zipCode: "12345",
      dateOfBirth: "1990-01-01",
      username: "test-username",
      email: "test-user@example.com",
      password: "password",
      confirmPassword: "password",
    };

    prismaMock.user.findFirst.mockResolvedValue(mockUser);

    await expect(caller.user.signup(input)).rejects.toBeInstanceOf(TRPCError);
    await expect(caller.user.signup(input)).rejects.toThrow(
      new TRPCError({
        code: "BAD_REQUEST",
        message: "Username is already taken",
      })
    );
  });

  test("successfully create user", async () => {
    // mock the prisma client db
    const prismaMock = mockDeep<PrismaClient>();

    const caller = appRouter.createCaller({
      session: null,
      prisma: prismaMock,
    });

    type Input = inferProcedureInput<AppRouter["user"]["signup"]>;
    const input: Input = {
      firstName: "test",
      lastName: "user",
      street: "1234 Main St",
      city: "Test City",
      state: "Test State",
      zipCode: "12345",
      dateOfBirth: "1990-01-01",
      username: "test-fart",
      email: "test-user@example.com",
      password: "password",
      confirmPassword: "password",
    };

    const mockOutput: RouterOutputs["user"]["signup"] = {
      id: "test-id",
      name: input.firstName.concat(" ", input.lastName),
      email: input.email,
      username: input.username,
      role: Role.PATIENT,
    };

    prismaMock.user.findFirst.mockResolvedValue(emptyUser);
    prismaMock.user.create.mockResolvedValue(mockOutput as User);
    prismaMock.address.create.mockResolvedValue(mockAddress);

    const result = await caller.user.signup(input);

    expect(result).toBe(mockOutput);
    expect(result.username).toBe(input.username);
    expect(result.email).toBe(input.email);
    expect(result.name).toBe(input.firstName.concat(" ", input.lastName));
  });
});

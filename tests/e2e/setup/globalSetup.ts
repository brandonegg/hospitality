import { Role } from "@prisma/client";
import * as argon2 from "argon2";

import { prisma } from "../../../src/server/db";

/**
 * Sets up the testing environment
 */
async function globalSetup() {
  const address = await prisma.address.upsert({
    where: {
      id: "test_address",
    },
    create: {
      id: "test_address",
      street: "Testing Ln.",
      city: "New York",
      state: "New York",
      zipCode: 52240,
    },
    update: {},
  });

  // create admin test user
  await prisma.user.upsert({
    where: {
      email: "e2e@e2e.com",
    },
    create: {
      name: "e2e",
      dateOfBirth: new Date(),
      username: "e2e",
      email: "e2e@e2e.com",
      password: await argon2.hash("password"),
      addressId: address.id,
      role: Role.ADMIN,
    },
    update: {},
  });

  // create patient test user
  await prisma.user.upsert({
    where: {
      email: "e2e-patient@e2e.com",
    },
    create: {
      name: "e2e-patient",
      dateOfBirth: new Date(),
      username: "e2e-patient",
      email: "e2e-patient@e2e.com",
      password: await argon2.hash("password"),
      addressId: address.id,
      role: Role.PATIENT,
    },
    update: {},
  });
}

export default globalSetup;

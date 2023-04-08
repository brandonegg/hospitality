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
  const adminUser = await prisma.user.upsert({
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
  // create doctor test user
  await prisma.user.upsert({
    where: {
      email: "e2e-doctor@e2e.com",
    },
    create: {
      name: "e2e-doctor",
      dateOfBirth: new Date(),
      username: "e2e-doctor",
      email: "e2e-doctor@e2e.com",
      password: await argon2.hash("password"),
      addressId: address.id,
      role: Role.DOCTOR,
    },
    update: {},
  });

  const hospitalAddress = await prisma.address.upsert({
    where: {
      id: "uiowa_hopsital_address",
    },
    create: {
      id: "uiowa_hopsital_address",
      street: "200 Hawkins Dr.",
      city: "Iowa City",
      state: "Iowa",
      zipCode: 52242,
    },
    update: {},
  });

  await prisma.bed.deleteMany();

  await prisma.bed.createMany({
    data: [
      {
        addressId: hospitalAddress.id,
        room: "401A",
        userId: adminUser.id,
      },
      {
        addressId: hospitalAddress.id,
        room: "1100",
      },
      {
        addressId: hospitalAddress.id,
        room: "403B",
      },
      {
        addressId: hospitalAddress.id,
        room: "404",
      },
      {
        addressId: hospitalAddress.id,
        room: "405",
      },
      {
        addressId: hospitalAddress.id,
        room: "406",
      },
      {
        addressId: hospitalAddress.id,
        room: "407",
      },
      {
        addressId: hospitalAddress.id,
        room: "408",
      },
      {
        addressId: hospitalAddress.id,
        room: "409",
      },
    ]
  });
}

export default globalSetup;

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
      id: "e2e-patient",
      email: "e2e-patient@e2e.com",
    },
    create: {
      id: "e2e-patient",
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

  // create nurse test user
  await prisma.user.upsert({
    where: {
      email: "e2e-nurse@e2e.com",
    },
    create: {
      name: "e2e-nurse",
      dateOfBirth: new Date(),
      username: "e2e-nurse",
      email: "e2e-nurse@e2e.com",
      password: await argon2.hash("password"),
      addressId: address.id,
      role: Role.NURSE,
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
    ],
  });

  await prisma.rate.deleteMany();

  await prisma.rate.createMany({
    data: [
      {
        id: "test-pharmacy-rate",
        name: "Pharmacy",
        description: "Pharmacy rate",
        price: "88",
      },
      {
        name: "Med/Surg Supplies and Devices",
        description: "Med/Surg Supplies and Devices rate",
        price: "44.5",
      },
      {
        name: "Laboratory",
        description: "Laboratory rate",
        price: "109.5",
      },
      {
        name: "CT Scan",
        description: "CT Scan rate",
        price: "1700",
      },
      {
        name: "MRI",
        description: "MRI rate",
        price: "2000",
      },
      {
        name: "X-Ray",
        description: "X-Ray rate",
        price: "100",
      },
      {
        name: "Emergency Room",
        description: "Emergency Room rate",
        price: "1000",
      },
      {
        name: "Ambulance",
        description: "Ambulance rate",
        price: "500",
      },
      {
        name: "Surgery",
        description: "Surgery rate",
        price: "5000",
      },
      {
        name: "Nursing",
        description: "Nursing rate",
        price: "100",
      },
      {
        name: "Anesthesia",
        description: "Anesthesia rate",
        price: "1000",
      },
    ],
  });
}

export default globalSetup;

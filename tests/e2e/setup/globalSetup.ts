import { PaymentSourceType, Role } from "@prisma/client";
import * as argon2 from "argon2";

import { prisma } from "../../../src/server/db";

/**
 * Sets up the testing environment
 */
async function globalSetup() {
  await prisma.user.deleteMany();

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
  const patient = await prisma.user.upsert({
    where: {
      id: "e2e-patient",
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

  // create patient test user
  const yewande = await prisma.user.upsert({
    where: {
      id: "yewande",
    },
    create: {
      id: "yewande",
      name: "Yewande",
      dateOfBirth: new Date(),
      username: "Yewande",
      email: "Yewande@e2e.com",
      password: await argon2.hash("password"),
      addressId: address.id,
      role: Role.PATIENT,
    },
    update: {},
  });

  // create doctor test user
  await prisma.user.upsert({
    where: {
      id: "e2e-doctor",
    },
    create: {
      id: "e2e-doctor",
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

  await prisma.meds.deleteMany();
  await prisma.meds.createMany({
    data: [
      {
        name: "Liquid Tylenol",
        dosageMin: "10",
        dosageMax: "30",
        unit: "mL",
        // every 4 hours
      },
      {
        name: "Tylenol Pills",
        dosageMin: "10",
        dosageMax: "30",
        unit: "mL",
        // a day
      },
      {
        name: "Ibuprofen",
        dosageMin: "300",
        dosageMax: "800",
        unit: "mg",
        // every 4 hours
      },
      {
        name: "Claritin",
        dosageMin: "10",
        dosageMax: "10",
        unit: "mg",
        //daily
      },
    ],
  });

  await prisma.invoice.deleteMany();

  await prisma.invoice.createMany({
    data: [
      {
        paymentDue: new Date("3/18/2055"),
        total: "0",
        totalDue: "0",
        userId: patient.id,
      },
      {
        paymentDue: new Date("5/7/2045"),
        total: "0",
        totalDue: "0",
        userId: yewande.id,
      },
    ],
  });

  await prisma.prescription.deleteMany();

  await prisma.prescription.createMany({
    data: [
      {
        userId: patient.id,
      },
      {
        userId: yewande.id,
      },
    ],
  });

  // Create basic payment sources all patients can use for testing
  await prisma.paymentSource.upsert({
    where: {
      id: "test-bank-source",
    },
    create: {
      type: PaymentSourceType.BANK,
      name: "Bank Account",
    },
    update: {
      type: PaymentSourceType.BANK,
      name: "Bank Account",
    },
  });

  await prisma.paymentSource.upsert({
    where: {
      id: "test-discover-source",
    },
    create: {
      type: PaymentSourceType.CARD,
      name: "Discover Card",
    },
    update: {
      type: PaymentSourceType.CARD,
      name: "Discover Card",
    },
  });

  // create tests
  await prisma.test.deleteMany();

  const test = await prisma.test.create({
    data: {
      name: "Basic Metabolic Panel (BMP)",
      description:
        "A group of 7-8 tests used as a screening tool to check for conditions like diabetes and kidney disease. You may be asked to fast for 10 to 12 hours prior to the test.",
    },
  });
  await prisma.test.createMany({
    data: [
      {
        name: "Complete Blood Count (CBC)",
        description:
          "Determines general health and screens for disorders such as anemia or infections, as well as nutritional status and toxic substance exposure.",
      },
      {
        name: "Comprehensive Metabolic Panel (CMP)",
        description:
          "A group of 14 tests used as a screening tool to check for conditions like diabetes and kidney disease. You may be asked to fast for 10 to 12 hours prior to the test.",
      },
      {
        name: "Sedimentation Rate (ESR)",
        description:
          "A test that measures the rate at which red blood cells settle to the bottom of a test tube. It is used to help diagnose inflammation and infection.",
      },
    ],
  });

  // create lab tests
  await prisma.labTest.deleteMany();

  await prisma.labTest.createMany({
    data: [
      {
        testId: test.id,
        userId: patient.id,
      },
    ],
  });
}
export default globalSetup;

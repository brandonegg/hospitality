import { PaymentSourceType, PrismaClient, Role } from "@prisma/client";
import * as argon2 from "argon2";

const prisma = new PrismaClient(); // Prisma client instance

/**
 * Seed the database with admin user
 */
async function main() {
  await prisma.user.deleteMany();

  const password = await argon2.hash("admin");
  const admin = await prisma.user.upsert({
    where: { email: "admin@admin.com" },
    update: {},
    create: {
      name: "Admin User",
      username: "admin",
      email: "admin@admin.com",
      password: password,
      dateOfBirth: new Date("1/1/1960"),
      role: Role.ADMIN,
    },
  });

  const address = await prisma.address.upsert({
    where: {
      id: "test_address",
    },
    create: {
      id: "test_address",
      street: "123 Test Dr.",
      city: "Iowa City",
      state: "Iowa",
      zipCode: 52240,
    },
    update: {},
  });

  const passwordBob = await argon2.hash("bob");
  // create patient to be used for invoice seeding
  const bob = await prisma.user.upsert({
    where: { email: "bob@prisma.io" },
    update: {},
    create: {
      name: "Bob",
      username: "bob",
      email: "bob@prisma.io",
      password: passwordBob,
      dateOfBirth: new Date("3/18/2000"),
      addressId: address.id,
      role: Role.PATIENT,
    },
  });

  // create some dummy users
  await prisma.user.createMany({
    data: [
      {
        name: "Bobo",
        username: "bobo",
        email: "bob@prisma.io",
        password: password,
        dateOfBirth: new Date("3/18/2000"),
        addressId: address.id,

        role: Role.DOCTOR,
      },
      {
        name: "Yewande",
        username: "yewande",
        email: "yewande@prisma.io",
        password: password,
        dateOfBirth: new Date("3/18/2000"),
        addressId: address.id,

        role: Role.PATIENT,
      },
      {
        name: "Angelique",
        username: "angelique",
        email: "angelique@prisma.io",
        password: password,
        dateOfBirth: new Date("3/18/2000"),
        addressId: address.id,
        role: Role.NURSE,
      },
      {
        name: "John",
        username: "john",
        email: "john@prisma.io",
        password: password,
        dateOfBirth: new Date("3/18/2000"),
        addressId: address.id,
        role: Role.PATIENT,
      },
      {
        name: "Joe",
        username: "joe",
        email: "joe@prisma.io",
        password: password,
        dateOfBirth: new Date("3/18/2000"),
        addressId: address.id,
        role: Role.DOCTOR,
      },
      {
        name: "Admin User 1",
        username: "adminuser1",
        email: "adminuser1@prisma.io",
        password: password,
        dateOfBirth: new Date("3/18/2000"),
        addressId: address.id,
        role: Role.ADMIN,
      },
      {
        name: "Jane",
        username: "jane",
        email: "jane@prisma.io",
        password: password,
        dateOfBirth: new Date("3/18/2000"),
        addressId: address.id,
        role: Role.NURSE,
      },
      {
        name: "Josh",
        username: "josh",
        email: "josh@prisma.io",
        password: password,
        dateOfBirth: new Date("3/18/2000"),
        addressId: address.id,
        role: Role.PATIENT,
      },
    ],
    skipDuplicates: true,
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
        userId: admin.id,
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
      {
        addressId: hospitalAddress.id,
        room: "410",
      },
      {
        addressId: hospitalAddress.id,
        room: "411",
      },
      {
        addressId: hospitalAddress.id,
        room: "220",
      },
      {
        addressId: hospitalAddress.id,
        room: "104",
      },
      {
        addressId: hospitalAddress.id,
        room: "106B",
      },
      {
        addressId: hospitalAddress.id,
        room: "107",
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

  await prisma.rate.deleteMany();

  await prisma.rate.createMany({
    data: [
      {
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

  await prisma.invoice.deleteMany();

  await prisma.invoice.createMany({
    data: [
      {
        paymentDue: new Date("3/18/2055"),
        total: "0",
        totalDue: "0",
        userId: bob.id,
      },
      {
        paymentDue: new Date("5/7/2045"),
        total: "0",
        totalDue: "0",
        userId: bob.id,
      },
    ],
  });

  await prisma.prescription.deleteMany();

  await prisma.prescription.createMany({
    data: [
      {
        userId: bob.id,
      },
      {
        userId: bob.id,
      },
    ],
  });

  await prisma.paymentSource.deleteMany();

  // Create basic payment sources all patients can use for testing
  await prisma.paymentSource.createMany({
    data: [
      {
        type: PaymentSourceType.BANK,
        name: "Bank Account",
      },
      {
        type: PaymentSourceType.CARD,
        name: "Discover Card",
      },
    ],
  });

  await prisma.test.deleteMany();

  const test = await prisma.test.create({
    data: {
      name: "Antinuclear Antibody (ANA)",
      description:
        "This test helps to diagnose lupus and to rule out certain other autoimmune diseases.",
    },
  });
  await prisma.test.createMany({
    data: [
      {
        name: "Basic Metabolic Panel (BMP)",
        description:
          "A group of 7-8 tests used as a screening tool to check for conditions like diabetes and kidney disease. You may be asked to fast for 10 to 12 hours prior to the test.",
      },
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
      {
        name: "Flu Test (Influenza A & B Screen)",
        description:
          "A test that detects the presence of the influenza A and B viruses in the blood. It is used to help diagnose the flu.",
      },
      {
        name: "Glucose Level",
        description:
          "A test that measures the amount of glucose in the blood. It is used to help diagnose diabetes and to monitor the effectiveness of diabetes treatment.",
      },
      {
        name: "Pregnancy Test (hCG)",
        description:
          "A test that measures the amount of human chorionic gonadotropin (hCG) in the blood. It is used to help diagnose pregnancy.",
      },
      {
        name: "Hemoglobin A1c (HbA1c)",
        description:
          "A test that measures the amount of hemoglobin A1c in the blood. It is used to help diagnose diabetes and to monitor the effectiveness of diabetes treatment.",
      },
      {
        name: "HIV Antibody Test",
        description:
          "A test that detects the presence of antibodies to the human immunodeficiency virus (HIV) in the blood. It is used to help diagnose HIV infection.",
      },
      {
        name: "Liver Function Tests (LFTs)",
        description:
          "A group of 5-6 tests used to check for liver damage and disease. You may be asked to fast for 10 to 12 hours prior to the test.",
      },
      {
        name: "Lipid Panel",
        description:
          "This group of tests can determine risk of coronary heart disease, and may be a good indicator of whether someone is likely to have a heart attack or stroke, as caused by blockage of blood vessels.",
      },
      {
        name: "Lyme Antibody Test",
        description:
          "A test that detects the presence of antibodies to the Borrelia burgdorferi bacteria in the blood. It is used to help diagnose Lyme disease.",
      },
      {
        name: "Mononucleosis Test (Mono Spot)",
        description:
          "A test that detects the presence of antibodies to the Epstein-Barr virus in the blood. It is used to help diagnose mononucleosis.",
      },
      {
        name: "Pap Smear",
        description:
          "A test that detects the presence of human papillomavirus (HPV) in the cervix. It is used to help diagnose cervical cancer.",
      },
      {
        name: "Partial Thromboplastin Time (PTT)",
        description:
          "A test that measures the time it takes for blood to clot.",
      },
      {
        name: "Prostate Specific Antigen (PSA)",
        description: "This test is to screen for and monitor prostate cancer.",
      },
      {
        name: "Urinalysis",
        description:
          "A test that measures the physical, chemical, and microscopic characteristics of urine. It is used to help diagnose and monitor a wide variety of conditions.",
      },
    ],
  });

  await prisma.labTest.deleteMany();

  await prisma.labTest.createMany({
    data: [
      {
        testId: test.id,
        userId: bob.id,
      },
    ],
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
  });

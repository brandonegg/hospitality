import { PaymentSourceType, PrismaClient, Role } from "@prisma/client";
import * as argon2 from "argon2";

const prisma = new PrismaClient(); // Prisma client instance

/**
 * Seed the database with admin user
 */
async function main() {
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

  // create some dummy users
  await prisma.user.createMany({
    data: [
      {
        name: "Bob",
        username: "bob",
        email: "bob@prisma.io",
        password: password,
        dateOfBirth: new Date("3/18/2000"),
        addressId: address.id,
        role: Role.PATIENT,
      },
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
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
  });

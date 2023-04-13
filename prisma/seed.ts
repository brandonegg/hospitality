import { PrismaClient, Role } from "@prisma/client";
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

  await prisma.rate.createMany({
    data: [
      {
        name: "Standard",
        description: "Standard rate",
        price: 100,
      },
      {
        name: "Premium",
        description: "Premium rate",
        price: 200,
      },
      {
        name: "Deluxe",
        description: "Deluxe rate",
        price: 300,
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

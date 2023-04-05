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

  // create some dummy users
  await prisma.user.createMany({
    data: [
      {
        name: "Bob",
        username: "bob",
        email: "bob@prisma.io",
        password: password,
        dateOfBirth: new Date("3/18/2000"),
        addressId: "clevr3plo000c3ocy88y5dprl",
        role: Role.PATIENT,
      },
      {
        name: "Bobo",
        username: "bobo",
        email: "bob@prisma.io",
        password: password,
        dateOfBirth: new Date("3/18/2000"),
        addressId: "clevr3plo000c3ocy88y5dprl",
        role: Role.DOCTOR,
      },
      {
        name: "Yewande",
        username: "yewande",
        email: "yewande@prisma.io",
        password: password,
        dateOfBirth: new Date("3/18/2000"),
        addressId: "clevr3plo000c3ocy88y5dprl",
        role: Role.PATIENT,
      },
      {
        name: "Angelique",
        username: "angelique",
        email: "angelique@prisma.io",
        password: password,
        dateOfBirth: new Date("3/18/2000"),
        addressId: "clevr3plo000c3ocy88y5dprl",
        role: Role.NURSE,
      },
      {
        name: "John",
        username: "john",
        email: "john@prisma.io",
        password: password,
        dateOfBirth: new Date("3/18/2000"),
        addressId: "clevr3plo000c3ocy88y5dprl",
        role: Role.PATIENT,
      },
      {
        name: "Joe",
        username: "joe",
        email: "joe@prisma.io",
        password: password,
        dateOfBirth: new Date("3/18/2000"),
        addressId: "clevr3plo000c3ocy88y5dprl",
        role: Role.DOCTOR,
      },
      {
        name: "Admin User 1",
        username: "adminuser1",
        email: "adminuser1@prisma.io",
        password: password,
        dateOfBirth: new Date("3/18/2000"),
        addressId: "clevr3plo000c3ocy88y5dprl",
        role: Role.ADMIN,
      },
      {
        name: "Jane",
        username: "jane",
        email: "jane@prisma.io",
        password: password,
        dateOfBirth: new Date("3/18/2000"),
        addressId: "clevr3plo000c3ocy88y5dprl",
        role: Role.NURSE,
      },
      {
        name: "Josh",
        username: "josh",
        email: "josh@prisma.io",
        password: password,
        dateOfBirth: new Date("3/18/2000"),
        addressId: "clevr3plo000c3ocy88y5dprl",
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
    ]
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

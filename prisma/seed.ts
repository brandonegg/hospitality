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
        email: "bob@prisma.io",
        password: password,
        dateOfBirth: new Date("3/18/2000"),
        addressId: "clevr3plo000c3ocy88y5dprl",
        role: Role.PATIENT,
      },
      {
        name: "Bobo",
        email: "bob@prisma.io",
        password: password,
        dateOfBirth: new Date("3/18/2000"),
        addressId: "clevr3plo000c3ocy88y5dprl",
        role: Role.DOCTOR,
      },
      {
        name: "Yewande",
        email: "yewande@prisma.io",
        password: password,
        dateOfBirth: new Date("3/18/2000"),
        addressId: "clevr3plo000c3ocy88y5dprl",
        role: Role.PATIENT,
      },
      {
        name: "Angelique",
        email: "angelique@prisma.io",
        password: password,
        dateOfBirth: new Date("3/18/2000"),
        addressId: "clevr3plo000c3ocy88y5dprl",
        role: Role.NURSE,
      },
      {
        name: "John",
        email: "john@prisma.io",
        password: password,
        dateOfBirth: new Date("3/18/2000"),
        addressId: "clevr3plo000c3ocy88y5dprl",
        role: Role.PATIENT,
      },
      {
        name: "Joe",
        email: "joe@prisma.io",
        password: password,
        dateOfBirth: new Date("3/18/2000"),
        addressId: "clevr3plo000c3ocy88y5dprl",
        role: Role.DOCTOR,
      },
      {
        name: "Admin User 1",
        email: "adminuser1@prisma.io",
        password: password,
        dateOfBirth: new Date("3/18/2000"),
        addressId: "clevr3plo000c3ocy88y5dprl",
        role: Role.ADMIN,
      },
      {
        name: "Jane",
        email: "jane@prisma.io",
        password: password,
        dateOfBirth: new Date("3/18/2000"),
        addressId: "clevr3plo000c3ocy88y5dprl",
        role: Role.NURSE,
      },
      {
        name: "Josh",
        email: "josh@prisma.io",
        password: password,
        dateOfBirth: new Date("3/18/2000"),
        addressId: "clevr3plo000c3ocy88y5dprl",
        role: Role.PATIENT,
      },
    ],
    skipDuplicates: true,
  });

  console.log({ admin });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
  });

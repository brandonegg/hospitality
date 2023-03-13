import { PrismaClient } from "@prisma/client";
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
      role: "ADMIN",
    },
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

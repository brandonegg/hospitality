import { Prisma } from "@prisma/client";
import { z } from "zod";

import { prisma } from "../../db";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

/**
 * The default select for a user.
 * This is used to ensure that we don't accidentally expose sensitive data.
 */
const defaultUserSelect = Prisma.validator<Prisma.UserSelect>()({
  id: true,
  name: true,
  email: true,
  username: true,
});

export const userRouter = createTRPCRouter({
  signup: publicProcedure
    .input(
      z.object({
        firstName: z.string(),
        lastName: z.string(),
        dateOfBirth: z.string(),
        username: z.string(),
        email: z.string().email(),
        password: z.string(),
        confirmPassword: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      // Check if the password and confirm password match
      if (input.password !== input.confirmPassword) {
        throw new Error("Passwords do not match");
      }

      // Check if the username is already taken
      const usernameExists = await prisma.user.findFirst({
        where: { username: input.username },
      });
      if (usernameExists) {
        throw new Error("Username is already taken");
      }

      // Check if the email is already taken
      const emailExists = await prisma.user.findFirst({
        where: { email: input.email },
      });
      if (emailExists) {
        throw new Error("Email is already taken");
      }

      // format the user data
      const newUser = {
        name: `${input.firstName} ${input.lastName}`,
        dateOfBirth: new Date(input.dateOfBirth),
        username: input.username,
        email: input.email,
        password: input.password,
      };

      // Create the user
      const user = await prisma.user.create({
        data: newUser,
        select: defaultUserSelect,
      });

      return user;
    }),
});

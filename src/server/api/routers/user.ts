import { Prisma } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import * as argon2 from "argon2";
import { z } from "zod";

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
        street: z.string(),
        city: z.string(),
        state: z.string(),
        zipCode: z.string().max(5),
        username: z.string(),
        email: z.string().email(),
        password: z.string().min(8),
        confirmPassword: z.string().min(8),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Check if the password and confirm password match
      if (input.password !== input.confirmPassword) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Passwords do not match",
        });
      }

      // Check if the username is already taken
      const usernameExists = await ctx.prisma.user.findFirst({
        where: { username: input.username },
      });
      if (usernameExists) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Username is already taken",
        });
      }

      // Check if the email is already taken
      const emailExists = await ctx.prisma.user.findFirst({
        where: { email: input.email },
      });
      if (emailExists) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Email is already taken",
        });
      }

      // hash the password
      const hashPassword = await argon2.hash(input.password);

      // format the address data
      const newAddress = {
        street: input.street,
        city: input.city,
        state: input.state,
        zipCode: parseInt(input.zipCode, 10),
      };

      // Create the user's address
      const address = await ctx.prisma.address.create({
        data: newAddress,
      });

      // format the user data
      const newUser = {
        name: `${input.firstName} ${input.lastName}`,
        dateOfBirth: new Date(input.dateOfBirth),
        username: input.username,
        email: input.email,
        password: hashPassword,
        addressId: address.id,
      };

      // Create the user
      const user = await ctx.prisma.user.create({
        data: newUser,
        select: defaultUserSelect,
      });

      return user;
    }),
});

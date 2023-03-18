import { Prisma } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import * as argon2 from "argon2";
import * as jwt from "jsonwebtoken";
import { z } from "zod";

import template from "../../../emails/template";
import { env } from "../../../env.mjs";
import { transporter } from "../../email";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

interface ResetToken {
  email: string;
  iat: number;
  exp: number;
}

/**
 * The default select for a user.
 * This is used to ensure that we don't accidentally expose sensitive data.
 */
const defaultUserSelect = Prisma.validator<Prisma.UserSelect>()({
  id: true,
  name: true,
  email: true,
  username: true,
  role: true,
});

export const userRouter = createTRPCRouter({
  getAll: protectedProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(10),
        cursor: z.string().nullish(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { limit, cursor } = input;
      const [count, items] = await ctx.prisma.$transaction([
        ctx.prisma.user.count(),
        ctx.prisma.user.findMany({
          take: limit + 1,
          cursor: cursor ? { id: cursor } : undefined,
          select: { ...defaultUserSelect, dateOfBirth: true },
        }),
      ]);

      let nextCursor: typeof cursor | undefined = undefined;
      if (items.length > limit) {
        const nextItem = items.pop(); // return the last item from the array
        nextCursor = nextItem?.id;
      }
      return {
        count,
        items,
        nextCursor,
      };
    }),
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
  forgotPassword: publicProcedure
    .input(z.object({ email: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // Check if the email exists
      const user = await ctx.prisma.user.findFirst({
        where: { email: input.email },
      });
      if (!user) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "User with that email does not exist",
        });
      }

      // generate reset token
      const token = jwt.sign({ email: input.email }, env.JWT_SECRET, {
        expiresIn: "5m",
      });

      const html = template(user.name, token);

      // email options
      const options = {
        from: "Hospitality Support",
        to: input.email,
        subject: "Password Reset",
        text: "Hospitality Password Reset\nHi ${user.name},\nYou recently requested to reset your password. Use the button below to reset it.\nThis password reset link is only valid for the next 5 minutes\nIf this was a mistake, just ignore this email.",
        html,
      };

      // Send email
      const email = await transporter.sendMail(options);

      if (!email) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Email could not be sent",
        });
      }

      return "A password reset message was sent to your email address.";
    }),
  checkResetToken: publicProcedure
    .input(z.object({ token: z.string() }))
    .query(({ input }) => {
      // Check if token exists
      if (!input.token) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Token is required",
        });
      }

      // Check if the token is valid
      try {
        jwt.verify(input.token, env.JWT_SECRET);
        return "Token is valid";
      } catch (error) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Invalid token",
        });
      }
    }),
  resetPassword: publicProcedure
    .input(
      z.object({
        token: z.string(),
        newPassword: z.string().min(8),
        confirmPassword: z.string().min(8),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Check if the password and confirm password match
      if (input.newPassword !== input.confirmPassword) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Passwords do not match",
        });
      }

      // decode the token
      let decoded;
      try {
        decoded = jwt.verify(input.token, env.JWT_SECRET);
      } catch (error) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Invalid token",
        });
      }

      // Check if the token is valid
      if (!decoded) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Invalid token",
        });
      }

      // hash the password
      const hashPassword = await argon2.hash(input.newPassword);

      // Update the password
      await ctx.prisma.user.update({
        where: { email: (decoded as ResetToken).email },
        data: { password: hashPassword },
      });

      return "Password updated";
    }),
});

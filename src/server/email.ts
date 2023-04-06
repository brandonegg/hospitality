import nodemailer from "nodemailer";

import { env } from "../env.mjs";

const { EMAIL_USER, EMAIL_PASSWORD } = env;

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    user: EMAIL_USER,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    pass: EMAIL_PASSWORD,
  },
});

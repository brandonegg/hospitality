import nodemailer from "nodemailer";

import { env } from "../env.mjs";

const { EMAIL_USER, EMAIL_PASSWORD } = env;

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASSWORD,
  },
});

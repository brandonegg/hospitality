import { expect, test } from "@playwright/test";

import { prisma } from "../../src/server/db";

import { doctorTest } from "./playwright/fixtures";

test.describe("create report", () => {
  test.beforeEach(async () => {
    // Reset e2e-patient's post visit reports
    await prisma.visitReport.deleteMany({
      where: {
        patientId: "e2e-patient",
      },
    });
  });

  doctorTest("with valid fields", async ({ page }) => {
    await page.goto("/dashboard/reports");
    await page.getByRole("link", { name: "Create Report +" }).click();
    await page.getByRole("button", { name: "e2e-patient" }).click();

    // Vitals
    await page.getByLabel("Pulse").fill("22");
    await page.getByLabel("Temperature").fill("98");
    await page.getByLabel("Weight").fill("160");
    await page.getByLabel("Respiration").fill("22");
    await page.getByLabel("Oxygen Saturation").fill("98");

    // SOAP notes
    await page.getByLabel("Subjective").fill("test");
    await page.getByLabel("Objective").fill("test");
    await page.getByLabel("Assessment").fill("test");
    await page.getByLabel("Plan").fill("test");

    // Submit
    await page.getByRole("button", { name: "Submit" }).click();

    await expect(page.getByRole("heading", { name: "Success!" })).toBeVisible();
  });
});

test.describe("delete report", () => {
  test.beforeEach(async () => {
    // Reset e2e-patient's post visit reports
    await prisma.visitReport.create({
      data: {
        date: new Date(),
        patientId: "e2e-patient",
        doctorId: "e2e-doctor",
        vitals: {
          create: {
            date: new Date(),
            pulse: 1,
            temperature: 1,
            weight: 1,
            respiration: 1,
            oxygenSaturation: 1,
            patientId: "e2e-patient",
          },
        },
        soapNotes: {
          create: {
            subjective: "test",
            objective: "test",
            assessment: "test",
            plan: "test",
            doctorId: "e2e-doctor",
          },
        },
      },
    });
  });

  doctorTest("with valid fields", async ({ page }) => {
    await page.goto("/dashboard/reports");
    await page.getByRole("button").first().click();
  });
});

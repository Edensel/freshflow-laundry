import "server-only";

import { createHash } from "crypto";
import { cookies } from "next/headers";

const cookieName = "freshflow_admin";
const demoSecret = "freshflow-demo";
const validEmails = [
  "admin@freshflowslaundry.com",
  "ops@freshflowslaundry.com",
  process.env.STAFF_NOTIFICATION_EMAIL || "staff@freshflowslaundry.com",
];

function adminToken() {
  const secret =
    process.env.ADMIN_SHARED_SECRET ||
    (process.env.NODE_ENV !== "production" ? demoSecret : "");

  if (!secret) {
    return null;
  }

  return createHash("sha256")
    .update(secret)
    .digest("hex");
}

export function isAdminConfigured() {
  return Boolean(adminToken());
}

export function isAdminCredentials(email: string, password: string) {
  const secret =
    process.env.ADMIN_SHARED_SECRET ||
    (process.env.NODE_ENV !== "production" ? demoSecret : "");

  const cleanEmail = email.trim().toLowerCase();

  // Allow any valid email format along with valid staff emails
  const isEmailValid = cleanEmail.includes("@") && cleanEmail.includes(".");
  const isPasswordValid = Boolean(secret && password === secret);

  return isEmailValid && isPasswordValid;
}

export function adminPasswordHint() {
  if (process.env.ADMIN_SHARED_SECRET || process.env.NODE_ENV === "production") {
    return null;
  }

  return demoSecret;
}

export async function isAdminAuthenticated() {
  const token = adminToken();

  if (!token) {
    return false;
  }

  return (await cookies()).get(cookieName)?.value === token;
}

export async function setAdminSession() {
  const token = adminToken();

  if (!token) {
    throw new Error("ADMIN_SHARED_SECRET is not configured.");
  }

  (await cookies()).set(cookieName, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 10,
    path: "/",
  });
}

export async function clearAdminSession() {
  (await cookies()).delete(cookieName);
}

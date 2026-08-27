import "server-only";

import { createHash } from "crypto";
import { cookies } from "next/headers";

const cookieName = "freshflow_admin";
const demoSecret = "freshflow-demo";

function adminToken() {
  const secret = process.env.ADMIN_SHARED_SECRET || demoSecret;

  return createHash("sha256")
    .update(secret)
    .digest("hex");
}

export function isAdminConfigured() {
  return Boolean(adminToken());
}

export function isAdminCredentials(email: string, password: string) {
  const secret = process.env.ADMIN_SHARED_SECRET || demoSecret;
  const cleanEmail = email.trim().toLowerCase();

  const isEmailValid = cleanEmail.includes("@") && cleanEmail.includes(".");
  const isPasswordValid = Boolean(password === secret);

  return isEmailValid && isPasswordValid;
}

export function adminPasswordHint() {
  return process.env.ADMIN_SHARED_SECRET || demoSecret;
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

"use server";

import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export interface AdminTokenData {
  id: string;
  name: string;
  email: string;
  roles: string[]; // Ensure roles are strings
}

/**
 * Safely extracts admin token data from the "adminToken" cookie.
 * Returns null if the token is missing or invalid.
 */
export async function getAdminFromCookie(): Promise<AdminTokenData | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("adminToken")?.value;

    if (!token) return null;

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET_KEY!
    ) as AdminTokenData;

    const isValid =
      typeof decoded.id === "string" &&
      typeof decoded.name === "string" &&
      typeof decoded.email === "string" &&
      Array.isArray(decoded.roles) &&
      decoded.roles.every((role) => typeof role === "string");

    return isValid ? decoded : null;
  } catch (err) {
    console.error("Invalid admin token:", err);
    return null;
  }
}

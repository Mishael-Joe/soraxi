import * as jose from "jose";
import { Permission } from "../shared/permissions";
import { Role, ROLES } from "../shared/roles";
import { getPermissionsForRoles } from "../shared/access-control";

export interface AdminTokenPayload {
  id: string;
  name?: string;
  email?: string;
  roles: string[]; // Change to string[] since we're storing roles as strings in the JWT
  exp?: number;
  iat?: number;
}

export async function verifyAdminToken(
  token: string
): Promise<AdminTokenPayload | null> {
  try {
    if (!process.env.JWT_SECRET_KEY) {
      console.error("JWT_SECRET_KEY is not defined");
      return null;
    }

    const secret = new TextEncoder().encode(process.env.JWT_SECRET_KEY);

    const { payload } = await jose.jwtVerify(token, secret);

    // Ensure that the payload contains the expected fields
    if (typeof payload.id !== "string" || !Array.isArray(payload.roles)) {
      console.error("Invalid token payload structure");
      return null;
    }

    // Convert roles back to Role type if needed
    return {
      id: payload.id,
      name: payload.name as string,
      email: payload.email as string,
      roles: payload.roles as string[],
      exp: payload.exp,
      iat: payload.iat,
    };
  } catch (error) {
    console.error("Error verifying admin token:", error);
    return null;
  }
}

// I trust this function more than the one below.
// This was the original code so never delect it in case the one below doesn't work.
// export function getAdminPermissions(roles: Role[]): Permission[] {
//   return getPermissionsForRoles(roles);
// }

export function getAdminPermissions(roles: string[]): Permission[] {
  // Convert string roles back to Role type
  const typedRoles = roles.filter((role): role is Role => {
    // Check if the role is a valid Role
    // console.log("Role:", role);
    return Object.values(ROLES).includes(role as Role);
  });

  // console.log("Typed roles:", typedRoles);

  return getPermissionsForRoles(typedRoles);
}

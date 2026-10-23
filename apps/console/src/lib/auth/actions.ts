"use server";

import { getAdminState } from "./server";

/** The login form calls this right after sign-in: a valid session alone does not grant access. */
export async function hasAdminAccess(): Promise<boolean> {
  return (await getAdminState()) === "admin";
}

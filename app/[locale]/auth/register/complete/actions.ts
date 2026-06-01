"use server";

import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { z } from "zod";
import { db } from "@/database";
import { profile } from "@/database/schema/profile";
import { auth } from "@/lib/auth/server";

const saveProfileSchema = z.object({
  accountType: z.enum(["person", "organization"]),
  orgName: z.string().optional(),
  registrationNumber: z.string().optional(),
  contactName: z.string().optional(),
  contactPhone: z.string().optional(),
  website: z.string().optional(),
});

type SaveProfileInput = z.infer<typeof saveProfileSchema>;

function getOrgValues(data: SaveProfileInput) {
  const isOrg = data.accountType === "organization";
  return {
    orgName: isOrg ? data.orgName : null,
    registrationNumber: isOrg ? data.registrationNumber : null,
    contactName: isOrg ? data.contactName : null,
    contactPhone: isOrg ? data.contactPhone : null,
    website: isOrg ? data.website : null,
  };
}

export async function saveProfile(
  data: SaveProfileInput
): Promise<{ success: boolean; error?: string }> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return { success: false, error: "Unauthorized" };
  }

  const parsed = saveProfileSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: "Invalid data" };
  }

  const { accountType } = parsed.data;
  const orgValues = getOrgValues(parsed.data);
  const now = new Date();

  const existing = await db
    .select({ id: profile.id })
    .from(profile)
    .where(eq(profile.userId, session.user.id))
    .limit(1);

  if (existing.length > 0) {
    await db
      .update(profile)
      .set({ accountType, ...orgValues, updatedAt: now })
      .where(eq(profile.userId, session.user.id));
  } else {
    await db.insert(profile).values({
      id: crypto.randomUUID(),
      userId: session.user.id,
      accountType,
      ...orgValues,
      createdAt: now,
      updatedAt: now,
    });
  }

  return { success: true };
}

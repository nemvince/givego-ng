"use server";

import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { z } from "zod";
import { db } from "@/database";
import { profile } from "@/database/schema/profile";
import { userSettings } from "@/database/schema/settings";
import { auth } from "@/lib/auth/server";

const updateProfileSchema = z.object({
  description: z.string().max(500).optional(),
  website: z.string().url().or(z.literal("")).optional(),
  contactName: z.string().optional(),
  contactPhone: z.string().optional(),
  showContactName: z.boolean().optional(),
  showContactPhone: z.boolean().optional(),
});

type UpdateProfileInput = z.infer<typeof updateProfileSchema>;

export async function updateProfile(
  data: UpdateProfileInput
): Promise<{ success: boolean; error?: string }> {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user) {
    return { success: false, error: "Unauthorized" };
  }

  const parsed = updateProfileSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: "Invalid data" };
  }

  await db
    .update(profile)
    .set({ ...parsed.data, updatedAt: new Date() })
    .where(eq(profile.userId, session.user.id));

  return { success: true };
}

const updateSettingsSchema = z.object({
  emailNotifications: z.boolean().optional(),
  inAppNotifications: z.boolean().optional(),
});

type UpdateSettingsInput = z.infer<typeof updateSettingsSchema>;

export async function updateSettings(
  data: UpdateSettingsInput
): Promise<{ success: boolean; error?: string }> {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user) {
    return { success: false, error: "Unauthorized" };
  }

  const parsed = updateSettingsSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: "Invalid data" };
  }

  const existing = await db
    .select({ id: userSettings.id })
    .from(userSettings)
    .where(eq(userSettings.userId, session.user.id))
    .limit(1);

  if (existing.length > 0) {
    await db
      .update(userSettings)
      .set({ ...parsed.data, updatedAt: new Date() })
      .where(eq(userSettings.userId, session.user.id));
  } else {
    await db.insert(userSettings).values({
      userId: session.user.id,
      emailNotifications: parsed.data.emailNotifications ?? true,
      inAppNotifications: parsed.data.inAppNotifications ?? true,
    });
  }

  return { success: true };
}

export async function softDeleteAccount(): Promise<{
  success: boolean;
  error?: string;
}> {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user) {
    return { success: false, error: "Unauthorized" };
  }

  await db
    .update(profile)
    .set({ deletedAt: new Date() })
    .where(eq(profile.userId, session.user.id));

  await auth.api.revokeSessions({ headers: await headers() });

  return { success: true };
}

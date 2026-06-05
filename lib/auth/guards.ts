import { and, eq, isNull } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "@/database";
import { profile } from "@/database/schema/profile";
import { auth } from "@/lib/auth/server";

export async function requireOrg() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) {
    return { session: null, profile: null, error: "Unauthorized" };
  }

  const [profileData] = await db
    .select({
      accountType: profile.accountType,
      orgName: profile.orgName,
    })
    .from(profile)
    .where(and(eq(profile.userId, session.user.id), isNull(profile.deletedAt)))
    .limit(1);

  if (!profileData || profileData.accountType !== "organization") {
    return {
      session,
      profile: profileData,
      error: "Organization account required",
    };
  }

  return { session, profile: profileData, error: null };
}

export async function requireOrgOrRedirect() {
  const { session, profile, error } = await requireOrg();
  if (error || !session?.user) {
    redirect("/");
  }
  return { session, profile };
}

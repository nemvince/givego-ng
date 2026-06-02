import { and, eq, isNull } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { BreadcrumbTrail } from "@/components/layout/breadcrumb-trail";
import { ProfileForm } from "@/components/profile/profile-form";
import { db } from "@/database";
import { passkey as passkeyTable } from "@/database/schema/auth";
import { profile } from "@/database/schema/profile";
import { userSettings } from "@/database/schema/settings";
import { auth } from "@/lib/auth/server";

export default async function ProfilePage() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user) {
    redirect("/auth/login");
  }

  const [profileData] = await db
    .select()
    .from(profile)
    .where(and(eq(profile.userId, session.user.id), isNull(profile.deletedAt)))
    .limit(1);

  const [settingsData] = await db
    .select()
    .from(userSettings)
    .where(eq(userSettings.userId, session.user.id))
    .limit(1);

  const passkeys = await db
    .select()
    .from(passkeyTable)
    .where(eq(passkeyTable.userId, session.user.id));

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-6">
      <BreadcrumbTrail
        items={[
          { href: "/", isTranslationKey: true, label: "navigation.home" },
          { isTranslationKey: true, label: "navbar.profile" },
        ]}
      />
      <ProfileForm
        passkeys={passkeys}
        profile={profileData ?? null}
        session={session}
        settings={settingsData ?? null}
      />
    </div>
  );
}

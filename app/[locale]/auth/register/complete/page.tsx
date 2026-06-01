import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { RegisterCompleteForm } from "@/components/auth/register-complete-form";
import { db } from "@/database";
import { profile } from "@/database/schema/profile";
import { auth } from "@/lib/auth/server";

export default async function RegisterCompletePage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/auth/register");
  }

  const existingProfile = await db
    .select({ id: profile.id })
    .from(profile)
    .where(eq(profile.userId, session.user.id))
    .limit(1);

  if (existingProfile.length > 0) {
    redirect("/");
  }

  return (
    <main className="flex grow items-center justify-center">
      <section className="flex w-full max-w-sm flex-col gap-6 md:max-w-4xl">
        <RegisterCompleteForm />
      </section>
    </main>
  );
}

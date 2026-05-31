import { getTranslations } from "next-intl/server";
import type { ReactNode } from "react";
import { LoginForm } from "@/components/auth/login-form";
import { FieldDescription } from "@/components/ui/field";

export default async function LoginPage() {
  const t = await getTranslations("auth.login");

  return (
    <main className="flex grow items-center justify-center">
      <section className="flex w-full max-w-sm flex-col gap-6 md:max-w-4xl">
        <LoginForm />
        <FieldDescription className="px-6 text-center">
          {t.rich("termsAgreement", {
            terms: (chunks: ReactNode) => <a href="/terms">{chunks}</a>,
            privacy: (chunks: ReactNode) => <a href="/privacy">{chunks}</a>,
          })}
        </FieldDescription>
      </section>
    </main>
  );
}

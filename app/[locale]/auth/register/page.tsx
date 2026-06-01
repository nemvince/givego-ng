import { getTranslations } from "next-intl/server";
import type { ReactNode } from "react";
import { RegisterForm } from "@/components/auth/register-form";
import { FieldDescription } from "@/components/ui/field";

export default async function RegisterPage() {
  const t = await getTranslations("auth.register");

  return (
    <main className="flex grow items-center justify-center">
      <section className="flex w-full max-w-sm flex-col gap-6 md:max-w-4xl">
        <RegisterForm />
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

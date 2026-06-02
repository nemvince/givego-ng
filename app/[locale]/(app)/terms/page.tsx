import { getTranslations } from "next-intl/server";
import { BreadcrumbTrail } from "@/components/layout/breadcrumb-trail";

export default async function TermsPage() {
  const t = await getTranslations("terms");

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-6">
      <BreadcrumbTrail
        items={[
          { href: "/", isTranslationKey: true, label: "navigation.home" },
          { isTranslationKey: true, label: "terms.title" },
        ]}
      />
      <div className="space-y-4">
        <h1 className="font-bold text-2xl">{t("title")}</h1>
        <p className="text-muted-foreground">{t("placeholder")}</p>
      </div>
    </div>
  );
}
